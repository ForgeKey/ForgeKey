use std::path::PathBuf;
use dirs::home_dir;
use log::error;

pub fn get_cast_binary() -> Result<PathBuf, String> {
  let home = home_dir().ok_or_else(|| {
    let err_msg = "Could not find home directory".to_string();
    error!("{}", err_msg);
    err_msg
  })?;
  
  let cast_path = home.join(".foundry").join("bin").join("cast");
  if !cast_path.exists() {
    let err_msg = "Cast binary not found. Please ensure Foundry is installed correctly.".to_string();
    error!("{}", err_msg);
    return Err(err_msg);
  }

  Ok(cast_path)
} 