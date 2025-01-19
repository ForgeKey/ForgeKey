use serde::Serialize;

#[derive(Serialize)]
pub struct WalletInfo {
    pub address: String,
    pub private_key: String,
} 