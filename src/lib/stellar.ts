import {
  Asset,
  Contract,
  Horizon,
  Memo,
  Networks,
  Operation,
  rpc,
  TransactionBuilder,
  nativeToScVal
} from "@stellar/stellar-sdk";
import { config } from "../config";
import { AppError } from "./errors";
import { signWithWallet, WalletProvider } from "./wallet";

const horizon = new Horizon.Server(config.horizonUrl);
const rpcServer = new rpc.Server(config.rpcUrl, { allowHttp: config.rpcUrl.startsWith("http://") });

export type TxResult = {
  hash: string;
  status: "success" | "failed";
  message: string;
};

export type ContractEvent = {
  id: string;
  topic: string;
  ledger: number;
  value: string;
};

export async function fetchXlmBalance(publicKey: string): Promise<string> {
  try {
    const account = await horizon.loadAccount(publicKey);
    const native = account.balances.find((balance) => balance.asset_type === "native");
    return native?.balance ?? "0.0000000";
  } catch {
    throw new AppError("network", "Could not fetch the wallet balance from Stellar Testnet.");
  }
}

export async function sendXlmPayment(args: {
  from: string;
  to: string;
  amount: string;
  memo: string;
  provider: WalletProvider;
}): Promise<TxResult> {
  try {
    const account = await horizon.loadAccount(args.from);
    const transaction = new TransactionBuilder(account, {
      fee: "100",
      networkPassphrase: Networks.TESTNET
    })
      .addOperation(
        Operation.payment({
          destination: args.to,
          asset: Asset.native(),
          amount: args.amount
        })
      )
      .addMemo(Memo.text(args.memo))
      .setTimeout(60)
      .build();

    const signedXdr = await signWithWallet(args.provider, transaction.toXDR());
    const signed = TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET);
    const response = await horizon.submitTransaction(signed);
    return { hash: response.hash, status: "success", message: "XLM payment sent on Stellar Testnet." };
  } catch {
    throw new AppError("transaction", "Payment failed. Check the destination address, amount, and wallet approval.");
  }
}

export async function callAidCase(args: {
  publicKey: string;
  provider: WalletProvider;
  caseId: number;
}): Promise<TxResult> {
  if (!config.aidPulseContractId) {
    throw new AppError("contract", "Add VITE_AID_PULSE_CONTRACT_ID after deploying the contract.");
  }

  try {
    const source = await rpcServer.getAccount(args.publicKey);
    const contract = new Contract(config.aidPulseContractId);
    const transaction = new TransactionBuilder(source, {
      fee: "1000000",
      networkPassphrase: config.networkPassphrase
    })
      .addOperation(contract.call("get_case", nativeToScVal(args.caseId, { type: "u32" })))
      .setTimeout(60)
      .build();

    const prepared = await rpcServer.prepareTransaction(transaction);
    const signedXdr = await signWithWallet(args.provider, prepared.toXDR());
    const sent = await rpcServer.sendTransaction(TransactionBuilder.fromXDR(signedXdr, config.networkPassphrase));
    return { hash: sent.hash, status: "success", message: "Contract call submitted to Soroban RPC." };
  } catch {
    throw new AppError("contract", "Contract call failed. Confirm the contract ID and wallet network.");
  }
}

export async function fetchContractEvents(cursor?: string): Promise<{ cursor?: string; events: ContractEvent[] }> {
  if (!config.aidPulseContractId) {
    return { cursor, events: [] };
  }

  const latest = await rpcServer.getLatestLedger();
  const response = await rpcServer.getEvents({
    startLedger: cursor ? undefined : Math.max(1, latest.sequence - 200),
    cursor,
    filters: [
      {
        type: "contract",
        contractIds: [config.aidPulseContractId]
      }
    ],
    limit: 10
  });

  return {
    cursor: response.cursor ?? cursor,
    events: response.events.map((event, index) => ({
      id: `${event.ledger}-${index}`,
      ledger: Number(event.ledger),
      topic: event.topic.map((item) => item.toString()).join(" / "),
      value: event.value.toString()
    }))
  };
}
