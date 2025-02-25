use std::fs;
use dirs::home_dir;
use log::error;

pub fn remove_keystore(keystore_name: String) -> Result<(), String> {
	let home = home_dir().ok_or_else(|| {
		let err_msg = "Could not find home directory".to_string();
		error!("{}", err_msg);
		err_msg
	})?;

	let keystore_path = home.join(".foundry").join("keystores");

	let full_path = keystore_path.join(&keystore_name);

	if !full_path.exists() {
		let err_msg = format!("Keystore file '{}' does not exist", keystore_name);
		error!("{}", err_msg);
		return Err(err_msg);
	}

	fs::remove_file(&full_path)
		.map_err(|e| {
			let err_msg = format!("Failed to remove keystore file: {}", e);
			error!("{}", err_msg);
			err_msg
		})?;

	Ok(())
}