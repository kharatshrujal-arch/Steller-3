#![no_std]

use soroban_sdk::{contract, contracterror, contractimpl, contracttype, symbol_short, token, vec, Address, Env, IntoVal, Symbol, Val, Vec};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct AidCase {
    pub beneficiary: Address,
    pub steward: Address,
    pub target: i128,
    pub funded: i128,
    pub released: bool,
}

#[contracttype]
pub enum DataKey {
    Admin,
    ReputationContract,
    NextCaseId,
    Case(u32),
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum AidError {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    CaseNotFound = 3,
    Unauthorized = 4,
    InvalidAmount = 5,
    AlreadyReleased = 6,
}

#[contract]
pub struct AidPulseContract;

#[contractimpl]
impl AidPulseContract {
    pub fn init(env: Env, admin: Address, reputation_contract: Address) -> Result<(), AidError> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(AidError::AlreadyInitialized);
        }

        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::ReputationContract, &reputation_contract);
        env.storage().instance().set(&DataKey::NextCaseId, &0u32);
        Ok(())
    }

    pub fn create_case(env: Env, beneficiary: Address, steward: Address, target: i128) -> Result<u32, AidError> {
        if target <= 0 {
            return Err(AidError::InvalidAmount);
        }

        let admin: Address = env.storage().instance().get(&DataKey::Admin).ok_or(AidError::NotInitialized)?;
        admin.require_auth();

        let id: u32 = env.storage().instance().get(&DataKey::NextCaseId).unwrap_or(0);
        let aid_case = AidCase {
            beneficiary,
            steward,
            target,
            funded: 0,
            released: false,
        };

        env.storage().persistent().set(&DataKey::Case(id), &aid_case);
        env.storage().instance().set(&DataKey::NextCaseId, &(id + 1));
        env.events().publish((symbol_short!(case), symbol_short!(created)), id);
        Ok(id)
    }

    pub fn get_case(env: Env, id: u32) -> Result<AidCase, AidError> {
        env.storage().persistent().get(&DataKey::Case(id)).ok_or(AidError::CaseNotFound)
    }

    pub fn fund_case(env: Env, token_id: Address, donor: Address, id: u32, amount: i128) -> Result<(), AidError> {
        if amount <= 0 {
            return Err(AidError::InvalidAmount);
        }

        donor.require_auth();
        let mut aid_case = Self::get_case(env.clone(), id)?;
        if aid_case.released {
            return Err(AidError::AlreadyReleased);
        }

        let token_client = token::Client::new(&env, &token_id);
        token_client.transfer(&donor, &env.current_contract_address(), &amount);
        aid_case.funded += amount;
        env.storage().persistent().set(&DataKey::Case(id), &aid_case);
        env.events().publish((symbol_short!(case), symbol_short!(funded)), (id, donor, amount));
        Ok(())
    }

    pub fn release_case(env: Env, token_id: Address, id: u32) -> Result<(), AidError> {
        let mut aid_case = Self::get_case(env.clone(), id)?;
        if aid_case.released {
            return Err(AidError::AlreadyReleased);
        }

        aid_case.steward.require_auth();
        if aid_case.funded <= 0 {
            return Err(AidError::InvalidAmount);
        }

        let token_client = token::Client::new(&env, &token_id);
        token_client.transfer(&env.current_contract_address(), &aid_case.beneficiary, &aid_case.funded);
        aid_case.released = true;
        env.storage().persistent().set(&DataKey::Case(id), &aid_case);

        if let Some(reputation_contract) = env.storage().instance().get::<DataKey, Address>(&DataKey::ReputationContract) {
            let fn_name = Symbol::new(&env, "bump");
            let args: Vec<Val> = vec![
                &env,
                aid_case.steward.clone().into_val(&env),
                1i128.into_val(&env)
            ];
            env.invoke_contract::<()>(&reputation_contract, &fn_name, args);
        }

        env.events().publish((symbol_short!(case), symbol_short!(released)), (id, aid_case.beneficiary, aid_case.funded));
        Ok(())
    }
}

#[cfg(test)]
mod test {
    extern crate std;

    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn create_case_rejects_zero_target() {
        let env = Env::default();
        let admin = Address::generate(&env);
        let reputation = Address::generate(&env);
        let contract_id = env.register_contract(None, AidPulseContract);
        let client = AidPulseContractClient::new(&env, &contract_id);

        env.mock_all_auths();
        client.init(&admin, &reputation);
        let beneficiary = Address::generate(&env);
        let steward = Address::generate(&env);
        let result = client.try_create_case(&beneficiary, &steward, &0);
        assert_eq!(result, Err(Ok(AidError::InvalidAmount)));
    }

    #[test]
    fn admin_can_create_case() {
        let env = Env::default();
        let admin = Address::generate(&env);
        let reputation = Address::generate(&env);
        let contract_id = env.register_contract(None, AidPulseContract);
        let client = AidPulseContractClient::new(&env, &contract_id);

        env.mock_all_auths();
        client.init(&admin, &reputation);
        let beneficiary = Address::generate(&env);
        let steward = Address::generate(&env);
        let id = client.create_case(&beneficiary, &steward, &50000000);
        let aid_case = client.get_case(&id);

        assert_eq!(id, 0);
        assert_eq!(aid_case.target, 50000000);
        assert!(!aid_case.released);
    }
}


