use std::process::Command;
use crate::models::WalletInfo;

fn parse_vanity_output(output: Vec<u8>) -> Result<WalletInfo, String> {
  let output_str = String::from_utf8_lossy(&output);
  let lines: Vec<&str> = output_str.lines().collect();
  
  if lines.len() < 4 {
    return Err("Unexpected output format".to_string());
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
  let mut cmd = Command::new("cast");
  cmd.arg("wallet").arg("vanity");
  
  if let Some(prefix) = starts_with {
    cmd.arg("--starts-with").arg(prefix);
  }
  
  if let Some(suffix) = ends_with {
    cmd.arg("--ends-with").arg(suffix);
  }

  let output = cmd.output().map_err(|e| e.to_string())?;
  
  if !output.status.success() {
    return Err(String::from_utf8_lossy(&output.stderr).into_owned());
  }

  let wallet_info = parse_vanity_output(output.stdout)?;

  crate::commands::import::import_wallet(
    wallet_info.private_key.clone(),
    address_label,
    password
  )?;

  Ok(wallet_info.address.to_string())
}
