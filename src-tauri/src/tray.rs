use log::{debug, error};
use tauri::{
  image::Image,
  menu::{Menu, MenuItem},
  tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
  AppHandle, Manager, Wry,
};
use tauri_nspanel::{
  tauri_panel, CollectionBehavior, ManagerExt, PanelLevel, StyleMask, WebviewWindowExt,
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

  // Attach event handler for proper panel behavior
  let handler = MenuBarPanelEventHandler::new();
  handler.window_did_become_key(|_| {});

  // Hide panel when it loses key window status (user clicked outside)
  let handle = app_handle.clone();
  handler.window_did_resign_key(move |_| {
    if let Ok(panel) = handle.get_webview_panel("main") {
      panel.hide();
    }
  });
  panel.set_event_handler(Some(handler.as_ref()));

  debug!("Converted window to panel for fullscreen support");
}

fn show_about_panel() {
  use objc2::runtime::AnyObject;
  use objc2::{AnyThread, MainThreadMarker};
  use objc2_app_kit::{NSApplication, NSImage};
  use objc2_foundation::{
    NSDictionary, NSData, NSMutableAttributedString, NSRange, NSString, NSURL,
  };

  let mtm = unsafe { MainThreadMarker::new_unchecked() };
  let version = env!("CARGO_PKG_VERSION");

  let icon_bytes = include_bytes!("../icons/128x128@2x.png");
  let icon_data = NSData::with_bytes(icon_bytes);
  let icon = NSImage::initWithData(NSImage::alloc(), &icon_data);

  // Build a clickable link for the Credits field
  let repo_url_str = "https://github.com/ForgeKey/ForgeKey";
  let link_text = NSString::from_str(repo_url_str);
  let credits = NSMutableAttributedString::from_nsstring(&link_text);
  let url = NSURL::URLWithString(&NSString::from_str(repo_url_str));
  if let Some(url) = url {
    let link_attr_key = NSString::from_str("NSLink");
    let range = NSRange::new(0, credits.length());
    unsafe {
      credits.addAttribute_value_range(
        &link_attr_key,
        &url,
        range,
      );
    }
  }

  let key_version = NSString::from_str("ApplicationVersion");
  let key_credits = NSString::from_str("Credits");
  let key_icon = NSString::from_str("ApplicationIcon");
  let val_version = NSString::from_str(version);

  let mut keys: Vec<&NSString> = vec![&key_version, &key_credits];
  let mut values: Vec<&AnyObject> = vec![
    val_version.as_ref(),
    credits.as_ref(),
  ];

  if let Some(ref img) = icon {
    keys.push(&key_icon);
    values.push(img.as_ref());
  }

  let options: objc2::rc::Retained<NSDictionary<NSString, AnyObject>> =
    NSDictionary::from_slices(&keys, &values);
  let app = NSApplication::sharedApplication(mtm);
  unsafe {
    app.orderFrontStandardAboutPanelWithOptions(&options);
    app.activate();
  }
}

pub fn init_macos_menu_extra(app: &AppHandle<Wry>) -> tauri::Result<()> {
  let about_i = MenuItem::with_id(app, "about", "About", true, None::<&str>)?;
  let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
  let menu = Menu::with_items(app, &[&about_i, &quit_i])?;

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
    .on_menu_event(|app, event| match event.id.as_ref() {
      "about" => show_about_panel(),
      "quit" => app.exit(0),
      _ => {}
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

      // Try to get panel, fall back to window methods if panel not available
      if let Ok(panel) = app.get_webview_panel("main") {
        if panel.is_visible() {
          panel.hide();
        } else {
          let _ = window.move_window(tauri_plugin_positioner::Position::TrayBottomCenter);
          panel.show_and_make_key();
        }
      } else {
        // Fallback to window methods
        if window.is_visible().unwrap_or(false) {
          let _ = window.hide();
        } else {
          let _ = window.move_window(tauri_plugin_positioner::Position::TrayBottomCenter);
          let _ = window.show();
          let _ = window.set_focus();
        }
      }
    })
    .build(app);

  Ok(())
}
