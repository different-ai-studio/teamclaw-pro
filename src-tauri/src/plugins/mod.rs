/// Register all optional plugins.
/// Open-source version: no plugins.
/// Pro version overrides this file to register team plugin.
pub fn register_all<R: tauri::Runtime>(
    builder: tauri::Builder<R>,
) -> tauri::Builder<R> {
    builder
}
