use std::process::Command;
use crate::models::WalletInfo;
use crate::utils::get_cast_binary;
use log::error;

pub fn create_new_wallet(address_label: String, password: String) -> Result<String, String> { 
  let cast_path = get_cast_binary()?;

  let output = Command::new(cast_path)
    .arg("wallet")
    .arg("new")
    .output()
    .map_err(|e| {
      let err_msg = format!("Failed to execute cast wallet new command: {}", e);
      error!("{}", err_msg);
      err_msg
    })?;

  if !output.status.success() {
    let err_msg = String::from_utf8_lossy(&output.stderr).to_string();
    error!("Failed to create new wallet for {}: {}", address_label, err_msg);
    return Err(err_msg);
  }

  let wallet_info = parse_wallet_output(&String::from_utf8_lossy(&output.stdout))?;
  
  crate::commands::import::import_wallet(
    wallet_info.private_key.clone(),
    address_label,
    password
  )?;

  Ok(wallet_info.address.to_string())
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