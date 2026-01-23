use std::process::{Command, Stdio};
use crate::utils::get_cast_binary;
use crate::models::Password;
use log::error;

pub fn list_wallets() -> Result<Vec<String>, String> {
  let cast_path = get_cast_binary()?;

  let output = Command::new(cast_path)
    .arg("wallet")
    .arg("list")
    .arg("--dir") // todo: should we use --all in the future?
    .output()
    .map_err(|e| {
      let err_msg = format!("Failed to execute cast wallet list command: {}", e);
      error!("{}", err_msg);
      err_msg
    })?;

  if !output.status.success() {
    let err_msg = String::from_utf8_lossy(&output.stderr).to_string();
    error!("Failed to list wallets: {}", err_msg);
    return Err(err_msg);
  }

  let output_str = String::from_utf8_lossy(&output.stdout);
  let wallets: Vec<String> = output_str
    .lines()
    .map(|line| {
      line.trim()
        .split(" (")  // Split at " (" to remove "(Local)"
        .next()       // Take the first part
        .unwrap_or("") // Handle the case where split returns nothing
        .to_string()
    })
    .collect();

  Ok(wallets)
}

pub fn get_wallet_address(keystore_name: &str, password: &str) -> Result<String, String> {
  let cast_path = get_cast_binary()?;

  // Convert the password to our secure Password type
  let password = Password::new(password);

  // Use --password flag since cast wallet address doesn't support CAST_UNSAFE_PASSWORD env var
  let output = Command::new(&cast_path)
    .arg("wallet")
    .arg("address")
    .arg("--account")
    .arg(keystore_name)
    .arg("--password")
    .arg(password.as_str())
    .stdin(Stdio::null())
    .stdout(Stdio::piped())
    .stderr(Stdio::piped())
    .output()
    .map_err(|e| {
      let err_msg = format!("Failed to execute cast wallet address command: {}", e);
      error!("{}", err_msg);
      err_msg
    })?;

  if !output.status.success() {
    let err_msg = String::from_utf8_lossy(&output.stderr).to_string();
    error!("Failed to get wallet address: {}", err_msg);
    return Err(err_msg);
  }

  let address = String::from_utf8_lossy(&output.stdout).trim().to_string();
  Ok(address)
}
