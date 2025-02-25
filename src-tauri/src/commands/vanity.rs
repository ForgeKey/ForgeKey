use std::process::Command;
use crate::utils::get_cast_binary;
use crate::models::{WalletInfo, Password};
use log::error;

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

pub fn create_vanity_wallet(
  starts_with: Option<String>,
  ends_with: Option<String>,
  address_label: String,
  password: String,
) -> Result<String, String> {
  let cast_path = get_cast_binary()?;

  // Convert the password to our secure Password type
  let password = Password::from_string(password);

  let mut cmd = Command::new(cast_path);
  cmd.arg("wallet").arg("vanity");
  
  if let Some(prefix) = starts_with {
    cmd.arg("--starts-with").arg(prefix);
  }
  
  if let Some(suffix) = ends_with {
    cmd.arg("--ends-with").arg(suffix);
  }

  let output = cmd.output().map_err(|e| {
    // password will be automatically zeroized when dropped
    let err_msg = format!("Failed to execute cast wallet vanity command: {}", e);
    error!("{}", err_msg);
    err_msg
  })?;
  
  if !output.status.success() {
    // password will be automatically zeroized when dropped
    let err_msg = String::from_utf8_lossy(&output.stderr).into_owned();
    error!("Failed to create vanity wallet for {}: {}", address_label, err_msg);
    return Err(err_msg);
  }

  let mut wallet_info = parse_vanity_output(output.stdout)?;

  // Store the address before we zeroize the wallet_info
  let address = wallet_info.address.clone();
  
  // We need to clone the password here to pass ownership to import_wallet
  let password_clone = Password::new(password.as_str());
  
  let result = crate::commands::import_wallet(
    std::mem::take(&mut wallet_info.private_key), // Move the private key instead of cloning
    address_label,
    password_clone
  );

  // Return the result or the address if successful
  match result {
    Ok(_) => Ok(address),
    Err(e) => Err(e),
  }
}
