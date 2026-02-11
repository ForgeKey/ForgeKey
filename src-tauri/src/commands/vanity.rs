use std::process::Command;
use std::sync::Mutex;
use crate::utils::get_cast_binary;
use crate::models::{WalletInfo, Password};
use log::error;

/// Global handle to the running vanity child process, used for cancellation.
static VANITY_CHILD: Mutex<Option<u32>> = Mutex::new(None);

fn parse_vanity_output(output: Vec<u8>) -> Result<WalletInfo, String> {
  let output_str = String::from_utf8_lossy(&output);
  let lines: Vec<&str> = output_str.lines().collect();

  if lines.len() < 4 {
    let err_msg = "Unexpected output format".to_string();
    error!("{}", err_msg);
    return Err(err_msg);
  }

  let address = lines[2]
    .trim_start_matches("Address: ")
    .to_string();
  let private_key = lines[3]
    .trim_start_matches("Private Key: ")
    .to_string();

  Ok(WalletInfo { address, private_key })
}

/// Spawns `cast wallet vanity` on a blocking thread so the UI stays responsive.
/// The child process PID is stored so it can be killed via `cancel_vanity_wallet`.
pub async fn create_vanity_wallet(
  starts_with: Option<String>,
  ends_with: Option<String>,
  address_label: String,
  password: String,
) -> Result<String, String> {
  let cast_path = get_cast_binary()?;
  let password = Password::from_string(password);

  // Build and spawn the child process (non-blocking — we get a Child handle)
  let mut cmd = Command::new(cast_path);
  cmd.arg("wallet").arg("vanity");

  if let Some(prefix) = starts_with {
    cmd.arg("--starts-with").arg(prefix);
  }
  if let Some(suffix) = ends_with {
    cmd.arg("--ends-with").arg(suffix);
  }

  let child = cmd.stdout(std::process::Stdio::piped())
    .stderr(std::process::Stdio::piped())
    .spawn()
    .map_err(|e| {
      let err_msg = format!("Failed to spawn cast wallet vanity: {}", e);
      error!("{}", err_msg);
      err_msg
    })?;

  // Store PID for cancellation
  let pid = child.id();
  {
    let mut guard = VANITY_CHILD.lock().unwrap();
    *guard = Some(pid);
  }

  // Wait for the process on a blocking thread so we don't block the async runtime
  let output_result = tokio::task::spawn_blocking(move || child.wait_with_output()).await;

  // Always clear the stored PID after the process exits or errors
  {
    let mut guard = VANITY_CHILD.lock().unwrap();
    *guard = None;
  }

  let output = output_result
    .map_err(|e| format!("Task join error: {}", e))?
    .map_err(|e| {
      let err_msg = format!("Failed to execute cast wallet vanity command: {}", e);
      error!("{}", err_msg);
      err_msg
    })?;

  if !output.status.success() {
    let err_msg = String::from_utf8_lossy(&output.stderr).into_owned();
    // If the process was killed (signal), treat it as cancellation
    if err_msg.is_empty() || output.status.code().is_none() {
      return Err("Vanity address generation was cancelled".to_string());
    }
    error!("Failed to create vanity wallet for {}: {}", address_label, err_msg);
    return Err(err_msg);
  }

  let mut wallet_info = parse_vanity_output(output.stdout)?;
  let address = wallet_info.address.clone();

  crate::commands::import_wallet(
    std::mem::take(&mut wallet_info.private_key),
    address_label,
    password,
  )?;

  Ok(address)
}

/// Kills the running vanity generation process, if any.
pub fn cancel_vanity_wallet() -> Result<(), String> {
  let mut guard = VANITY_CHILD.lock().unwrap();
  if let Some(pid) = guard.take() {
    #[cfg(unix)]
    unsafe {
      libc::kill(pid as i32, libc::SIGKILL);
    }
    #[cfg(not(unix))]
    {
      let _ = Command::new("taskkill")
        .args(["/PID", &pid.to_string(), "/F"])
        .output();
    }
  }
  Ok(())
}
