use std::process::Command;
use crate::models::WalletInfo;

pub fn create_new_wallet() -> Result<WalletInfo, String> {
    let output = Command::new("cast")
        .arg("wallet")
        .arg("new")
        .output()
        .map_err(|e| format!("Failed to execute cast wallet new command: {}", e))?;

    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).to_string());
    }

    parse_wallet_output(&String::from_utf8_lossy(&output.stdout))
}

fn parse_wallet_output(output_str: &str) -> Result<WalletInfo, String> {
    let address = output_str
        .lines()
        .find(|line| line.trim().starts_with("Address:"))
        .and_then(|line| line.split_whitespace().last())
        .ok_or("Could not parse address from output")?;

    let private_key = output_str
        .lines()
        .find(|line| line.trim().starts_with("Private key:"))
        .and_then(|line| line.split_whitespace().last())
        .ok_or("Could not parse private key from output")?;

    Ok(WalletInfo {
        address: address.to_string(),
        private_key: private_key.to_string(),
    })
} 