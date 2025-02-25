use std::process::{Command, Stdio};
use std::collections::HashMap;
use crate::utils::get_cast_binary;
use log::error;
use zeroize::Zeroize;

pub fn decrypt_keystore(keystore_name: String, password: String) -> Result<String, String> {
    let cast_path = get_cast_binary()?;

    // Create a mutable copy of the password that we can zeroize later
    let mut password_to_zeroize = password.clone();
    
    // Set up environment variables
    let mut env_vars = HashMap::new();
    env_vars.insert("CAST_UNSAFE_PASSWORD", &password);

    let output = Command::new(cast_path)
        .arg("wallet")
        .arg("decrypt-keystore")
        .arg(&keystore_name)
        .envs(&env_vars)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .output()
        .map_err(|e| {
            // Zeroize the password before returning the error
            password_to_zeroize.zeroize();
            let err_msg = format!("Failed to execute cast wallet decrypt-keystore command: {}", e);
            error!("{}", err_msg);
            err_msg
        })?;

    // Zeroize the password as soon as we don't need it anymore
    password_to_zeroize.zeroize();

    if !output.status.success() {
        let err_msg = String::from_utf8_lossy(&output.stderr).to_string();
        error!("Failed to decrypt keystore {}: {}", keystore_name, err_msg);
        return Err(err_msg);
    }

    // Parse the private key and return it
    let mut private_key = parse_private_key_from_output(&String::from_utf8_lossy(&output.stdout))?;
    
    // Create a copy that we can return
    let result = private_key.clone();
    
    // Zeroize our copy
    private_key.zeroize();
    
    // Return the result (frontend must zeroize this when done)
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
