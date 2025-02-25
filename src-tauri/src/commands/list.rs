use std::process::Command;
use crate::utils::get_cast_binary;
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
