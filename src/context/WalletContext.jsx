import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { StellarService } from '../services/stellar';

const WalletContext = createContext(null);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [walletType, setWalletType] = useState(null); // 'embedded' | 'freighter' | null
  const [publicKey, setPublicKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [xlmBalance, setXlmBalance] = useState('0.0000');
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [networkStatus, setNetworkStatus] = useState('online');

  // Add toast notification
  const addToast = useCallback((title, desc, type = 'info', hash = null) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, title, desc, type, hash }]);
    
    // Auto-remove toast after 6 seconds
    setTimeout(() => {
      removeToast(id);
    }, 6000);
  }, []);

  // Remove toast notification
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Refreshes balances from the Stellar Horizon Ledger
  const refreshBalances = useCallback(async (pubKey = publicKey) => {
    if (!pubKey) return;
    try {
      const details = await StellarService.fetchAccountDetails(pubKey);
      if (details && details.balances) {
        const native = details.balances.find(b => b.isNative);
        setXlmBalance(native ? native.balance : '0.0000');
        
        const assets = details.balances.filter(b => !b.isNative);
        setTokens(assets);
        setNetworkStatus('online');
      }
    } catch (err) {
      console.error('Failed to refresh balances:', err);
      setNetworkStatus('offline');
    }
  }, [publicKey]);

  // Connects a new or existing Embedded Wallet
  const connectEmbeddedWallet = async (isNew = false) => {
    setLoading(true);
    addToast('Securing Keypair', 'Initializing your instant testnet wallet...', 'info');

    if (!isNew) {
      const storedPub = localStorage.getItem('spark_wallet_pub');
      const storedSec = localStorage.getItem('spark_wallet_sec');
      
      if (storedPub && storedSec) {
        setPublicKey(storedPub);
        setSecretKey(storedSec);
        setWalletType('embedded');
        await refreshBalances(storedPub);
        addToast('Wallet Connected', 'Resumed session with saved Stellar address.', 'success');
        setLoading(false);
        return;
      }
    }

    // Generate brand new wallet
    const result = await StellarService.generateInstantWallet();
    if (result.success) {
      setPublicKey(result.publicKey);
      setSecretKey(result.secretKey);
      setXlmBalance(result.balance);
      setTokens([]);
      setWalletType('embedded');
      
      localStorage.setItem('spark_wallet_pub', result.publicKey);
      localStorage.setItem('spark_wallet_sec', result.secretKey);
      
      addToast(
        'Wallet Activated', 
        `Wallet created & funded with 10,000 XLM via Friendbot!`, 
        'success'
      );
    } else {
      // Offline / Congested fallback
      setPublicKey(result.publicKey);
      setSecretKey(result.secretKey);
      setXlmBalance(result.balance);
      setTokens([]);
      setWalletType('embedded');
      
      localStorage.setItem('spark_wallet_pub', result.publicKey);
      localStorage.setItem('spark_wallet_sec', result.secretKey);
      
      addToast(
        'Offline Mode Active', 
        'Stellar network congested. Initialized local sandbox wallet with 10,000 XLM.', 
        'info'
      );
    }
    setLoading(false);
  };

  // Connect via Freighter Wallet Extension (Simulated/Real bridge)
  const connectFreighterWallet = async () => {
    setLoading(true);
    addToast('Connecting Extension', 'Requesting Freighter wallet approval...', 'info');

    // To ensure full functionality even if the user doesn't have the Freighter extension,
    // we check window.stellarPublicKey and fallback to a beautiful simulated freighter account
    // if Freighter isn't installed. This keeps the experience flawless.
    try {
      if (window.stellarWeb3) {
        // Real extension logic
        const pub = await window.stellarWeb3.getPublicKey();
        setPublicKey(pub);
        setWalletType('freighter');
        await refreshBalances(pub);
        addToast('Freighter Connected', 'Successfully connected official browser wallet.', 'success');
      } else {
        // Stunning Simulated Freighter Account
        const simPub = 'GCFREIGHTER' + Math.random().toString(36).substr(2, 9).toUpperCase() + 'SIM';
        setPublicKey(simPub);
        setWalletType('freighter');
        setXlmBalance('850.5200'); // Standard demo balance
        setTokens([
          { assetCode: 'SPARK', balance: '120.0000', isNative: false }
        ]);
        addToast('Extension Simulated', 'No Freighter found. Connected gorgeous simulated extension wallet!', 'info');
      }
    } catch (err) {
      console.error(err);
      addToast('Connection Failed', 'User rejected connection request.', 'error');
    }
    setLoading(false);
  };

  // Disconnects active wallet
  const disconnectWallet = () => {
    setPublicKey('');
    setSecretKey('');
    setXlmBalance('0.0000');
    setTokens([]);
    setWalletType(null);
    localStorage.removeItem('spark_wallet_pub');
    localStorage.removeItem('spark_wallet_sec');
    addToast('Disconnected', 'Securely logged out from StellarSpark.', 'info');
  };

  // Refills embedded wallet via Friendbot
  const refillWallet = async () => {
    if (walletType !== 'embedded' || !publicKey) return;
    setLoading(true);
    addToast('Requesting Friendbot', 'Refueling account with 10,000 Testnet XLM...', 'info');
    
    const result = await StellarService.refillWallet(publicKey);
    if (result.success) {
      setXlmBalance(result.balance);
      addToast('Refill Successful', 'Received 10,000 XLM fuel from Friendbot!', 'success');
    } else {
      addToast('Refill Error', 'Horizon network rejected transaction. Try again in a minute.', 'error');
    }
    setLoading(false);
  };

  // Back a campaign
  const supportCampaign = async (creatorPublic, amountXlm, rewardTokenCode = null) => {
    if (!publicKey) {
      addToast('Connect Wallet', 'Please connect a wallet to fund this campaign.', 'error');
      return { success: false };
    }

    if (parseFloat(xlmBalance) < parseFloat(amountXlm)) {
      addToast('Insufficient Funds', 'You do not have enough XLM in your wallet.', 'error');
      return { success: false };
    }

    setLoading(true);
    addToast('Initiating Payment', `Submitting payment of ${amountXlm} XLM to Stellar ledger...`, 'info');

    // If using simulated Freighter, we simulate
    if (walletType === 'freighter' && publicKey.startsWith('GCFREIGHTER')) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update simulated balance
      const newBal = (parseFloat(xlmBalance) - parseFloat(amountXlm)).toFixed(4);
      setXlmBalance(newBal);

      // Update tokens if reward token code exists
      if (rewardTokenCode) {
        const rewardAmount = (parseFloat(amountXlm) * 5).toFixed(4);
        setTokens(prev => {
          const idx = prev.findIndex(t => t.assetCode === rewardTokenCode);
          if (idx > -1) {
            const copy = [...prev];
            copy[idx].balance = (parseFloat(copy[idx].balance) + parseFloat(rewardAmount)).toFixed(4);
            return copy;
          } else {
            return [...prev, { assetCode: rewardTokenCode, balance: rewardAmount, isNative: false }];
          }
        });
      }

      addToast(
        'Transaction Finalized', 
        `Successfully supported campaign! Sent ${amountXlm} XLM and received custom reward tokens.`, 
        'success',
        'sim_tx_hash_' + Math.random().toString(36).substr(2, 12)
      );
      setLoading(false);
      return { success: true };
    }

    // Direct Embedded Testnet Wallet transaction submission
    const tx = await StellarService.fundCampaign(secretKey, creatorPublic, amountXlm, rewardTokenCode);
    if (tx.success) {
      await refreshBalances();
      addToast(
        'Ledger Confirmed',
        `Successfully funded on-chain! Sent ${amountXlm} XLM. Received reward tokens.`,
        'success',
        tx.hash
      );
      setLoading(false);
      return { success: true, hash: tx.hash };
    } else {
      addToast('Transaction Failed', tx.error || 'Horizon rejected submission.', 'error');
      setLoading(false);
      return { success: false, error: tx.error };
    }
  };

  // Automatically refresh balances on mount & period
  useEffect(() => {
    const pub = localStorage.getItem('spark_wallet_pub');
    const sec = localStorage.getItem('spark_wallet_sec');
    if (pub && sec) {
      setPublicKey(pub);
      setSecretKey(sec);
      setWalletType('embedded');
      refreshBalances(pub);
    }
  }, [refreshBalances]);

  // Regular ledger polling
  useEffect(() => {
    if (!publicKey) return;
    const interval = setInterval(() => {
      refreshBalances();
    }, 8000);
    return () => clearInterval(interval);
  }, [publicKey, refreshBalances]);

  return (
    <WalletContext.Provider
      value={{
        walletType,
        publicKey,
        secretKey,
        xlmBalance,
        tokens,
        loading,
        toasts,
        networkStatus,
        connectEmbeddedWallet,
        connectFreighterWallet,
        disconnectWallet,
        refillWallet,
        refreshBalances,
        supportCampaign,
        addToast,
        removeToast
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
