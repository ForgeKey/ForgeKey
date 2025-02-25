use std::process::{Command, Stdio};
use crate::utils::get_cast_binary;
use crate::models::Password;
use log::error;
use zeroize::Zeroizing;

pub fn decrypt_keystore(keystore_name: String, password: String) -> Result<String, String> {
  let cast_path = get_cast_binary()?;

  // Convert the password to our secure Password type
  let password = Password::from_string(password);
  
  // Use the safer with_env method to ensure the password remains valid during command execution
  let output = password.with_env("CAST_UNSAFE_PASSWORD", |env_vars| {
    Command::new(&cast_path)
      .arg("wallet")
      .arg("decrypt-keystore")
      .arg(&keystore_name)
      .envs(env_vars)
      .stdout(Stdio::piped())
      .stderr(Stdio::piped())
      .output()
  }).map_err(|e| {
    // password will be automatically zeroized when dropped
    let err_msg = format!("Failed to execute cast wallet decrypt-keystore command: {}", e);
    error!("{}", err_msg);
    err_msg
  })?;

  if !output.status.success() {
    let err_msg = String::from_utf8_lossy(&output.stderr).to_string();
    error!("Failed to decrypt keystore {}: {}", keystore_name, err_msg);
    return Err(err_msg);
  }

  // Parse the private key and wrap it in Zeroizing to ensure it's zeroized when dropped
  let private_key = Zeroizing::new(parse_private_key_from_output(&String::from_utf8_lossy(&output.stdout))?);
  
  // SECURITY WARNING: The returned private key is not automatically zeroized.
  // The frontend MUST zeroize this value after use by overwriting it with zeros
  // or using a secure zeroizing library.
  let result = private_key.to_string();
  
  // private_key will be automatically zeroized when dropped at the end of this function
  Ok(result)
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
