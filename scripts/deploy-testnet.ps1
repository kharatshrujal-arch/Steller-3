param(
  [Parameter(Mandatory = $false)]
  [string]$SourceAccount = $env:STELLAR_SOURCE_ACCOUNT
)

$ErrorActionPreference = "Stop"

if (-not $SourceAccount) {
  throw "Set STELLAR_SOURCE_ACCOUNT to the funded Stellar testnet secret key before deploying."
}

stellar network add testnet `
  --rpc-url https://soroban-testnet.stellar.org `
  --network-passphrase "Test SDF Network ; September 2015" `
  2>$null

stellar keys add deployer --secret-key $SourceAccount 2>$null

stellar contract build --package reputation_contract
stellar contract build --package aid_pulse_contract

$reputationWasm = "target/wasm32-unknown-unknown/release/reputation_contract.wasm"
$aidPulseWasm = "target/wasm32-unknown-unknown/release/aid_pulse_contract.wasm"

$reputationId = stellar contract deploy --wasm $reputationWasm --source deployer --network testnet
$aidPulseId = stellar contract deploy --wasm $aidPulseWasm --source deployer --network testnet
$adminAddress = stellar keys address deployer

stellar contract invoke `
  --id $aidPulseId `
  --source deployer `
  --network testnet `
  -- init `
  --admin $adminAddress `
  --reputation_contract $reputationId

"VITE_AID_PULSE_CONTRACT_ID=$aidPulseId" | Set-Content -Encoding UTF8 .env.local
"VITE_REPUTATION_CONTRACT_ID=$reputationId" | Add-Content -Encoding UTF8 .env.local
"VITE_STELLAR_NETWORK=testnet" | Add-Content -Encoding UTF8 .env.local
"VITE_HORIZON_URL=https://horizon-testnet.stellar.org" | Add-Content -Encoding UTF8 .env.local
"VITE_RPC_URL=https://soroban-testnet.stellar.org" | Add-Content -Encoding UTF8 .env.local

Write-Host "AidPulse contract: $aidPulseId"
Write-Host "Reputation contract: $reputationId"
Write-Host "Initialized AidPulse with admin: $adminAddress"
Write-Host "Saved contract IDs to .env.local"
