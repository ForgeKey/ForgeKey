use serde::Serialize;
use zeroize::Zeroize;
use std::ops::Deref;
use std::collections::HashMap;

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
    
    /// Take ownership of the password, consuming self
    /// WARNING: This method should be used with caution as it transfers responsibility
    /// for zeroizing the password to the caller
    pub fn into_string(mut self) -> String {
        // Take ownership of the inner string to prevent it from being zeroized
        let result = std::mem::take(&mut self.inner);
        // Now self.inner is empty, so when it's zeroized on drop, nothing happens to our returned string
        result
    }
    
    /// Execute a function with this password as an environment variable
    /// This ensures the password remains valid during command execution and is properly zeroized after
    pub fn with_env<F, T>(&self, env_key: &str, f: F) -> T
    where
        F: FnOnce(&HashMap<&str, &str>) -> T,
    {
        let mut env_vars = HashMap::new();
        env_vars.insert(env_key, self.as_str());
        f(&env_vars)
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
