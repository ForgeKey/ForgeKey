use std::process::Command;

pub fn check_and_install_foundry() -> Result<(), String> {
    // Check if cast is installed
    let cast_check = Command::new("cast")
        .arg("--version")
        .output();

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
    // On Unix systems (including macOS), foundryup should be in PATH after installation
    #[cfg(not(target_os = "windows"))]
    let mut foundryup_command = Command::new("foundryup");

    match foundryup_command.output() {
        Ok(output) => {
            if output.status.success() {
                println!("Foundry tools installed successfully");
                Ok(())
            } else {
                let error = String::from_utf8_lossy(&output.stderr);
                Err(format!("Failed to run foundryup: {}", error))
            }
        }
        Err(e) => Err(format!("Failed to execute foundryup: {}", e)),
    }
}
