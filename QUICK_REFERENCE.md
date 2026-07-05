# AidPulse - Quick Reference Guide

## 🚀 Getting Started Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test                    # Frontend tests
cargo test --workspace      # Contract tests

# Build for production
npm run build

# Deploy to Testnet
npm run deploy:testnet
```

## 📁 Where to Find Things

| What You Need | Where It Is |
|---------------|-------------|
| Main app component | `src/App.tsx` |
| Wallet connection logic | `src/lib/wallet.ts` |
| Stellar API calls | `src/lib/stellar.ts` |
| Error handling | `src/lib/errors.ts` |
| Smart contracts | `contracts/aid_pulse/` & `contracts/reputation/` |
| Deployment scripts | `scripts/deploy-testnet.ps1` |
| CI/CD workflows | `.github/workflows/` |
| Project docs | `docs/` |
| Configuration | `vite.config.ts`, `tsconfig.json`, `Cargo.toml` |

## 🔧 Common Tasks

### Add a New React Component
1. Create file in `src/components/YourComponent.tsx`
2. Import and use in `src/App.tsx`

### Modify Smart Contract
1. Edit `contracts/aid_pulse/src/lib.rs`
2. Test with `cargo test --workspace`
3. Redeploy with `npm run deploy:testnet`

### Add Stellar Functionality
1. Add function to `src/lib/stellar.ts`
2. Use in your components
3. Handle errors via `src/lib/errors.ts`

### Deploy to Testnet
```powershell
# Set your funded Testnet account
$env:STELLAR_SOURCE_ACCOUNT="SA..."

# Run deployment
npm run deploy:testnet

# Restart dev server to pick up new contract IDs
npm run dev
```

## 🗂️ File Organization Rules

✅ **Keep Clean**
- Source code in `src/`
- Contracts in `contracts/`
- Documentation in `docs/`
- Scripts in `scripts/`

❌ **Don't Commit**
- `node_modules/`
- `target/`
- `dist/`
- `.env` or `.env.local`
- Build artifacts (`.cargo-target/`, `target*/`)

## 📝 Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
# Contract IDs (auto-filled by deploy script)
VITE_AID_PULSE_CONTRACT_ID=C...
VITE_REPUTATION_CONTRACT_ID=C...

# Network settings
VITE_STELLAR_NETWORK=testnet
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
```

## 🌐 Preview URLs

| View | URL |
|------|-----|
| Desktop | `http://localhost:5173/` |
| Mobile | `http://localhost:5173/mobile.html` |
| Responsive Preview | `http://localhost:5173/preview.html` |

## 🧪 Testing

```bash
# Frontend tests
npm test                          # Run all tests
npm test -- --watch              # Watch mode
npm test -- --coverage           # With coverage

# Contract tests
cargo test --workspace           # All contracts
cargo test -p aid_pulse          # Specific contract
cargo test -- --nocapture        # Show output
```

## 📦 Project Structure at a Glance

```
AidPulse/
├── 📂 contracts/          # Smart contracts (Rust)
│   ├── aid_pulse/        # Main contract
│   └── reputation/       # Reputation tracking
├── 📂 src/               # Frontend (React + TS)
│   ├── components/       # UI components
│   ├── lib/              # Core libraries
│   └── styles/           # CSS files
├── 📂 docs/              # Documentation
├── 📂 scripts/           # Deployment scripts
├── 📂 tests/             # Integration tests
└── 📄 Config files       # package.json, tsconfig.json, etc.
```

## 🛠️ Troubleshooting

### Wallet Not Connecting
1. Install Freighter extension
2. Switch to Stellar Testnet in Freighter
3. Unlock wallet
4. Refresh page and try again

### Contract Call Failing
1. Check contract is deployed: look in `.env.local`
2. Verify Testnet has funds
3. Check RPC URL is correct
4. Review error in console

### Build Errors
```bash
# Clean and reinstall
rm -rf node_modules
npm install

# Clean Rust artifacts
cargo clean
cargo build
```

## 📚 Additional Resources

- Full structure: `PROJECT_STRUCTURE.md`
- Main README: `README.md`
- Architecture: `docs/ARCHITECTURE.md`
- Demo guide: `docs/DEMO_PRESENTATION.md`

---

**Need help?** Check the docs folder or main README!
