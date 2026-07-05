var state = { publicKey: "", provider: "" };
var TESTNET_HORIZON_URL = "https://horizon-testnet.stellar.org";

var statusEl = document.getElementById("walletStatus");
var publicKeyEl = document.getElementById("publicKey");
var walletProviderEl = document.getElementById("walletProvider");
var balanceEl = document.getElementById("balanceValue");
var balanceHintEl = document.getElementById("balanceHint");
var noticeEl = document.getElementById("noticeBar");
var ledgerEl = document.getElementById("ledgerList");
var disconnectButton = document.getElementById("disconnectWallet");
var paymentButton = document.getElementById("mockPayment");
var contractButton = document.getElementById("mockContractCall");
var caseTitleInput = document.getElementById("caseTitle");
var caseTargetInput = document.getElementById("caseTarget");
var createCaseButton = document.getElementById("createCaseButton");
var caseListEl = document.getElementById("caseList");
var eventFilterInput = document.getElementById("eventFilter");
var clearEventsButton = document.getElementById("clearEventsButton");

function setNotice(tone, title, detail) {
  noticeEl.className = "notice-bar " + tone;
  noticeEl.innerHTML = "<strong>" + title + "</strong><span>" + detail + "</span>";
  statusEl.className = "status-pill " + tone;
  statusEl.textContent = tone === "success" ? state.provider + " connected" : tone === "error" ? "Connection failed" : "Wallet not connected";
}

function shorten(publicKey) {
  return publicKey ? publicKey.slice(0, 8) + "..." + publicKey.slice(-8) : "No wallet connected";
}

function isValidPublicKey(publicKey) {
  return /^G[A-Z2-7]{55}$/.test(publicKey || "");
}

function readProviderError(error) {
  if (!error) return "Unknown wallet error.";
  if (typeof error === "string") return error;
  if (error.message) return error.message;
  if (error.error) return readProviderError(error.error);
  return "Wallet rejected or could not complete the request.";
}

function readAddress(response) {
  if (typeof response === "string") return response;
  if (response && response.error) throw new Error(readProviderError(response.error));
  return response && (response.address || response.publicKey || response.pubkey);
}

function readBoolean(response, key) {
  if (typeof response === "boolean") return response;
  if (response && response.error) throw new Error(readProviderError(response.error));
  return Boolean(response && response[key]);
}

function normalizeFreighterApi(candidate) {
  if (!candidate) return null;
  var options = [
    candidate,
    candidate.default,
    candidate.freighterApi,
    candidate.freighter,
    candidate.api,
    candidate.default && candidate.default.freighterApi,
    candidate.default && candidate.default.freighter
  ].filter(Boolean);

  return options.find(function (item) {
    return typeof item.requestAccess === "function" ||
      typeof item.getAddress === "function" ||
      typeof item.getPublicKey === "function";
  }) || null;
}

async function waitForInjectedFreighter() {
  for (var attempt = 0; attempt < 20; attempt += 1) {
    var injected = normalizeFreighterApi(window.freighterApi || window.freighter || (window.stellar && window.stellar.freighter));
    if (injected) return injected;
    await new Promise(function (resolve) { setTimeout(resolve, 100); });
  }
  return null;
}

function withTimeout(promise, milliseconds) {
  return Promise.race([
    promise,
    new Promise(function (_, reject) {
      setTimeout(function () { reject(new Error("Timed out loading Freighter API.")); }, milliseconds);
    })
  ]);
}

async function loadFreighterPackage() {
  var urls = [
    "https://esm.sh/@stellar/freighter-api@4.1.0?bundle",
    "https://cdn.jsdelivr.net/npm/@stellar/freighter-api@4.1.0/+esm"
  ];

  for (var index = 0; index < urls.length; index += 1) {
    try {
      var moduleApi = await withTimeout(import(urls[index]), 3500);
      var api = normalizeFreighterApi(moduleApi);
      if (api) return api;
    } catch (error) {
      // Try the next CDN before reporting a loading problem.
    }
  }

  return null;
}

