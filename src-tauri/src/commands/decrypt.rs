use std::process::{Command, Stdio};
use crate::utils::get_cast_binary;
use log::error;

pub fn decrypt_keystore(keystore_name: String, password: String) -> Result<String, String> {
    let cast_path = get_cast_binary()?;

    let output = Command::new(cast_path)
        .arg("wallet")
        .arg("decrypt-keystore")
        .arg("--unsafe-password")
        .arg(&password)
        .arg(&keystore_name)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| {
            let err_msg = format!("Failed to spawn cast wallet decrypt-keystore command: {}", e);
            error!("{}", err_msg);
            err_msg
        })?
        .wait_with_output()
        .map_err(|e| {
            let err_msg = format!("Failed to get command output: {}", e);
            error!("{}", err_msg);
            err_msg
        })?;

    if !output.status.success() {
        let err_msg = String::from_utf8_lossy(&output.stderr).to_string();
        error!("Failed to decrypt keystore {}: {}", keystore_name, err_msg);
        return Err(err_msg);
    }

    parse_private_key_from_output(&String::from_utf8_lossy(&output.stdout))
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
