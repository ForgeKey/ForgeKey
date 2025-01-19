mod commands;
mod models;

use commands::create_new_wallet;
use commands::import_wallet;

#[tauri::command(rename_all = "snake_case")]
fn create_new_address() -> Result<models::WalletInfo, String> {
    create_new_wallet()
}

#[tauri::command(rename_all = "snake_case")]
fn import_private_key(private_key: String, address_label: String, password: String) -> Result<String, String> {
  import_wallet(private_key, address_label, password)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![create_new_address, import_private_key])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

