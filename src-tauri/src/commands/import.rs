use std::time::Duration;
use crate::utils::get_cast_binary;
use crate::models::Password;
use crate::pty::{run_with_password, PtyConfig};
use log::error;
use zeroize::Zeroize;

// Add a new function that accepts a Password object directly
pub fn import_wallet(mut private_key: String, address_label: String, password: Password) -> Result<String, String> {
  let cast_path = get_cast_binary()?;

  // Use PTY-based password input for security (password not visible in process list)
  // Import requires 2 password prompts: initial password and confirmation
  let config = PtyConfig {
    timeout: Duration::from_secs(30),
    password_prompt_count: 2,
  };

  let result = run_with_password(
    &cast_path,
    &["wallet", "import", "--private-key", &private_key, &address_label],
    &password,
    &config,
  );

  // Zeroize the private key as soon as we don't need it anymore
  private_key.zeroize();

  let pty_result = result.map_err(|e| {
    let err_msg = format!("Failed to execute cast wallet import command: {}", e);
    error!("{}", err_msg);
    err_msg
  })?;

  if !pty_result.success() {
    let err_msg = pty_result.output.clone();
    error!("Failed to import wallet for {}: {}", address_label, err_msg);
    return Err(err_msg);
  }

  parse_address_from_output(&pty_result.output)
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