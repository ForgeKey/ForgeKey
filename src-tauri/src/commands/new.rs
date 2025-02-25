use std::process::Command;
use crate::models::{WalletInfo, Password};
use crate::utils::get_cast_binary;
use log::error;

pub fn create_new_wallet(address_label: String, password: String) -> Result<String, String> { 
  let cast_path = get_cast_binary()?;

  // Convert the password to our secure Password type
  let password = Password::from_string(password);

  let output = Command::new(cast_path)
    .arg("wallet")
    .arg("new")
    .output()
    .map_err(|e| {
      // password will be automatically zeroized when dropped
      let err_msg = format!("Failed to execute cast wallet new command: {}", e);
      error!("{}", err_msg);
      err_msg
    })?;

  if !output.status.success() {
    // password will be automatically zeroized when dropped
    let err_msg = String::from_utf8_lossy(&output.stderr).to_string();
    error!("Failed to create new wallet for {}: {}", address_label, err_msg);
    return Err(err_msg);
  }

  let mut wallet_info = parse_wallet_output(&String::from_utf8_lossy(&output.stdout))?;
  
  // Store the address before we zeroize the wallet_info
  let address = wallet_info.address.clone();
  
  // Import the wallet (this will handle zeroizing the private_key internally)
  // We need to clone the password here to pass ownership to import_wallet
  // The original password will be zeroized when dropped at the end of this function
  let password_clone = Password::new(password.as_str());
  
  let result = crate::commands::import::import_wallet(
    std::mem::take(&mut wallet_info.private_key), // Move the private key instead of cloning
    address_label,
    password_clone.into_string()
  );

  // Return the result or the address if successful
  match result {
    Ok(_) => Ok(address),
    Err(e) => Err(e),
  }
}

fn parse_wallet_output(output_str: &str) -> Result<WalletInfo, String> {
  let address = output_str
    .lines()
    .find(|line| line.trim().starts_with("Address:"))
    .and_then(|line| line.split_whitespace().last())
    .ok_or_else(|| {
      let err_msg = "Could not parse address from output".to_string();
      error!("{}", err_msg);
      err_msg
    })?;

  let private_key = output_str
    .lines()
    .find(|line| line.trim().starts_with("Private key:"))
    .and_then(|line| line.split_whitespace().last())
    .ok_or_else(|| {
      let err_msg = "Could not parse private key from output".to_string();
      error!("{}", err_msg);
      err_msg
    })?;

  Ok(WalletInfo {
    address: address.to_string(),
    private_key: private_key.to_string(),
  })
} 