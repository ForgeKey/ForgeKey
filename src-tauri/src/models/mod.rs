use serde::Serialize;
use zeroize::Zeroize;
use std::ops::Deref;

#[derive(Serialize)]
pub struct WalletInfo {
  pub address: String,
  pub private_key: String,
}

impl Zeroize for WalletInfo {
  fn zeroize(&mut self) {
    self.private_key.zeroize();
    // We don't need to zeroize the address as it's public information
  }
}

impl Drop for WalletInfo {
  fn drop(&mut self) {
    self.zeroize();
  }
}

/// A secure password container that automatically zeroizes memory when dropped
/// and prevents accidental logging or display
pub struct Password {
  inner: String,
}

impl Password {
  /// Create a new password from a string
  /// The input string will be cloned, so the caller should zeroize their copy
  pub fn new(password: &str) -> Self {
    Self {
        inner: password.to_string(),
    }
  }
    
  /// Take ownership of an existing String as a password
  pub fn from_string(password: String) -> Self {
    Self {
      inner: password,
    }
  }
    
  /// Get a reference to the underlying string
  pub fn as_str(&self) -> &str {
    &self.inner
  }
}

impl Deref for Password {
  type Target = str;
  
  fn deref(&self) -> &Self::Target {
    &self.inner
  }
}

impl Zeroize for Password {
  fn zeroize(&mut self) {
    self.inner.zeroize();
  }
}

impl Drop for Password {
  fn drop(&mut self) {
    self.zeroize();
  }
}

// Prevent passwords from being accidentally displayed or logged
impl std::fmt::Debug for Password {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    f.write_str("[REDACTED]")
  }
}

impl std::fmt::Display for Password {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    f.write_str("[REDACTED]")
  }
} 
