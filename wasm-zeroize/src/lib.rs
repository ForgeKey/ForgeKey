use wasm_bindgen::prelude::*;
use zeroize::Zeroize;
use std::cell::RefCell;

// Initialize panic hook for better error messages
#[wasm_bindgen(start)]
pub fn start() {
    console_error_panic_hook::set_once();
}

/// A secure string container that automatically zeroizes memory when dropped
#[wasm_bindgen]
pub struct ZeroizedString {
    inner: RefCell<String>,
}

#[wasm_bindgen]
impl ZeroizedString {
    /// Create a new secure string container
    #[wasm_bindgen(constructor)]
    pub fn new(data: &str) -> ZeroizedString {
        ZeroizedString {
            inner: RefCell::new(data.to_string()),
        }
    }

    /// Get the string value (use with caution)
    pub fn get_value(&self) -> String {
        self.inner.borrow().clone()
    }

    /// Explicitly zeroize the string
    pub fn zeroize(&self) {
        let mut data = self.inner.borrow_mut();
        data.zeroize();
    }
}

impl Drop for ZeroizedString {
    fn drop(&mut self) {
        let mut data = self.inner.borrow_mut();
        data.zeroize();
    }
}