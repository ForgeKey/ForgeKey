use log::debug;
use tauri::{
    image::Image,
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    AppHandle, Manager, Wry,
};
use tauri_plugin_positioner::WindowExt;

/// Initialize the system tray for Linux.
/// Uses a simpler approach than macOS since NSPanel is not available.
pub fn init_system_tray(app: &AppHandle<Wry>) -> tauri::Result<()> {
    let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&quit_i])?;

    // Hide window when it loses focus
    if let Some(window) = app.get_webview_window("main") {
        let window_handle = window.clone();
        let _ = window.on_window_event(move |event| {
            if let tauri::WindowEvent::Focused(false) = event {
                let _ = window_handle.hide();
            }
        });
    }

    let _ = TrayIconBuilder::with_id("system_tray")
        .icon(Image::from_bytes(include_bytes!("../icons/tray-icon.png")).unwrap())
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| {
            if event.id.as_ref() == "quit" {
                app.exit(0);
            }
        })
        .on_tray_icon_event(|tray, event| {
            let app = tray.app_handle();
            tauri_plugin_positioner::on_tray_event(app, &event);

            let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            else {
                return;
            };

            let Some(window) = app.get_webview_window("main") else {
                return;
            };

            // Toggle window visibility on tray click
            if window.is_visible().unwrap_or(false) {
                let _ = window.hide();
            } else {
                // Position window near the tray icon
                let _ = window.move_window(tauri_plugin_positioner::Position::TrayBottomCenter);
                let _ = window.show();
                let _ = window.set_focus();
            }
        })
        .build(app);

    debug!("Linux system tray initialized");

    Ok(())
}
