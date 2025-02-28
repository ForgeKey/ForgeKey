use std::process::{Command, Stdio};
use crate::utils::get_cast_binary;
use crate::models::Password;
use log::error;
use zeroize::Zeroize;

// Add a new function that accepts a Password object directly
pub fn import_wallet(mut private_key: String, address_label: String, password: Password) -> Result<String, String> {
  let cast_path = get_cast_binary()?;
  
  // Use with_env method to ensure the password remains valid during command execution
  let result = password.with_env("CAST_UNSAFE_PASSWORD", |env_vars| {
    Command::new(&cast_path)
      .arg("wallet")
      .arg("import")
      .arg("--private-key")
      .arg(&private_key)
      .arg(&address_label)
      .envs(env_vars)
      .stdout(Stdio::piped())
      .stderr(Stdio::piped())
      .output()
  });
  
  // Now handle the result of the command
  let output = result.map_err(|e| {
    // Zeroize the private key before returning the error
    private_key.zeroize();
    let err_msg = format!("Failed to execute cast wallet import command: {}", e);
    error!("{}", err_msg);
    err_msg
  })?;

  // Zeroize the private key as soon as we don't need it anymore
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