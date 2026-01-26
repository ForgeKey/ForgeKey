use portable_pty::{native_pty_system, CommandBuilder, PtySize};
use std::io::{Read, Write};
use std::path::Path;
use std::time::Duration;
use log::error;

use crate::models::Password;

/// Configuration for PTY-based command execution
pub struct PtyConfig {
    /// Timeout for the entire operation
    pub timeout: Duration,
    /// Number of password prompts to expect (1 for decrypt/address, 2 for import with confirmation)
    pub password_prompt_count: u8,
}

impl Default for PtyConfig {
    fn default() -> Self {
        Self {
            timeout: Duration::from_secs(30),
            password_prompt_count: 1,
        }
    }
}

/// Result from a successful PTY command execution
pub struct PtyResult {
    /// Combined stdout/stderr output from the command
    pub output: String,
    /// Exit code from the command (0 = success)
    pub exit_code: i32,
}

impl PtyResult {
    /// Check if the command succeeded (exit code 0)
    pub fn success(&self) -> bool {
        self.exit_code == 0
    }
}

/// Errors that can occur during PTY operations
#[derive(Debug)]
pub enum PtyError {
    /// Failed to create PTY pair
    PtyCreation(String),
    /// Failed to spawn the command
    SpawnFailed(String),
    /// Operation timed out
    Timeout,
    /// I/O error during read/write
    IoError(String),
    /// Command execution failed
    CommandFailed(String),
}

impl std::fmt::Display for PtyError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            PtyError::PtyCreation(msg) => write!(f, "Failed to create PTY: {}", msg),
            PtyError::SpawnFailed(msg) => write!(f, "Failed to spawn command: {}", msg),
            PtyError::Timeout => write!(f, "Operation timed out"),
            PtyError::IoError(msg) => write!(f, "I/O error: {}", msg),
            PtyError::CommandFailed(msg) => write!(f, "Command failed: {}", msg),
        }
    }
}

impl std::error::Error for PtyError {}