async function waitForFreighter() {
  return (await waitForInjectedFreighter()) || (await loadFreighterPackage());
}

async function getFreighterAddress(api) {
  if (api.isConnected) {
    var connected = readBoolean(await api.isConnected(), "isConnected");
    if (!connected) {
      throw new Error("Freighter extension is not responding. Unlock Freighter, make sure it is enabled for this site, then refresh.");
    }
  }

  if (api.requestAccess) return readAddress(await api.requestAccess());
  if (api.getAddress) return readAddress(await api.getAddress());
  if (api.getPublicKey) return readAddress(await api.getPublicKey());
  throw new Error("Freighter API loaded, but no public-key method was available. Update Freighter and refresh.");
}

async function connectFreighter() {
  try {
    setNotice("pending", "Waiting for Freighter.", "Approve the connection request in the Freighter extension. If no popup appears, unlock Freighter and refresh this page.");
    var api = await waitForFreighter();
    if (!api) {
      throw new Error("Freighter API could not load. Open this page in Chrome or Brave with Freighter installed, keep internet access enabled, then refresh.");
    }
    var publicKey = await getFreighterAddress(api);
    await connectWithPublicKey("Freighter", publicKey);
  } catch (error) {
    setNotice("error", "Freighter connection failed.", readProviderError(error));
  }
}

function buildAlbedoUrl() {
  var callback = window.location.origin + window.location.pathname + "?wallet=albedo";
  return "https://albedo.link/intent/publicKey?callback=" + encodeURIComponent(callback);
}

function connectAlbedo() {
  setNotice("pending", "Opening Albedo.", "Complete the Albedo wallet flow. If it opens in this tab, approve it and return to AidPulse.");
  window.location.href = buildAlbedoUrl();
}

async function fetchBalance(publicKey) {
  var response = await fetch(TESTNET_HORIZON_URL + "/accounts/" + publicKey);
  if (!response.ok) throw new Error("Wallet account was not found on Stellar Testnet. Fund it with Friendbot first.");
  var account = await response.json();
  var nativeBalance = account.balances.find(function (balance) { return balance.asset_type === "native"; });
  return nativeBalance ? nativeBalance.balance : "0.0000000";
}

async function connectWithPublicKey(provider, publicKey) {
  if (!isValidPublicKey(publicKey)) throw new Error(provider + " did not return a valid Stellar public key.");
  state.publicKey = publicKey;
  state.provider = provider;
  publicKeyEl.textContent = shorten(publicKey);
  walletProviderEl.textContent = provider + " wallet connected by user.";
  disconnectButton.disabled = false;
  paymentButton.disabled = false;
  contractButton.disabled = false;

  try {
    var balance = await fetchBalance(publicKey);
    balanceEl.textContent = balance;
    balanceHintEl.textContent = "Loaded from Stellar Testnet Horizon.";
    setNotice("success", "Wallet connected.", provider + " connected " + shorten(publicKey) + " with " + balance + " XLM.");
  } catch (error) {
    balanceEl.textContent = "0.0000000";
    balanceHintEl.textContent = "Connected wallet needs Testnet funding before balance can load.";
    setNotice("success", "Wallet connected.", provider + " connected " + shorten(publicKey) + ". " + readProviderError(error));
  }
  prependEvent("wallet / connected", "local", provider + ": " + shorten(publicKey));
}

function disconnectWallet() {
  state.publicKey = "";
  state.provider = "";
  publicKeyEl.textContent = "No wallet connected";
  walletProviderEl.textContent = "Choose Freighter or Albedo to continue.";
  balanceEl.textContent = "0.0000000";
  balanceHintEl.textContent = "Balance loads after a real wallet connects on Stellar Testnet.";
  disconnectButton.disabled = true;
  paymentButton.disabled = true;
  contractButton.disabled = true;
  setNotice("pending", "Wallet disconnected.", "Connect Freighter or Albedo to continue.");
  prependEvent("wallet / disconnected", "local", "Wallet disconnected by user");
}

