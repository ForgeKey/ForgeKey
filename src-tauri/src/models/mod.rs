use serde::Serialize;
use zeroize::Zeroize;

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
