use std::process::{Command, Stdio};
use std::collections::HashMap;
use crate::utils::get_cast_binary;
use log::error;
use zeroize::Zeroize;

pub fn import_wallet(mut private_key: String, address_label: String, password: String) -> Result<String, String> {
  let cast_path = get_cast_binary()?;

  // Create a mutable copy of the password that we can zeroize later
  let mut password_to_zeroize = password.clone();
  
  // Set up environment variables
  let mut env_vars = HashMap::new();
  env_vars.insert("CAST_UNSAFE_PASSWORD", &password);

  let output = Command::new(cast_path)
    .arg("wallet")
    .arg("import")
    .arg("--private-key")
    .arg(&private_key)
    .arg(&address_label)
    .envs(&env_vars)
    .stdout(Stdio::piped())
    .stderr(Stdio::piped())
    .output()
    .map_err(|e| {
      // Zeroize sensitive data before returning the error
      password_to_zeroize.zeroize();
      private_key.zeroize();
      let err_msg = format!("Failed to execute cast wallet import command: {}", e);
      error!("{}", err_msg);
      err_msg
    })?;

  // Zeroize sensitive data as soon as we don't need it anymore
  password_to_zeroize.zeroize();
  private_key.zeroize();

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