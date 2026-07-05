export const config = {
  network: import.meta.env.VITE_STELLAR_NETWORK ?? "testnet",
  networkPassphrase: "Test SDF Network ; September 2015",
  horizonUrl: import.meta.env.VITE_HORIZON_URL ?? "https://horizon-testnet.stellar.org",
  rpcUrl: import.meta.env.VITE_RPC_URL ?? "https://soroban-testnet.stellar.org",
  aidPulseContractId: import.meta.env.VITE_AID_PULSE_CONTRACT_ID ?? "",
  reputationContractId: import.meta.env.VITE_REPUTATION_CONTRACT_ID ?? ""
};

export const isContractConfigured = config.aidPulseContractId.startsWith("C");
