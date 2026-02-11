use log::{error, LevelFilter};
#[cfg(target_os = "macos")]
use tauri::ActivationPolicy;

use crate::models::Password;

mod commands;
mod models;
mod pty;
mod setup;
#[cfg(target_os = "macos")]
mod tray;
#[cfg(target_os = "linux")]
mod tray_linux;
mod utils;

#[tauri::command(rename_all = "snake_case")]
fn create_new_wallet(address_label: String, password: String) -> Result<String, String> {
  commands::create_new_wallet(address_label, password)
}

#[tauri::command(rename_all = "snake_case")]
fn import_private_key(private_key: String, address_label: String, password: String) -> Result<String, String> {
  let password = Password::from_string(password);
  commands::import_wallet(private_key, address_label, password)
}

#[tauri::command(rename_all = "snake_case")]
async fn create_vanity_wallet(starts_with: Option<String>, ends_with: Option<String>, address_label: String, password: String) -> Result<String, String> {
  commands::create_vanity_wallet(starts_with, ends_with, address_label, password).await
}

#[tauri::command(rename_all = "snake_case")]
fn cancel_vanity_wallet() -> Result<(), String> {
  commands::cancel_vanity_wallet()
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
      cancel_vanity_wallet,
      list_wallets,
      get_wallet_address,
      decrypt_keystore,
      remove_keystore
    ])
    .plugin(tauri_plugin_positioner::init())
    .plugin(tauri_plugin_updater::Builder::new().build())
    .plugin(tauri_plugin_process::init())
    .setup(|app| {
      // Initialize NSPanel plugin on macOS
      #[cfg(target_os = "macos")]
      app.handle().plugin(tauri_nspanel::init())?;

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

      if let Err(e) = setup::foundry::check_and_install_foundry() {
        error!("Failed to check/install Foundry: {}", e);
      }

      #[cfg(target_os = "macos")]
      {
        // Make the Dock icon invisible first
        app.set_activation_policy(ActivationPolicy::Accessory);
        // Initialize tray menu
        tray::init_macos_menu_extra(app.handle())?;
        // Initialize panel for fullscreen support (must be after plugin init)
        tray::init_panel(app.handle());
      }

      #[cfg(target_os = "linux")]
      {
        // Initialize system tray for Linux
        tray_linux::init_system_tray(app.handle())?;
      }

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

