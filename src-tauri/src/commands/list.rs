use std::process::Command;
use crate::utils::get_cast_binary;
use crate::models::Password;
use crate::pty::{run_with_password, PtyConfig};
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

  // Use PTY-based password input for security (password not visible in process list)
  let config = PtyConfig::default(); // Single password prompt
  let result = run_with_password(
    &cast_path,
    &["wallet", "address", "--account", keystore_name],
    &password,
    &config,
  ).map_err(|e| {
    let err_msg = format!("Failed to execute cast wallet address command: {}", e);
    error!("{}", err_msg);
    err_msg
  })?;

  if !result.success() {
    let err_msg = result.output.clone();
    error!("Failed to get wallet address: {}", err_msg);
    return Err(err_msg);
  }

  // Parse the address from the output (trim whitespace and any extra characters)
  let address = result.output.trim().to_string();
  Ok(address)
}
