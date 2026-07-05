import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock3,
  Link2Off,
  RefreshCw,
  Send,
  ShieldCheck,
  Wallet,
  Zap
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { config, isContractConfigured } from "./config";
import { errorMessage } from "./lib/errors";
import { callAidCase, ContractEvent, fetchContractEvents, fetchXlmBalance, sendXlmPayment, TxResult } from "./lib/stellar";
import { connectWallet, ConnectedWallet, WalletProvider } from "./lib/wallet";

type LoadingKey = "wallet" | "balance" | "payment" | "contract";

type NoticeTone = "pending" | "success" | "error";

const sampleEvents: ContractEvent[] = [
  { id: "sample-1", topic: "wallet / waiting", ledger: 0, value: "Connect Freighter or Albedo to begin" },
  { id: "sample-2", topic: "rpc / ready", ledger: 0, value: "Soroban event stream appears after contract deployment" }
];

export function App() {
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null);
  const [balance, setBalance] = useState("0.0000000");
  const [loading, setLoading] = useState<LoadingKey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tx, setTx] = useState<TxResult | null>(null);
  const [events, setEvents] = useState<ContractEvent[]>([]);
  const [eventCursor, setEventCursor] = useState<string | undefined>();
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("1");

  const shortened = useMemo(() => {
    if (!wallet?.publicKey) return "No wallet connected";
    return `${wallet.publicKey.slice(0, 8)}...${wallet.publicKey.slice(-8)}`;
  }, [wallet]);

  const noticeTone: NoticeTone = error ? "error" : tx || wallet ? "success" : "pending";
  const eventFeed = events.length > 0 ? events : sampleEvents;

  async function connect(provider: WalletProvider) {
    setLoading("wallet");
    setError(null);
    setTx(null);
    try {
      const connected = await connectWallet(provider);
      setWallet(connected);
      setBalance(await fetchXlmBalance(connected.publicKey));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(null);
    }
  }

  function disconnect() {
    setWallet(null);
    setBalance("0.0000000");
    setTx(null);
    setError(null);
  }

  async function refreshBalance() {
    if (!wallet) return;
    setLoading("balance");
    setError(null);
    try {
      setBalance(await fetchXlmBalance(wallet.publicKey));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(null);
    }
  }

  async function submitPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!wallet) return;
    setLoading("payment");
    setError(null);
    setTx(null);
    try {
      const result = await sendXlmPayment({
        from: wallet.publicKey,
        to: destination,
        amount,
        memo: "AidPulse testnet aid",
        provider: wallet.provider
      });
      setTx(result);
      await refreshBalance();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(null);
    }
  }

  async function submitContractCall() {
    if (!wallet) return;
    setLoading("contract");
    setError(null);
    setTx(null);
    try {
      setTx(await callAidCase({ publicKey: wallet.publicKey, provider: wallet.provider, caseId: 0 }));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(null);
    }
  }

  useEffect(() => {
    const timer = window.setInterval(async () => {
      try {
        const next = await fetchContractEvents(eventCursor);
        setEventCursor(next.cursor);
        if (next.events.length > 0) {
          setEvents((current) => [...next.events, ...current].slice(0, 8));
        }
      } catch {
        // Event polling should stay quiet if the contract is not deployed yet.
      }
    }, 7000);

    return () => window.clearInterval(timer);
  }, [eventCursor]);

  return (
    <main className="app-shell">
      <aside className="side-nav">
        <div className="brand-mark">AP</div>
        <div>
          <h1>AidPulse</h1>
          <p>Community aid escrow</p>
        </div>
      </aside>

      <section className="main-board">
        <header className="topbar">
          <div>
            <p className="eyebrow">Stellar Testnet</p>
            <h2>Transparent aid operations</h2>
          </div>
          <div className={`status-pill ${noticeTone}`}>
            {noticeTone === "pending" && <Clock3 aria-hidden="true" />}
            {noticeTone === "success" && <CheckCircle2 aria-hidden="true" />}
            {noticeTone === "error" && <AlertCircle aria-hidden="true" />}
            <span>{wallet ? `${wallet.provider} connected` : "Connect wallet"}</span>
          </div>
        </header>

        <section className="summary-grid">
          <article className="panel wallet-card">
            <div className="panel-title"><Wallet aria-hidden="true" /><h3>Wallet</h3></div>
            <strong className="public-key">{shortened}</strong>
            <p className="muted">Connect your own wallet. Freighter signs through the browser extension; Albedo opens its hosted wallet flow.</p>
            <div className="actions-row">
              <button onClick={() => connect("freighter")} disabled={loading === "wallet"}>
                <Wallet aria-hidden="true" /> Freighter
              </button>
              <button className="secondary-button" onClick={() => connect("albedo")} disabled={loading === "wallet"}>
                <ShieldCheck aria-hidden="true" /> Albedo
              </button>
              <button className="icon-button" onClick={disconnect} disabled={!wallet} aria-label="Disconnect wallet">
                <Link2Off aria-hidden="true" />
              </button>
            </div>
          </article>

          <article className="panel stat-card">
            <div className="panel-title"><Activity aria-hidden="true" /><h3>XLM Balance</h3></div>
            <div className="balance-value">{balance}</div>
            <button className="secondary-button" onClick={refreshBalance} disabled={!wallet || loading === "balance"}>
              <RefreshCw aria-hidden="true" /> Refresh
            </button>
          </article>
        </section>

        <section className="work-grid">
          <form className="panel flow-card" onSubmit={submitPayment}>
            <div className="panel-title"><Send aria-hidden="true" /><h3>Send testnet XLM</h3></div>
            <label>Destination address<input value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="G..." required /></label>
            <label>Amount<input value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" required /></label>
            <button type="submit" disabled={!wallet || loading === "payment"}><Send aria-hidden="true" /> Send payment</button>
          </form>

          <article className="panel flow-card case-card">
            <div className="panel-title"><Zap aria-hidden="true" /><h3>Create / Call Aid Case</h3></div>
            <div className="case-box">
              <span>Case #0</span>
              <strong>Emergency clinic transport</strong>
              <small>Pune community health desk - verified steward - target 35 XLM</small>
            </div>
            <p className="muted">{isContractConfigured ? "Contract ID loaded." : "Deploy the Soroban contract and add its ID to .env.local."}</p>
            <button onClick={submitContractCall} disabled={!wallet || loading === "contract" || !isContractConfigured}><Zap aria-hidden="true" /> Call contract</button>
          </article>
        </section>

        <section className={`notice-bar ${noticeTone}`}>
          <strong>{error ? error : tx ? tx.message : "Ready for wallet connection and Stellar Testnet activity."}</strong>
          {tx?.hash && <span>Transaction hash: {tx.hash}</span>}
        </section>
      </section>

      <aside className="event-ledger">
        <div className="panel-title ledger-title"><Activity aria-hidden="true" /><div><h3>Event Stream Ledger</h3><p className="muted">Soroban RPC event polling</p></div></div>
        <div className="ledger-list">
          {eventFeed.map((event) => (
            <article className="event-item" key={event.id}>
              <strong>{event.topic}</strong>
              <span>Ledger {event.ledger}</span>
              <small>{event.value}</small>
            </article>
          ))}
        </div>
      </aside>
    </main>
  );
}

