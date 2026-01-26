use crate::utils::get_cast_binary;
use crate::models::Password;
use crate::pty::{run_with_password, PtyConfig};
use log::error;
use zeroize::Zeroizing;

pub fn decrypt_keystore(keystore_name: String, password: String) -> Result<String, String> {
  let cast_path = get_cast_binary()?;

  // Convert the password to our secure Password type
  let password = Password::from_string(password);

  // Use PTY-based password input for security (password not visible in process list)
  let config = PtyConfig::default(); // Single password prompt
  let result = run_with_password(
    &cast_path,
    &["wallet", "decrypt-keystore", &keystore_name],
    &password,
    &config,
  ).map_err(|e| {
    let err_msg = format!("Failed to execute cast wallet decrypt-keystore command: {}", e);
    error!("{}", err_msg);
    err_msg
  })?;

  if !result.success() {
    let err_msg = result.output.clone();
    error!("Failed to decrypt keystore {}: {}", keystore_name, err_msg);
    return Err(err_msg);
  }

  // Parse the private key and wrap it in Zeroizing to ensure it's zeroized when dropped
  let private_key = Zeroizing::new(parse_private_key_from_output(&result.output)?);

  // SECURITY WARNING: The returned private key is not automatically zeroized.
  // The frontend MUST zeroize this value after use by overwriting it with zeros
  // or using a secure zeroizing library.
  let key_result = private_key.to_string();

  // private_key will be automatically zeroized when dropped at the end of this function
  Ok(key_result)
}

fn parse_private_key_from_output(output_str: &str) -> Result<String, String> {
  Ok(output_str
    .split("private key is: ")
    .nth(1)
    .ok_or_else(|| {
        let err_msg = "Could not find private key in output".to_string();
        error!("{}", err_msg);
        err_msg
    })?
    .trim()
    .to_string())
}
