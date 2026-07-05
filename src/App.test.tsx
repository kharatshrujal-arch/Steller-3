import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { App } from "./App";

vi.mock("./lib/stellar", () => ({
  callAidCase: vi.fn(),
  fetchContractEvents: vi.fn().mockResolvedValue({ cursor: undefined, events: [] }),
  fetchXlmBalance: vi.fn().mockResolvedValue("100.0000000"),
  sendXlmPayment: vi.fn()
}));

vi.mock("./lib/wallet", () => ({
  connectWallet: vi.fn(),
}));

describe("AidPulse app", () => {
  it("shows the project name and wallet actions", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "AidPulse" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Freighter/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Albedo/i })).toBeInTheDocument();
  });

  it("keeps payment disabled until a wallet is connected", () => {
    render(<App />);

    expect(screen.getByRole("button", { name: /Send payment/i })).toBeDisabled();
  });
});
