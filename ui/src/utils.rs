#[macro_export]
macro_rules! console_log {
    ($($t:tt)*) => {
        web_sys::console::log_1(&format!($($t)*).into())
    }
}

#[macro_export]
macro_rules! console_error {
    ($($t:tt)*) => {
        web_sys::console::error_1(&format!($($t)*).into())
    }
}

#[macro_export]
macro_rules! log {
    ($($t:tt)*) => {
        $crate::console_log!("[{}] {}", module_path!(), format_args!($($t)*))
    }
}

#[macro_export]
macro_rules! error {
    ($($t:tt)*) => {
        $crate::console_error!("[{}] {}", module_path!(), format_args!($($t)*))
    }
}
