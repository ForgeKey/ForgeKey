mod commands;
mod models;

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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![create_new_wallet, import_private_key, create_vanity_wallet, list_wallets])
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

