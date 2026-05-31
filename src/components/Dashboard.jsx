import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { Copy, Check, Info, Shield, Key, RefreshCw, Zap, PlusCircle } from 'lucide-react';

export default function Dashboard({ onCreateCampaignClick, campaignsCount = 0, totalFundedXlm = 0 }) {
  const { 
    walletType, 
    publicKey, 
    secretKey, 
    xlmBalance, 
    tokens, 
    loading, 
    refillWallet, 
    connectEmbeddedWallet 
  } = useWallet();

  const [copiedKey, setCopiedKey] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <section className="dashboard-grid">
      {/* Welcome / Metric panel */}
      <div className="glass-panel welcome-card">
        <h2 className="gradient-text" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
          Ignite Change on the Stellar Network
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', marginBottom: '24px' }}>
          StellarSpark merges traditional crowdfunding with real-time asset tokenization. Back campaigns, support world-changing projects, and receive custom reward assets minted natively on Stellar Testnet.
        </p>

        <div className="global-metrics-row">
          <div className="metric-box">
            <span className="metric-label">Active Campaigns</span>
            <span className="metric-value">{campaignsCount}</span>
          </div>
          <div className="metric-box">
            <span className="metric-label">Total XLM Raised</span>
            <span className="metric-value">{parseFloat(totalFundedXlm).toLocaleString()} XLM</span>
          </div>
          <div className="metric-box">
            <span className="metric-label">Stellar Network Fee</span>
            <span className="metric-value" style={{ color: 'var(--color-cyan)' }}>0.0001 XLM</span>
          </div>
        </div>

        <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
          <button onClick={onCreateCampaignClick} className="btn-primary">
            <PlusCircle size={16} />
            <span>Launch a Campaign</span>
          </button>
          
          {!publicKey && (
            <button onClick={() => connectEmbeddedWallet(true)} className="btn-accent">
              <Zap size={16} />
              <span>Generate Instant Wallet</span>
            </button>
          )}
        </div>
      </div>

      {/* Wallet control panel */}
      <div className="glass-panel wallet-card">
        {publicKey ? (
          <>
            <div>
              <div className="wallet-header">
                <span className="wallet-title">
                  <Shield size={16} color="var(--color-indigo)" />
                  <span>{walletType === 'embedded' ? 'Embedded Testnet Wallet' : 'Freighter Wallet'}</span>
                </span>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: 'var(--color-emerald)',
                  padding: '2px 8px',
                  borderRadius: '20px',
                  textTransform: 'uppercase'
                }}>
                  ACTIVE
                </span>
              </div>

              <div className="wallet-balance-section">
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Available Balance
                </span>
                <div className="wallet-balance-xlm">
                  {parseFloat(xlmBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                  <span>XLM</span>
                </div>
                
                <div className="wallet-address">
                  <span>{publicKey.substring(0, 10)}...{publicKey.substring(publicKey.length - 10)}</span>
                  <button onClick={() => handleCopy(publicKey)} className="copy-btn">
                    {copiedKey ? <Check size={12} color="var(--color-emerald)" /> : <Copy size={12} />}
                  </button>
                </div>

                {walletType === 'embedded' && secretKey && (
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Key size={10} /> Secret Seed (Devs Only)
                      </span>
                      <button 
                        onClick={() => setShowSecret(!showSecret)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--color-cyan)', fontSize: '0.65rem', cursor: 'pointer', fontWeight: '600' }}
                      >
                        {showSecret ? 'Hide' : 'Reveal'}
                      </button>
                    </div>
                    {showSecret && (
                      <div className="wallet-address" style={{ borderStyle: 'dashed', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                        <span style={{ color: 'var(--color-amber)', fontSize: '0.7rem' }}>
                          {secretKey.substring(0, 10)}...{secretKey.substring(secretKey.length - 10)}
                        </span>
                        <button onClick={() => handleCopy(secretKey)} className="copy-btn">
                          {copiedKey ? <Check size={12} color="var(--color-emerald)" /> : <Copy size={12} />}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="wallet-actions">
              {walletType === 'embedded' && (
                <button 
                  onClick={refillWallet} 
                  disabled={loading}
                  className="btn-secondary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    background: 'rgba(99, 102, 241, 0.05)',
                    border: '1px solid rgba(99, 102, 241, 0.15)'
                  }}
                >
                  <RefreshCw size={13} className={loading ? 'animate-spin-slow' : ''} />
                  <span>Friendbot Fuel Refill (+10k XLM)</span>
                </button>
              )}

              {/* Asset list */}
              <div className="token-list">
                <span className="token-list-title">Custom Reward Tokens</span>
                {tokens.length > 0 ? (
                  tokens.map((token, i) => (
                    <div key={i} className="token-item">
                      <div className="token-item-info">
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--color-amber) 0%, var(--color-purple) 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.5rem',
                          fontWeight: '800',
                          color: 'black'
                        }}>T</div>
                        <span className="token-symbol">{token.assetCode}</span>
                      </div>
                      <span className="token-balance">{parseFloat(token.balance).toLocaleString()}</span>
                    </div>
                  ))
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', background: 'rgba(255, 255, 255, 0.01)', border: '1px solid rgba(255, 255, 255, 0.02)', borderRadius: '10px' }}>
                    <Info size={14} color="var(--text-muted)" />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      No project reward assets held yet. Fund a campaign to receive custom tokens!
                    </span>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%', 
            textAlign: 'center',
            padding: '20px 10px'
          }}>
            <div style={{
              background: 'var(--color-indigo-glow)',
              padding: '16px',
              borderRadius: '50%',
              color: 'var(--color-indigo)',
              marginBottom: '16px',
              boxShadow: '0 0 25px rgba(99, 102, 241, 0.15)'
            }}>
              <Wallet size={36} />
            </div>
            
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Stellar Wallet Required</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Connect your Freighter extension wallet or generate an instant embedded account funded with testnet XLM.
            </p>
            
            <button 
              onClick={() => connectEmbeddedWallet()}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Zap size={14} />
              <span>⚡ Setup Instant Wallet</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
