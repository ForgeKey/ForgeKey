use tauri::ActivationPolicy;
use log::LevelFilter;

mod commands;
mod models;
mod setup;
mod tray;
mod utils;

// Note: All password handling is done securely in the command implementations.
// Passwords are automatically zeroized when no longer needed.

#[tauri::command(rename_all = "snake_case")]
fn create_new_wallet(address_label: String, password: String) -> Result<String, String> {
  commands::create_new_wallet(address_label, password)
}

#[tauri::command(rename_all = "snake_case")]
fn import_private_key(private_key: String, address_label: String, password: String) -> Result<String, String> {
  commands::import_wallet(private_key, address_label, password)
}

#[tauri::command(rename_all = "snake_case")]
fn create_vanity_wallet(starts_with: Option<String>, ends_with: Option<String>, address_label: String, password: String) -> Result<String, String> {
  commands::create_vanity_wallet(starts_with, ends_with, address_label, password)
}

#[tauri::command(rename_all = "snake_case")]
fn list_wallets() -> Result<Vec<String>, String> {
  commands::list_wallets()
}

#[tauri::command(rename_all = "snake_case")]
fn get_wallet_address(keystore_name: String, password: String) -> Result<String, String> {
  commands::get_wallet_address(&keystore_name, &password)
}

#[tauri::command(rename_all = "snake_case")]
fn decrypt_keystore(keystore_name: String, password: String) -> Result<String, String> {
  // SECURITY: The returned private key should be zeroized by the frontend when no longer needed
  commands::decrypt_keystore(keystore_name, password)
}

#[tauri::command(rename_all = "snake_case")]
fn remove_keystore(keystore_name: String) -> Result<(), String> {
  commands::remove_keystore(keystore_name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      create_new_wallet,
      import_private_key,
      create_vanity_wallet,
      list_wallets,
      get_wallet_address,
      decrypt_keystore,
      remove_keystore
    ])
    .plugin(tauri_plugin_positioner::init())
    .setup(|app| {
      // Configure logging based on build profile
      let log_level = if cfg!(debug_assertions) {
        LevelFilter::Debug  // More verbose in debug builds
      } else {
        LevelFilter::Info   // Less verbose in release builds
      };

      // Enable logging with level filter
      app.handle().plugin(
        tauri_plugin_log::Builder::default()
          .level(log_level)
          .build(),
      )?;

      // Check and install Foundry during setup
      if let Err(e) = setup::foundry::check_and_install_foundry() {
        eprintln!("Failed to check/install Foundry: {}", e);
      }
      
      #[cfg(target_os = "macos")]
      {
        tray::init_macos_menu_extra(app.handle())?;
        // Make the Dock icon invisible
        app.set_activation_policy(ActivationPolicy::Accessory);
      }
    
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

