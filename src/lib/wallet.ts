import {
  isConnected,
  isAllowed,
  requestAccess,
  getAddress,
  signTransaction
} from "@stellar/freighter-api";
import albedo from "@albedo-link/intent";
import { AppError } from "./errors";
import { config } from "../config";

export type WalletProvider = "freighter" | "albedo";

export type ConnectedWallet = {
  provider: WalletProvider;
  publicKey: string;
};

type FreighterError = string | { message?: string };
type FreighterAddressResponse = string | { address?: string; publicKey?: string; error?: FreighterError };
type FreighterBooleanResponse = boolean | { isConnected?: boolean; isAllowed?: boolean; error?: FreighterError };
type FreighterSignResponse = string | { signedTxXdr?: string; error?: FreighterError };

function freighterErrorMessage(error: FreighterError): string {
  return typeof error === "string" ? error : error.message ?? "Freighter returned an unknown error.";
}

function readFreighterFlag(response: FreighterBooleanResponse, key: "isConnected" | "isAllowed"): boolean {
  if (typeof response === "boolean") return response;
  if (response.error) throw new AppError("wallet", freighterErrorMessage(response.error));
  return Boolean(response[key]);
}

function readFreighterAddress(response: FreighterAddressResponse): string {
  if (typeof response === "string") return response;
  if (response.error) throw new AppError("wallet", freighterErrorMessage(response.error));
  const publicKey = response.address ?? response.publicKey;
  if (!publicKey) throw new AppError("wallet", "Freighter did not return a public key. Unlock Freighter and approve access.");
  return publicKey;
}

function readSignedXdr(response: FreighterSignResponse): string {
  if (typeof response === "string") return response;
  if (response.error) throw new AppError("wallet", freighterErrorMessage(response.error));
  if (!response.signedTxXdr) throw new AppError("wallet", "Freighter did not return a signed transaction.");
  return response.signedTxXdr;
}

export async function connectWallet(provider: WalletProvider): Promise<ConnectedWallet> {
  if (provider === "freighter") {
    const installed = readFreighterFlag(await isConnected(), "isConnected");
    if (!installed) {
      throw new AppError(
        "wallet",
        "Freighter is not available in this browser. Open the app in Chrome or Brave with the Freighter extension installed and unlocked."
      );
    }

    const allowed = readFreighterFlag(await isAllowed(), "isAllowed");
    const publicKey = allowed ? readFreighterAddress(await getAddress()) : readFreighterAddress(await requestAccess());
    return { provider, publicKey };
  }

  try {
    const result = await albedo.publicKey({ require_existing: true });
    return { provider, publicKey: result.pubkey };
  } catch (error) {
    throw new AppError("wallet", "Albedo wallet connection was cancelled or unavailable.");
  }
}

export async function signWithWallet(provider: WalletProvider, xdr: string): Promise<string> {
  if (provider === "freighter") {
    return readSignedXdr(
      await signTransaction(xdr, {
        networkPassphrase: config.networkPassphrase,
        address: readFreighterAddress(await getAddress())
      })
    );
  }

  const signed = await albedo.tx({ xdr, network: "testnet" });
  return signed.signed_envelope_xdr;
}
