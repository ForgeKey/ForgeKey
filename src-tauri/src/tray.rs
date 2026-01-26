use log::{debug, error};
use tauri::{
  image::Image,
  menu::{Menu, MenuItem},
  tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
  AppHandle, Manager, Wry,
};
use tauri_nspanel::{
  tauri_panel, CollectionBehavior, PanelLevel, StyleMask, WebviewWindowExt,
};
use tauri_plugin_positioner::WindowExt;

// Panel type for fullscreen support
// Note: panel_event! is required even if callbacks are empty
tauri_panel! {
  panel!(MenuBarPanel {
    config: {
      can_become_key_window: true,
      can_become_main_window: false,
      is_floating_panel: true
    }
  })

  panel_event!(MenuBarPanelEventHandler {
    window_did_become_key(notification: &NSNotification) -> (),
    window_did_resign_key(notification: &NSNotification) -> ()
  })
}

/// Initialize the panel for fullscreen support.
/// Must be called after plugin initialization.
pub fn init_panel(app_handle: &AppHandle<Wry>) {
  let Some(window) = app_handle.get_webview_window("main") else {
    return;
  };

  let panel = match window.to_panel::<MenuBarPanel>() {
    Ok(p) => p,
    Err(e) => {
      error!("Failed to convert window to panel: {:?}", e);
      return;
    }
  };

  // Required: Set panel level, style mask, and collection behavior
  panel.set_level(PanelLevel::Floating.value());
  panel.set_style_mask(StyleMask::empty().nonactivating_panel().into());
  panel.set_collection_behavior(
    CollectionBehavior::new()
      .can_join_all_spaces()
      .full_screen_auxiliary()
      .into(),
  );

  // Required: Attach event handler for proper panel behavior
  let handler = MenuBarPanelEventHandler::new();
  handler.window_did_become_key(|_| {});
  handler.window_did_resign_key(|_| {});
  panel.set_event_handler(Some(handler.as_ref()));

  debug!("Converted window to panel for fullscreen support");
}

pub fn init_macos_menu_extra(app: &AppHandle<Wry>) -> tauri::Result<()> {
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

  let _ = TrayIconBuilder::with_id("menu_extra")
    .icon(Image::from_bytes(include_bytes!("../icons/tray-icon.png")).unwrap())
    .icon_as_template(true)
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

      if window.is_visible().unwrap_or(false) {
        let _ = window.hide();
      } else {
        let _ = window.move_window(tauri_plugin_positioner::Position::TrayBottomCenter);
        let _ = window.show();
        let _ = window.set_focus();
      }
    })
    .build(app);

  Ok(())
}
