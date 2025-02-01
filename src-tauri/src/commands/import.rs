use std::process::{Command, Stdio};

pub fn import_wallet(private_key: String, address_label: String, password: String) -> Result<String, String> {
  let output = Command::new("cast")
    .arg("wallet")
    .arg("import")
    .arg("--private-key")
    .arg(&private_key)
    .arg("--unsafe-password")
    .arg(&password)
    .arg(&address_label)
    .stdin(Stdio::piped())
    .stdout(Stdio::piped())
    .stderr(Stdio::piped())
    .spawn()
    .map_err(|e| format!("Failed to spawn cast wallet import command: {}", e))?
    .wait_with_output()
    .map_err(|e| format!("Failed to get command output: {}", e))?;

  if !output.status.success() {
    return Err(String::from_utf8_lossy(&output.stderr).to_string());
  }

  parse_address_from_output(&String::from_utf8_lossy(&output.stdout))
}

fn parse_address_from_output(output_str: &str) -> Result<String, String> {
  Ok(output_str
    .split("Address: ")
    .nth(1)
    .ok_or("Could not find address in output")?
    .trim()
    .to_string())
}