#![no_std]
use soroban_sdk::{contract, contractimpl, Env, Symbol, String};

#[contract]
pub struct CrowdfundContract;

#[contractimpl]
impl CrowdfundContract {
    /// Initialize the crowdfunding campaign
    pub fn init(env: Env, target: i128) -> String {
        let key = Symbol::new(&env, "target");
        env.storage().instance().set(&key, &target);
        String::from_str(&env, "Campaign Initialized")
    }

    /// View the funding target
    pub fn get_target(env: Env) -> i128 {
        let key = Symbol::new(&env, "target");
        env.storage().instance().get(&key).unwrap_or(0)
    }
}
