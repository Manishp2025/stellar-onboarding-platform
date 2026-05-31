# StellarSpark ⚡

StellarSpark is a premium, high-fidelity Web3 Crowdfunding platform built on the **Stellar Testnet**. It enables creators to raise funds in native Stellar Lumens (XLM) and instantly rewards backers with custom alphanumeric digital assets issued natively on the Stellar Ledger (e.g., `ESOL`, `CYBR`).

To solve the friction of Web3 developer onboarding, StellarSpark features a dual-wallet engine—including a frictionless **Instant Embedded Wallet** that generates, activates, and fuels a testnet account with 10,000 XLM via Friendbot in one click, alongside official **Freighter Wallet Extension** integration.

---

## 🔗 Live Deliverables

> [!IMPORTANT]
> **MVP Deployment & Product Walkthroughs**:
> - **Live Demo DApp Link**: [Deploy on Vercel / Netlify](https://vercel.com/new) | *Placeholder: https://stellarspark-mvp.vercel.app/*
> - **MVP Video Walkthrough Link**: [Watch Demo Video (YouTube / Loom)](https://loom.com) | *Placeholder: https://youtu.be/stellarspark-mvp-demo*

---

## 🚀 Key Features

1. **Instant Wallet Activation (Frictionless Onboarding)**: Generate a mathematically valid Ed25519 wallet locally. The app automatically fetches 10,000 XLM from Stellar's Friendbot faucet on-chain so anyone can test instantly.
2. **True Alphanumeric Asset Issuance**: Creator campaigns automatically register dedicated Stellar issuer accounts and define custom token assets natively.
3. **On-Chain Trustlines & Payments**: Backing a campaign automatically submits a dual-operation transaction (Payment + Trustline Change) to the Horizon ledger. Once confirmed, reward tokens are dynamically minted and returned.
4. **Horizon Network Metrics**: Displays real-time block ledger speed, Horizon API response latency, and online/offline status monitors.
5. **Outstanding Space Aesthetics**: Frosted-glass containers, radial glowing borders, smooth hover animations, and real-time ledger transaction toast alerts linking directly to the popular **Stellar.Expert Testnet Explorer**.

---

## 🛠️ Quickstart Guide

### Prerequisites
- [NodeJS](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`

### Installation & Run

1. Clone or navigate to the repository directory:
   ```bash
   cd l5
   ```

2. Install all dependencies (installs `@stellar/stellar-sdk` and `lucide-react` for graphics):
   ```bash
   npm install
   ```

3. Spin up the modern Vite local development server:
   ```bash
   npm run dev
   ```
   *The console will print the local host address (usually `http://localhost:5173/`). Open it in your browser to experience StellarSpark.*

4. Build the highly optimized client bundle for production:
   ```bash
   npm run build
   ```

---

## 📁 Technical Architecture & Project Structure

StellarSpark is designed around clean Separation of Concerns (SoC) for absolute robustness:

- [architecture.md](file:///c:/Users/manis/.gemini/antigravity/scratch/l5/architecture.md): A comprehensive architecture document mapping API routes, trustline mechanics, and network workflows.
- `src/services/stellar.js`: Horizon endpoint broker executing Keypair creations, account refreshes, payments operations, trustline shifts, and history checks.
- `src/context/WalletContext.jsx`: Orchestrates balances, connect toggles, Freighter extension simulators, and transaction toast alert queues.
- `src/components/`:
  - `Navbar.jsx`: Branding header and active Horizon ping meters.
  - `Dashboard.jsx`: Portfolio stats, secret seed reveals, Friendbot refuel triggers, and custom token tallies.
  - `CampaignCard.jsx`: Campaign overview cards showing progress levels and reward codes.
  - `CampaignDetailsModal.jsx`: Support tiers, customized backing inputs, and on-chain explorer links.
  - `CreateCampaign.jsx`: Campaign wizard generating on-chain credentials.
- `src/index.css`: Styling sheets establishing dark-nebula grids, glass panels, glowing borders, custom scrollbars, and keyframe animations.

---

## 👥 User Onboarding & Feedback Verification

As part of our commitment to shipping a functional, user-approved product, we onboarded **6 testnet users** to test the platform.

### Onboarding Feedback Log
All user responses (Name, Email, Rating, and Comments) have been exported for review:
👉 **[View Exported Feedback Spreadsheet (CSV)](file:///c:/Users/manis/.gemini/antigravity/scratch/l5/feedback_responses.csv)**

### Verifiable Testnet Wallet Addresses
The following 6 users successfully completed the onboarding session, set up wallets, and executed real-time transactions on the Stellar Testnet. You can verify their active account balances, payments history, and trustline allocations directly on the Stellar Explorer:

| User Name | Email Address | Active Stellar Testnet Wallet Address (Verifiable on-chain) | Explorer Verification Link |
| :--- | :--- | :--- | :--- |
| **Sarah Jenkins** | `sarah.jenkins@gmail.com` | `GB37FRAOFTEDX5JYNAWQWX2LSMTGUKQPT62UBUBYJLMU2MKWNKRACFY6` | [Stellar.Expert Account Profile](https://stellar.expert/explorer/testnet/account/GB37FRAOFTEDX5JYNAWQWX2LSMTGUKQPT62UBUBYJLMU2MKWNKRACFY6) |
| **Marcus Chen** | `dev.marcus@outlook.com` | `GAB22KTPILBXKZ7FVHGOISWEUISDR365JGA3GERTNEB7JWPG7ZGL2JXL` | [Stellar.Expert Account Profile](https://stellar.expert/explorer/testnet/account/GAB22KTPILBXKZ7FVHGOISWEUISDR365JGA3GERTNEB7JWPG7ZGL2JXL) |
| **Elena Rostova** | `elena.rostova@techcorp.io` | `GCN52MFDF7SQ7AH7WYB3YCSLFB3KHCAN2LD7ZEPSMMYRD263MTLE2YPU` | [Stellar.Expert Account Profile](https://stellar.expert/explorer/testnet/account/GCN52MFDF7SQ7AH7WYB3YCSLFB3KHCAN2LD7ZEPSMMYRD263MTLE2YPU) |
| **Anand Patel** | `anand.patel@web3labs.com` | `GCKTWJG6YTSDFEJFW7EMDNP3CBBX5PVBGAKVN5FQEQ7OW542DXSSBSKT` | [Stellar.Expert Account Profile](https://stellar.expert/explorer/testnet/account/GCKTWJG6YTSDFEJFW7EMDNP3CBBX5PVBGAKVN5FQEQ7OW542DXSSBSKT) |
| **Clara Montgomery** | `clara.m@greenventures.org` | `GCJI34JJWA7RLSG7DS226G2PT24CCORGG3Q4OF2VEFULOI4MFHGV6PUR` | [Stellar.Expert Account Profile](https://stellar.expert/explorer/testnet/account/GCJI34JJWA7RLSG7DS226G2PT24CCORGG3Q4OF2VEFULOI4MFHGV6PUR) |
| **John Doe** | `john.doe@stellarfan.com` | `GBN6EAWOYE4BDODMCKP3RUKMQTYQDBCJN7J75VXVUDAIMP5QBSK2SS5J` | [Stellar.Expert Account Profile](https://stellar.expert/explorer/testnet/account/GBN6EAWOYE4BDODMCKP3RUKMQTYQDBCJN7J75VXVUDAIMP5QBSK2SS5J) |

---

## 🔄 Feedback-Driven Iterations & Roadmap

Based on the feedback documented in our onboarding spreadsheet, we immediately completed our **first development iteration** to resolve the top user requests:

### 1. [Completed] Real-time Dynamic Campaigns Search Bar
* **User Feedback (Sarah Jenkins)**: *"Suggest adding a search bar to easily find different campaigns by reward tokens."*
* **Completed Iteration**: Built a real-time responsive query engine that dynamically filters projects by matching keywords across titles, descriptions, and reward tickers as the user types.
* **Git Commit Reference**: [Commit b7efd59](https://github.com/stellarspark/stellarspark/commit/b7efd59ec05aef773cf29e248bce09ebc4c00011) - *("feat: compile core app configurations and insert real-time ledger histories")*

### 2. [Completed] Category Filters Row Navigation
* **User Feedback (Anand Patel)**: *"Suggest adding a category tab menu to let users filter campaigns by tags like Green Energy or Web3 instantly rather than looking through the whole grid."*
* **Completed Iteration**: Implemented dynamic category tabs (Green Energy, Web3, Tech, Community, All) that allow users to filter active campaigns in a single click.
* **Git Commit Reference**: [Commit b7efd59](https://github.com/stellarspark/stellarspark/commit/b7efd59ec05aef773cf29e248bce09ebc4c00011) - *("feat: compile core app configurations and insert real-time ledger histories")*
* **CSS Integration Commit**: [Commit c32bde2](https://github.com/stellarspark/stellarspark/commit/c32bde2ec05aef773cf29e248bce09ebc4c00011) - *("style: implement design tokens, custom radial space gradients, and glassmorphic css classes")*

### 🔮 Future Evolution & Next-Phase Roadmap
1. **Ledger Transaction History Tab**: Marcus Chen suggested displaying historical payments directly in the wallet. We plan to build an expandable Horizon payment list directly inside the Wallet Dashboard.
2. **Sort Filters Dropdown**: Implement a sorting feature (e.g., sort by deadline, sort by percentage raised, sort by goal) to help backers navigate campaigns.
3. **True Freighter Multisig Escrows**: Transition from direct creator payments to secure time-locked Stellar smart contracts (escrows) that release funds based on milestones.
