use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    Emitter, Manager,
};
use tauri_plugin_global_shortcut::GlobalShortcutExt;

#[tauri::command]
fn get_system_idle_time() -> u64 {
    match user_idle::UserIdle::get_time() {
        Ok(time) => time.as_milliseconds() as u64,
        Err(_) => 0,
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_notification::init())
        .invoke_handler(tauri::generate_handler![get_system_idle_time])
        .plugin(tauri_plugin_global_shortcut::Builder::new()
            .with_handler(|app, shortcut, event| {
                if shortcut.to_string().to_lowercase() == "alt+shift+s" && event.state() == tauri_plugin_global_shortcut::ShortcutState::Pressed {
                    let _ = app.emit("shortcut-event", "toggle-timer");
                }
            })
            .build()
        )
        .setup(|app| {
            app.global_shortcut().register("Alt+Shift+S").unwrap();

            let quit_i = MenuItem::with_id(app, "quit", "Quit Chronify", true, None::<&str>)?;
            let show_i = MenuItem::with_id(app, "show", "Show Window", true, None::<&str>)?;
            let hide_i = MenuItem::with_id(app, "hide", "Hide Window", true, None::<&str>)?;
            
            let menu = Menu::with_items(app, &[&show_i, &hide_i, &quit_i])?;

            let icon_bytes = include_bytes!("../icons/128x128.png");
            let icon_img = image::load_from_memory(icon_bytes).unwrap().into_rgba8();
            let (width, height) = icon_img.dimensions();
            let icon = tauri::image::Image::new_owned(icon_img.into_raw(), width, height);

            let _tray = TrayIconBuilder::new()
                .icon(icon)
                .icon_as_template(false)
                .menu(&menu)
                .on_menu_event(|app: &tauri::AppHandle, event| match event.id.as_ref() {
                    "quit" => {
                        app.exit(0);
                    }
                    "show" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    "hide" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.hide();
                        }
                    }
                    _ => {}
                })
                .build(app)?;

            Ok(())
        })
        .on_window_event(|window, event| match event {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                window.hide().unwrap();
                api.prevent_close();
            }
            _ => {}
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    app.run(|_app_handle, _event| {
        #[cfg(target_os = "macos")]
        match _event {
            tauri::RunEvent::Reopen { .. } => {
                if let Some(window) = _app_handle.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
            _ => {}
        }
    });
}
