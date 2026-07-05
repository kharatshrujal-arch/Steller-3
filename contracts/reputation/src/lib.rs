#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env};

#[contracttype]
pub enum DataKey {
    Score(Address),
}

#[contract]
pub struct ReputationContract;

#[contractimpl]
impl ReputationContract {
    pub fn bump(env: Env, steward: Address, delta: i128) {
        let current = Self::score(env.clone(), steward.clone());
        env.storage().persistent().set(&DataKey::Score(steward), &(current + delta));
    }

    pub fn score(env: Env, steward: Address) -> i128 {
        env.storage().persistent().get(&DataKey::Score(steward)).unwrap_or(0)
    }
}

#[cfg(test)]
mod test {
    extern crate std;

    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn bump_increases_score() {
        let env = Env::default();
        let contract_id = env.register_contract(None, ReputationContract);
        let client = ReputationContractClient::new(&env, &contract_id);
        let steward = Address::generate(&env);

        client.bump(&steward, &2);
        assert_eq!(client.score(&steward), 2);
    }
}
