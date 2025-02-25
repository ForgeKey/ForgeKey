use std::process::{Command, Stdio};
use crate::utils::get_cast_binary;
use log::error;

pub fn import_wallet(private_key: String, address_label: String, password: String) -> Result<String, String> {
  let cast_path = get_cast_binary()?;

  let output = Command::new(cast_path)
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
    .map_err(|e| {
      let err_msg = format!("Failed to spawn cast wallet import command: {}", e);
      error!("{}", err_msg);
      err_msg
    })?
    .wait_with_output()
    .map_err(|e| {
      let err_msg = format!("Failed to get command output: {}", e);
      error!("{}", err_msg);
      err_msg
    })?;

  if !output.status.success() {
    let err_msg = String::from_utf8_lossy(&output.stderr).to_string();
    error!("Failed to import wallet for {}: {}", address_label, err_msg);
    return Err(err_msg);
  }

  parse_address_from_output(&String::from_utf8_lossy(&output.stdout))
}

fn parse_address_from_output(output_str: &str) -> Result<String, String> {
  Ok(output_str
    .split("Address: ")
    .nth(1)
    .ok_or_else(|| {
      let err_msg = "Could not find address in output".to_string();
      error!("{}", err_msg);
      err_msg
    })?
    .trim()
    .to_string())
}