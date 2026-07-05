# AidPulse - Project Structure

This document describes the clean, organized structure of the AidPulse project.

## 📁 Root Directory Structure

```
AidPulse/
├── .github/              # GitHub Actions workflows (CI/CD)
├── .stellar-config/      # Stellar network configuration
├── assets/               # Media assets (screenshots, videos)
├── contracts/            # Soroban smart contracts
├── docs/                 # Project documentation
├── scripts/              # Deployment and utility scripts
├── src/                  # Frontend source code
├── tests/                # Integration tests
├── wasm_utils/           # WebAssembly utilities
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore patterns
├── Cargo.toml            # Rust workspace configuration
├── package.json          # Node.js dependencies
├── README.md             # Main project documentation
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite build configuration
└── *.html                # HTML entry points (index, mobile, preview)
```

## 📂 Detailed Directory Breakdown

### `.github/workflows/`
- **Purpose**: Continuous Integration & Deployment
- **Contents**: 
  - `ci.yml` - Frontend and contract testing
  - `deploy-testnet.yml` - Automated Testnet deployment

### `.stellar-config/identity/`
- **Purpose**: Stellar wallet identities for deployment
- **Contents**: TOML configuration files for deployer accounts
- **Note**: ⚠️ Keep secrets out of version control

### `assets/`
Media assets for documentation

#### `assets/screenshots/`
- **Purpose**: UI screenshots for README and documentation
- **Contents**: PNG/JPG images of application interface

#### `assets/videos/`
- **Purpose**: Demo videos showing application features
- **Contents**: MP4 video files with walkthroughs

### `contracts/`
Main Soroban smart contracts written in Rust

#### `contracts/aid_pulse/`
- **Purpose**: Core escrow and aid case management contract
- **Structure**:
  - `Cargo.toml` - Contract dependencies
  - `src/lib.rs` - Contract implementation

#### `contracts/reputation/`
- **Purpose**: Reputation tracking contract (inter-contract calls)
- **Structure**:
  - `Cargo.toml` - Contract dependencies
  - `src/lib.rs` - Contract implementation

### `docs/`
Project documentation and guides
- `ARCHITECTURE.md` - Technical architecture overview
- `DEMO_PRESENTATION.md` - Demo walkthrough
- `SUBMISSION_CHECKLIST.md` - Project completion checklist

### `scripts/`
Utility scripts for deployment and automation
- `deploy-testnet.ps1` - PowerShell script for Testnet deployment

### `src/`
Frontend application source code (React + TypeScript)

#### Core Files
- `App.tsx` - Main application component
- `App.test.tsx` - Application tests
- `main.tsx` - Application entry point
- `config.ts` - Configuration management
- `test.setup.ts` - Test environment setup
- `preview.js` - Preview mode configuration

#### `src/components/`
- **Purpose**: Reusable React UI components
- **Status**: Ready for component files

#### `src/lib/`
Core utility libraries and SDK integrations
- `errors.ts` - Error handling and typed errors
- `stellar.ts` - Stellar Horizon API interactions
- `wallet.ts` - Wallet connection management

#### `src/styles/`
Application stylesheets
- `app.css` - Global and component styles

### `tests/`
- **Purpose**: Integration and E2E tests
- **Status**: Ready for test files

### `wasm_utils/`
WebAssembly utility functions for contract interactions
- `Cargo.toml` - WASM package configuration
- `src/lib.rs` - WASM utility implementations

## 🗂️ Configuration Files

### Root Configuration Files
- **`.env.example`** - Environment variable template (copy to `.env.local`)
- **`.gitignore`** - Organized ignore patterns for build artifacts, caches, and secrets
- **`Cargo.toml`** - Rust workspace configuration (manages all contract crates)
- **`Cargo.lock`** - Locked Rust dependencies
- **`package.json`** - Node.js dependencies and scripts
- **`tsconfig.json`** - TypeScript compiler options
- **`tsconfig.node.json`** - Node-specific TypeScript config
- **`vite.config.ts`** - Vite build tool configuration

### HTML Entry Points
- **`index.html`** - Main desktop application
- **`mobile.html`** - Mobile-optimized view
- **`preview.html`** - Standalone responsive preview

## 🚫 Ignored/Build Artifacts

The following directories are automatically generated and excluded from version control:

- `node_modules/` - Node.js dependencies
- `dist/` - Production build output
- `target/` - Rust compilation artifacts
- `.npm-cache/` - NPM cache
- `.cargo-target/` - Alternative Cargo target directory
- `.env`, `.env.local` - Environment secrets
- `*.wasm` - Compiled WebAssembly files
- `*.log` - Log files

## 🎯 Quick Navigation

| Task | Location |
|------|----------|
| Add a new contract | `contracts/` |
| Modify frontend UI | `src/App.tsx` or `src/components/` |
| Update Stellar API calls | `src/lib/stellar.ts` |
| Add wallet functionality | `src/lib/wallet.ts` |
| Write integration tests | `tests/` |
| Add documentation | `docs/` |
| Modify deployment | `scripts/deploy-testnet.ps1` |
| Update CI/CD | `.github/workflows/` |

## 📝 Development Workflow

1. **Start development**: `npm run dev`
2. **Make changes**: Edit files in `src/` or `contracts/`
3. **Test contracts**: `cargo test --workspace`
4. **Test frontend**: `npm test`
5. **Build**: `npm run build`
6. **Deploy to Testnet**: `npm run deploy:testnet`

## 🧹 Maintenance

This structure is kept clean by:
- ✅ Proper `.gitignore` patterns
- ✅ No duplicate directories
- ✅ Organized configuration files
- ✅ Clear separation of concerns
- ✅ Build artifacts excluded from version control

---

**Last Updated**: December 2024  
**Maintained by**: AidPulse Team