function prependEvent(topic, ledger, value) {
  var item = document.createElement("article");
  item.className = "event-item";
  item.dataset.topic = topic.toLowerCase();
  item.dataset.value = value.toLowerCase();
  item.innerHTML = "<strong>" + topic + "</strong><span>" + ledger + "</span><small>" + value + "</small>";
  ledgerEl.prepend(item);
  applyEventFilter();
}

function applyEventFilter() {
  if (!eventFilterInput || !ledgerEl) return;
  var query = eventFilterInput.value.trim().toLowerCase();
  Array.prototype.forEach.call(ledgerEl.querySelectorAll(".event-item"), function (item) {
    var haystack = (item.dataset.topic || "") + " " + (item.dataset.value || "") + " " + item.textContent.toLowerCase();
    item.hidden = query.length > 0 && haystack.indexOf(query) === -1;
  });
}

function clearEvents() {
  if (!ledgerEl) return;
  if (eventFilterInput) eventFilterInput.value = "";
  ledgerEl.innerHTML = "<article class=\"event-item\"><strong>ledger / cleared</strong><span>Local</span><small>Event stream cleared by user</small></article>";
  setNotice("success", "Event ledger cleared.", "The local event console is ready for new actions.");
  applyEventFilter();
}

function createLocalCase() {
  if (!caseTitleInput || !caseTargetInput || !caseListEl) return;
  var title = caseTitleInput.value.trim();
  var target = Number(caseTargetInput.value);
  if (!title) {
    setNotice("error", "Case title required.", "Enter a short title before adding an aid case.");
    return;
  }
  if (!Number.isFinite(target) || target <= 0) {
    setNotice("error", "Invalid target.", "Target XLM must be greater than zero.");
    return;
  }
  var item = document.createElement("article");
  item.className = "case-mini";
  item.innerHTML = "<strong>" + title + "</strong><span>" + target.toFixed(2) + " XLM target</span>";
  caseListEl.prepend(item);
  prependEvent("case / local-created", "local", title + " target " + target.toFixed(2) + " XLM");
  setNotice("success", "Aid case added.", title + " was added to the local case manager.");
}

function previewAction(type) {
  if (!state.publicKey) {
    setNotice("error", "Wallet required.", "Connect a real wallet before using this action.");
    return;
  }
  setNotice("success", type + " ready.", state.provider + " wallet " + shorten(state.publicKey) + " is connected.");
  prependEvent(type.toLowerCase().replaceAll(" ", "_") + " / ready", "local", "Action enabled by connected wallet");
}

function readAlbedoCallback() {
  var params = new URLSearchParams(window.location.search);
  var hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  var publicKey = params.get("pubkey") || params.get("public_key") || hashParams.get("pubkey") || hashParams.get("public_key");
  if (publicKey) connectWithPublicKey("Albedo", publicKey).catch(function (error) {
    setNotice("error", "Albedo connection failed.", readProviderError(error));
  });
}

window.addEventListener("DOMContentLoaded", function () {
  document.getElementById("connectFreighter").addEventListener("click", connectFreighter);
  document.getElementById("connectAlbedo").addEventListener("click", connectAlbedo);
  disconnectButton.addEventListener("click", disconnectWallet);
  paymentButton.addEventListener("click", function () { previewAction("Payment"); });
  contractButton.addEventListener("click", function () { previewAction("Contract call"); });
  if (createCaseButton) createCaseButton.addEventListener("click", createLocalCase);
  if (eventFilterInput) eventFilterInput.addEventListener("input", applyEventFilter);
  if (clearEventsButton) clearEventsButton.addEventListener("click", clearEvents);
  applyEventFilter();
  readAlbedoCallback();
});