/// Run a cast command with password input via PTY stdin
///
/// This function spawns the cast command in a PTY and sends the password
/// via stdin when prompted. This is more secure than using environment
/// variables or CLI flags, as the password is not visible in process listings.
///
/// # Arguments
/// * `cast_path` - Path to the cast binary
/// * `args` - Arguments to pass to cast
/// * `password` - Password to send when prompted
/// * `config` - Configuration for timeout and prompt count
///
/// # Returns
/// * `Ok(PtyResult)` - Command output and exit code
/// * `Err(PtyError)` - Error if the command failed
pub fn run_with_password(
    cast_path: &Path,
    args: &[&str],
    password: &Password,
    config: &PtyConfig,
) -> Result<PtyResult, PtyError> {
    let pty_system = native_pty_system();

    // Create a new PTY pair
    let pair = pty_system
        .openpty(PtySize {
            rows: 24,
            cols: 80,
            pixel_width: 0,
            pixel_height: 0,
        })
        .map_err(|e| {
            let msg = format!("{}", e);
            error!("Failed to create PTY: {}", msg);
            PtyError::PtyCreation(msg)
        })?;

    // Build the command
    let mut cmd = CommandBuilder::new(cast_path);
    for arg in args {
        cmd.arg(*arg);
    }

    // Spawn the command in the PTY
    let mut child = pair.slave.spawn_command(cmd).map_err(|e| {
        let msg = format!("{}", e);
        error!("Failed to spawn command: {}", msg);
        PtyError::SpawnFailed(msg)
    })?;

    // Get the master for reading/writing
    let mut master = pair.master.take_writer().map_err(|e| {
        let msg = format!("{}", e);
        error!("Failed to get PTY writer: {}", msg);
        PtyError::IoError(msg)
    })?;

    let mut reader = pair.master.try_clone_reader().map_err(|e| {
        let msg = format!("{}", e);
        error!("Failed to get PTY reader: {}", msg);
        PtyError::IoError(msg)
    })?;

    // Buffer for reading output
    let mut output = String::new();
    let mut prompts_handled = 0u8;
    let mut buf = [0u8; 1024];

    let start_time = std::time::Instant::now();

    // Read until we've handled all password prompts
    while prompts_handled < config.password_prompt_count {
        // Check for timeout
        if start_time.elapsed() > config.timeout {
            error!("PTY operation timed out");
            let _ = child.kill();
            return Err(PtyError::Timeout);
        }

        // Try to read available data (non-blocking would be ideal, but we'll use small reads)
        match reader.read(&mut buf) {
            Ok(0) => {
                // EOF - process has closed its output
                break;
            }
            Ok(n) => {
                let chunk = String::from_utf8_lossy(&buf[..n]);
                output.push_str(&chunk);

                // Check if we have a password prompt (ends with ": " or ":")
                // Cast prompts are like "Enter password: " or "Enter password to encrypt keystore: "
                if output.ends_with(": ") || output.trim_end().ends_with(':') {
                    // Send password followed by newline
                    master.write_all(password.as_str().as_bytes()).map_err(|e| {
                        let msg = format!("{}", e);
                        error!("Failed to write password: {}", msg);
                        PtyError::IoError(msg)
                    })?;
                    master.write_all(b"\n").map_err(|e| {
                        let msg = format!("{}", e);
                        error!("Failed to write newline: {}", msg);
                        PtyError::IoError(msg)
                    })?;
                    master.flush().map_err(|e| {
                        let msg = format!("{}", e);
                        error!("Failed to flush: {}", msg);
                        PtyError::IoError(msg)
                    })?;

                    prompts_handled += 1;

                    // Clear the output buffer after handling a prompt to avoid re-detecting it
                    output.clear();
                }
            }
            Err(e) => {
                // Check if it's a "would block" type error, which we can retry
                if e.kind() == std::io::ErrorKind::WouldBlock {
                    std::thread::sleep(Duration::from_millis(10));
                    continue;
                }
                let msg = format!("{}", e);
                error!("Failed to read from PTY: {}", msg);
                return Err(PtyError::IoError(msg));
            }
        }
    }

    // Read any remaining output after password prompts
    loop {
        if start_time.elapsed() > config.timeout {
            error!("PTY operation timed out while reading remaining output");
            let _ = child.kill();
            return Err(PtyError::Timeout);
        }

        match reader.read(&mut buf) {
            Ok(0) => break, // EOF
            Ok(n) => {
                let chunk = String::from_utf8_lossy(&buf[..n]);
                output.push_str(&chunk);
            }
            Err(e) if e.kind() == std::io::ErrorKind::WouldBlock => {
                // Try to check if process has exited
                match child.try_wait() {
                    Ok(Some(_)) => break, // Process exited
                    Ok(None) => {
                        std::thread::sleep(Duration::from_millis(10));
                        continue;
                    }
                    Err(_) => break,
                }
            }
            Err(e) => {
                // For other errors, check if the process has exited
                match child.try_wait() {
                    Ok(Some(_)) => break,
                    _ => {
                        let msg = format!("{}", e);
                        error!("Failed to read remaining output: {}", msg);
                        return Err(PtyError::IoError(msg));
                    }
                }
            }
        }
    }

    // Wait for the child to exit
    let exit_status = child.wait().map_err(|e| {
        let msg = format!("{}", e);
        error!("Failed to wait for child: {}", msg);
        PtyError::CommandFailed(msg)
    })?;

    // Get the exit code
    let exit_code = exit_status.exit_code() as i32;

    // Strip ANSI escape codes from output for cleaner parsing
    let clean_output = strip_ansi_codes(&output);

    Ok(PtyResult {
        output: clean_output,
        exit_code,
    })
}

/// Strip ANSI escape codes from a string
fn strip_ansi_codes(s: &str) -> String {
    let mut result = String::with_capacity(s.len());
    let mut chars = s.chars().peekable();

    while let Some(c) = chars.next() {
        if c == '\x1b' {
            // Start of escape sequence
            if chars.peek() == Some(&'[') {
                chars.next(); // consume '['
                // Skip until we hit the end of the escape sequence
                while let Some(&next) = chars.peek() {
                    chars.next();
                    // Escape sequences end with a letter
                    if next.is_ascii_alphabetic() {
                        break;
                    }
                }
            }
        } else {
            result.push(c);
        }
    }

    result
}
