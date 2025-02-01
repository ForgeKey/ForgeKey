use std::process::Command;

pub fn list_wallets() -> Result<Vec<String>, String> {
    let output = Command::new("cast")
        .arg("wallet")
        .arg("list")
        .arg("--dir") // todo: should we use --all in the future?
        .output()
        .map_err(|e| e.to_string())?;

    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).to_string());
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
