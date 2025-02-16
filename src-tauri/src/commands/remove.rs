use std::{fs, path::PathBuf};
use dirs::home_dir;

pub fn remove_keystore(keystore_name: String, keystore_path: Option<String>) -> Result<(), String> {
    let home = home_dir().ok_or("Could not find home directory")?;
    let default_path = home.join(".foundry").join("keystores");
    
    let keystore_path = match keystore_path {
      Some(path) => {
        let custom_path = PathBuf::from(path);
        if custom_path.exists() {
            custom_path
        } else {
            default_path
        }
      },
      None => default_path
    };

    let full_path = keystore_path.join(&keystore_name);

    if !full_path.exists() {
      return Err(format!("Keystore file '{}' does not exist", keystore_name));
    }

    fs::remove_file(&full_path)
      .map_err(|e| format!("Failed to remove keystore file: {}", e))?;

    Ok(())
}