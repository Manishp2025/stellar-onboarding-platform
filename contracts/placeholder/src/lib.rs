#![no_std]
use soroban_sdk::{contract, contractimpl, Env};

#[contract]
pub struct PlaceholderContract;

#[contractimpl]
impl PlaceholderContract {
    pub fn hello(_env: Env) -> u32 {
        1
    }
}
