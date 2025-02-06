use std::process::{Command, Stdio};

pub fn decrypt_keystore(keystore_name: String, password: String) -> Result<String, String> {
    let output = Command::new("cast")
        .arg("wallet")
        .arg("decrypt-keystore")
        .arg("--unsafe-password")
        .arg(&password)
        .arg(&keystore_name)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Failed to spawn cast wallet decrypt-keystore command: {}", e))?
        .wait_with_output()
        .map_err(|e| format!("Failed to get command output: {}", e))?;

    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).to_string());
    }

    parse_private_key_from_output(&String::from_utf8_lossy(&output.stdout))
}

fn parse_private_key_from_output(output_str: &str) -> Result<String, String> {
  Ok(output_str
    .split("private key is: ")
    .nth(1)
    .ok_or("Could not find address in output")?
    .trim()
    .to_string())
}
