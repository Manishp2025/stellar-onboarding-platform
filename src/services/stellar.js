import { Server, Keypair, TransactionBuilder, Networks, Asset, Operation } from '@stellar/stellar-sdk';

const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const server = new Server(HORIZON_URL);

/**
 * Service to manage all Stellar Testnet interactions
 */
export const StellarService = {
  /**
   * Generates a new random Stellar keypair and funds it via Friendbot
   */
  async generateInstantWallet() {
    try {
      // 1. Generate keypair
      const keypair = Keypair.random();
      const publicKey = keypair.publicKey();
      const secretKey = keypair.secret();

      // 2. Fund via Friendbot
      const friendbotUrl = `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`;
      const response = await fetch(friendbotUrl);
      
      if (!response.ok) {
        throw new Error('Friendbot funding request failed. Stellar Testnet may be congested.');
      }

      await response.json();

      // 3. Load account to confirm it exists and fetch balance
      const account = await server.loadAccount(publicKey);
      const xlmBalance = this._getXlmBalance(account);

      return {
        success: true,
        publicKey,
        secretKey,
        balance: xlmBalance,
        tokens: []
      };
    } catch (error) {
      console.error('Error generating instant wallet:', error);
      // Fallback for offline testing or when Friendbot fails
      const offlineKeyPair = Keypair.random();
      return {
        success: false,
        error: error.message || 'Network error',
        publicKey: offlineKeyPair.publicKey(),
        secretKey: offlineKeyPair.secret(),
        balance: '10000.0000', // Simulated balance for offline testing
        tokens: []
      };
    }
  },

  /**
   * Refills an embedded wallet using Friendbot
   */
  async refillWallet(publicKey) {
    try {
      const friendbotUrl = `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`;
      const response = await fetch(friendbotUrl);
      if (!response.ok) {
        throw new Error('Friendbot refill failed.');
      }
      await response.json();
      const account = await server.loadAccount(publicKey);
      return {
        success: true,
        balance: this._getXlmBalance(account)
      };
    } catch (error) {
      console.error('Error refilling wallet:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Fetches account details, XLM balance, and custom assets
   */
  async fetchAccountDetails(publicKey) {
    if (!publicKey) return null;
    try {
      const account = await server.loadAccount(publicKey);
      
      const balances = account.balances.map(b => {
        if (b.asset_type === 'native') {
          return {
            assetCode: 'XLM',
            balance: parseFloat(b.balance).toFixed(4),
            isNative: true
          };
        } else {
          return {
            assetCode: b.asset_code,
            assetIssuer: b.asset_issuer,
            balance: parseFloat(b.balance).toFixed(4),
            isNative: false
          };
        }
      });

      return {
        publicKey,
        balances,
        success: true
      };
    } catch (error) {
      console.error(`Error loading account details for ${publicKey}:`, error);
      // If the account doesn't exist yet on testnet
      return {
        publicKey,
        balances: [
          { assetCode: 'XLM', balance: '0.0000', isNative: true }
        ],
        success: false,
        error: 'Account not activated or offline.'
      };
    }
  },

  /**
   * Creates a transaction on Stellar to fund a campaign
   * Also establishes a trustline and issues reward tokens to the supporter!
   * @param {string} supporterSecret - Secret key of the backer
   * @param {string} creatorPublic - Public key of the campaign creator
   * @param {string} amountXlm - Amount of XLM to back the campaign
   * @param {string} rewardTokenCode - Code of the reward token (e.g. SPARK)
   */
  async fundCampaign(supporterSecret, creatorPublic, amountXlm, rewardTokenCode = null) {
    try {
      const supporterKeypair = Keypair.fromSecret(supporterSecret);
      const supporterPublic = supporterKeypair.publicKey();

      // 1. Load supporter account
      const sourceAccount = await server.loadAccount(supporterPublic);

      // 2. Build Transaction
      // Basic payment operation: Supporter pays XLM to Creator
      const paymentOp = Operation.payment({
        destination: creatorPublic,
        asset: Asset.native(),
        amount: parseFloat(amountXlm).toFixed(7)
      });

      const operations = [paymentOp];

      // 3. Optional Custom Reward Token issuance (Stellar Trustline & Minting)
      // If a reward token code is specified, we set up a trustline for it, and the creator pays reward tokens back!
      // To simulate true issuance, we establish a trustline on the supporter's account
      if (rewardTokenCode) {
        // The creator will act as the issuer of this reward asset
        const rewardAsset = new Asset(rewardTokenCode, creatorPublic);
        
        // Supporter changes trust to accept the reward asset
        const trustOp = Operation.changeTrust({
          asset: rewardAsset,
          limit: '1000000'
        });
        operations.push(trustOp);
      }

      const transaction = new TransactionBuilder(sourceAccount, {
        fee: '100',
        networkPassphrase: Networks.TESTNET
      })
        .addOperations(operations)
        .setTimeout(180)
        .build();

      transaction.sign(supporterKeypair);

      const result = await server.submitTransaction(transaction);
      
      // If we had a reward asset, let's simulate the creator sending the reward tokens back.
      // In a real production setup, a backend listener or multisig would handle the mint, 
      // but we can execute the mint right now if the supporter trustline is established!
      if (rewardTokenCode) {
        try {
          // In order for the creator to send tokens, we'd need their signature.
          // Since the creator is simulated (or we generate a keypair for them), 
          // we can send a transfer of the reward token from the creator to the backer.
          // Let's check if we have the creator's secret key stored in localStorage (which we do if they created it in-app!).
          const creatorSecret = localStorage.getItem(`creator_sec_${creatorPublic}`);
          if (creatorSecret) {
            const creatorKeypair = Keypair.fromSecret(creatorSecret);
            const creatorAccount = await server.loadAccount(creatorPublic);
            
            // Wait 1.5 seconds for trustline registration on ledger
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Reward ratio: 5 reward tokens per 1 XLM supported
            const rewardAmount = (parseFloat(amountXlm) * 5).toFixed(7);

            const rewardPayTransaction = new TransactionBuilder(creatorAccount, {
              fee: '100',
              networkPassphrase: Networks.TESTNET
            })
              .addOperation(
                Operation.payment({
                  destination: supporterPublic,
                  asset: new Asset(rewardTokenCode, creatorPublic),
                  amount: rewardAmount
                })
              )
              .setTimeout(180)
              .build();

            rewardPayTransaction.sign(creatorKeypair);
            await server.submitTransaction(rewardPayTransaction);
            console.log(`Minted and sent ${rewardAmount} ${rewardTokenCode} rewards to supporter!`);
          }
        } catch (mintError) {
          console.warn('Could not auto-mint reward tokens:', mintError);
        }
      }

      return {
        success: true,
        hash: result.hash,
        ledger: result.ledger
      };
    } catch (error) {
      console.error('Stellar payment transaction failed:', error);
      return {
        success: false,
        error: error.message || 'Transaction submission error'
      };
    }
  },

  /**
   * Registers a campaign on Stellar. Generates a new account for the campaign creator
   * if they do not have one, and issues/registers their reward asset code.
   */
  async registerCampaignAsset(assetCode) {
    try {
      // 1. Create a dedicated account for this campaign creator/issuer
      const creatorKeypair = Keypair.random();
      const creatorPublic = creatorKeypair.publicKey();
      const creatorSecret = creatorKeypair.secret();

      // 2. Fund the creator account using Friendbot so it's a valid Stellar account
      const friendbotUrl = `https://friendbot.stellar.org?addr=${encodeURIComponent(creatorPublic)}`;
      const response = await fetch(friendbotUrl);
      if (!response.ok) {
        throw new Error('Could not fund creator account via Friendbot.');
      }
      await response.json();

      // Store the creator's secret key locally to allow automatic reward token signing later!
      localStorage.setItem(`creator_sec_${creatorPublic}`, creatorSecret);

      return {
        success: true,
        creatorPublic,
        creatorSecret,
        assetCode
      };
    } catch (error) {
      console.error('Error registering campaign asset:', error);
      // Offline fallback
      const mockKeypair = Keypair.random();
      return {
        success: true, // Fail-soft for offline development
        creatorPublic: mockKeypair.publicKey(),
        creatorSecret: mockKeypair.secret(),
        assetCode,
        offline: true
      };
    }
  },

  /**
   * Queries payment transactions for a given public key to show real-time history
   */
  async fetchTransactionHistory(publicKey) {
    if (!publicKey) return [];
    try {
      const payments = await server.payments()
        .forAccount(publicKey)
        .order('desc')
        .limit(10)
        .call();

      return payments.records.map(p => {
        const isSender = p.source_account === publicKey;
        return {
          id: p.id,
          type: p.type,
          amount: p.amount ? parseFloat(p.amount).toFixed(2) : '0.00',
          asset: p.asset_type === 'native' ? 'XLM' : p.asset_code,
          party: isSender ? p.to : p.from,
          isSender,
          hash: p.transaction_hash,
          createdAt: p.created_at
        };
      });
    } catch (error) {
      console.error('Error fetching payments history:', error);
      return [];
    }
  },

  /**
   * Internal helper to extract XLM balance
   */
  _getXlmBalance(account) {
    const nativeBalance = account.balances.find(b => b.asset_type === 'native');
    return nativeBalance ? parseFloat(nativeBalance.balance).toFixed(4) : '0.0000';
  }
};
