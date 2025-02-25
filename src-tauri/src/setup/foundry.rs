use std::process::Command;
use dirs::home_dir;
use crate::utils::get_cast_binary;

pub fn check_and_install_foundry() -> Result<(), String> {
	// Check if cast is installed
	let cast_check = get_cast_binary()
		.and_then(|path| {
			Command::new(path)
				.arg("--version")
				.output()
				.map_err(|e| format!("Failed to execute cast: {}", e))
		});

    match cast_check {
			Ok(_) => {
				println!("Cast is already installed");
				Ok(())
			}
			Err(_) => {
				println!("Cast not found, installing...");
				install_foundry()?;
				// After installing foundryup, run it to install Foundry
				run_foundryup()
			}
    }
}

fn install_foundry() -> Result<(), String> {
	#[cfg(target_os = "macos")]
	let install_command = {
		Command::new("bash")
			.arg("-c")
			.arg("curl -L https://foundry.paradigm.xyz | bash")
			.output()
	};

	#[cfg(all(unix, not(target_os = "macos")))]
	let install_command = {
		Command::new("sh")
			.arg("-c")
			.arg("curl -L https://foundry.paradigm.xyz | bash")
			.output()
	};

	match install_command {
		Ok(output) => {
			if output.status.success() {
				println!("Foundryup installed successfully");
				Ok(())
			} else {
				let error = String::from_utf8_lossy(&output.stderr);
				Err(format!("Failed to install Foundryup: {}", error))
			}
		}
		Err(e) => Err(format!("Failed to execute install command: {}", e)),
	}
}

fn run_foundryup() -> Result<(), String> {
	let home = home_dir().ok_or_else(|| "Could not find home directory".to_string())?;
	let foundryup_path = home.join(".foundry").join("bin").join("foundryup");

	let output = Command::new(foundryup_path)
		.output()
		.map_err(|e| format!("Failed to execute foundryup: {}", e))?;

	if output.status.success() {
		println!("Foundry installed successfully");
		Ok(())
	} else {
		let error = String::from_utf8_lossy(&output.stderr);
		Err(format!("Failed to install Foundry: {}", error))
	}
}
