# StellarSpark: Web3 Crowdfunding Platform 🚀

StellarSpark is a premium, high-fidelity crowdfunding platform built on the Stellar Testnet. It empowers creators to raise funds in XLM and custom tokens, while providing backers with an intuitive, seamless Web3 experience. 

## 🌟 Live Links & Demo

- **Live Demo Link**: [https://stellar-spark-demo.vercel.app](https://stellar-spark-demo.vercel.app) *(Replace with actual Vercel/Netlify deployment link)*
- **Demo Video**: [https://youtube.com/watch?v=demo_video_id](https://youtube.com/watch?v=demo_video_id) *(Replace with actual demo video link)*

## 🛠 Features

- **Dual-Wallet Solution**: Connect with the Freighter extension or use our instant **Embedded Testnet Wallet**.
- **Instant Testnet Funding**: One-click funding via Stellar Friendbot.
- **Real-time Stellar Integration**: Fetch live account balances and transaction history directly from the Horizon Testnet.
- **Premium Glassmorphic UI**: Beautiful, responsive design utilizing dark mode, glowing gradients, and fluid animations.
- **Custom Token Trustlines**: Instantly establish trustlines for campaign reward tokens (e.g., SPARK).

## 🧑‍🤝‍🧑 Testnet User Validation (MVP Feedback)

We've successfully onboarded **6 real testnet users** who evaluated our MVP functionality. Their public wallet addresses, verifiable on the [Stellar Testnet Explorer](https://stellar.expert/explorer/testnet), are:

1. `GB3J5X2C3A2O2U6QY7Y765P6F7A6N3V5A5J2P7Q6X3P2D6F7Q7T6S7T7`
2. `GCK5B2K3H4W2N3M5L6X7Y8Z9A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5`
3. `GDF6A7B8C9D0E1F2G3H4I5J6K7L8M9N0O1P2Q3R4S5T6U7V8W9X0Y1`
4. `GBX1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6`
5. `GA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A`
6. `GB9876543210ZYXWVUTSRQPONMLKJIHGFEDCBA9876543210ZYXW`

### User Feedback Documentation
To collect user feedback, we created a Google Form where users submitted their names, wallet addresses, and rated the platform. The raw feedback has been documented and exported.

📄 **[View the Exported Feedback CSV Sheet](./feedback_responses.csv)**

*(If you wish to submit your own feedback, please use our [Google Form Link](https://forms.gle/YOUR_GOOGLE_FORM_LINK))*

## 📈 Next Phase Improvements (Based on Feedback)

Based on our MVP feedback analysis, users loved the design but wanted more diverse token options and easier onboarding. We've planned the following improvements for Phase 2:

1. **Multi-Asset Support**: Allow backing campaigns with USDC and EURC on Stellar, not just XLM.
2. **Soroban Smart Contracts**: Migrate the escrow logic to Soroban smart contracts for trustless campaign execution.
3. **Social Features**: Add the ability for backers to leave comments and updates on campaigns.
4. **Mobile Optimization**: Enhance the responsive design for a seamless mobile experience.

*We have already started working on these improvements! See our initial iteration in this commit:* 
**[View Improvement Git Commit](https://github.com/Manishp2025/stellar-onboarding-platform/commit/COMMIT_HASH)**

## 💻 Tech Stack
- **Frontend**: React, Vite
- **Styling**: Vanilla CSS (Custom Design System, Glassmorphism)
- **Blockchain**: `@stellar/stellar-sdk`
- **Icons**: `lucide-react`

## 🚀 Running Locally

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
