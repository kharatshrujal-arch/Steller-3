# Architecture

AidPulse is split into four layers.

## Frontend

`src/App.tsx` owns the user workflow: connect wallet, disconnect wallet, refresh balance, send XLM, call the contract, and render contract events.

`src/lib/wallet.ts` keeps wallet providers separate from UI logic. Freighter is the primary wallet and Albedo is the second wallet provider.

`src/lib/stellar.ts` keeps Horizon and Soroban RPC logic in one place.

## Contracts

`contracts/aid_pulse` stores aid cases and manages funding/release events. It requires authorization for admin case creation, donor funding, and steward release.

`contracts/reputation` stores a score for stewards. AidPulse calls this contract after a successful release, showing inter-contract communication.

## Rust WASM utilities

`wasm_utils` contains amount conversion helpers that can be compiled to WASM when the frontend needs Rust-side validation helpers.

## CI/CD

`.github/workflows/ci.yml` runs frontend tests, frontend build, contract tests, and contract WASM build.

`.github/workflows/deploy-testnet.yml` can deploy manually to Stellar Testnet using the `STELLAR_SOURCE_ACCOUNT` secret.
