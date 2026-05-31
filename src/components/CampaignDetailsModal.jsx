import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { X, ShieldCheck, Check, Calendar, Coins, ExternalLink, RefreshCw, Award } from 'lucide-react';

export default function CampaignDetailsModal({ campaign, onClose, onFundSuccess }) {
  const { publicKey, xlmBalance, supportCampaign, loading } = useWallet();
  const [amount, setAmount] = useState('50');
  const [selectedTier, setSelectedTier] = useState('backer');
  const [txSuccess, setTxSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');

  if (!campaign) return null;

  const {
    id,
    title,
    description,
    creator,
    target,
    raised,
    daysLeft,
    category,
    rewardToken
  } = campaign;

  const handleTierSelect = (tierType, val) => {
    setSelectedTier(tierType);
    setAmount(val);
  };

  const handleCustomAmountChange = (e) => {
    setSelectedTier('custom');
    setAmount(e.target.value);
  };

  const handleBackCampaign = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    const result = await supportCampaign(creator, amount, rewardToken);
    if (result.success) {
      setTxSuccess(true);
      setTxHash(result.hash || 'simulated_hash');
      onFundSuccess(campaign.id, parseFloat(amount));
    }
  };

  // Yield formula: Backer gets 5 project tokens per XLM funded
  const calculatedTokens = (parseFloat(amount) || 0) * 5;

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content">
        <button onClick={onClose} className="modal-close">
          <X size={20} />
        </button>

        {txSuccess ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'var(--color-emerald-glow)',
              border: '2px solid var(--color-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
            }}>
              <Check size={36} color="var(--color-emerald)" />
            </div>

            <h2 className="gradient-text" style={{ fontSize: '1.8rem', marginBottom: '12px' }}>
              Transaction Ledger Confirmed
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '400px', margin: '0 auto 24px' }}>
              Your payment of **{amount} XLM** has been successfully committed to the Stellar ledger. **{calculatedTokens} {rewardToken}** reward tokens have been allocated!
            </p>

            <div className="glass-panel" style={{
              padding: '16px',
              textAlign: 'left',
              background: 'rgba(255, 255, 255, 0.01)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              marginBottom: '28px',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                <span style={{ color: 'var(--color-emerald)', fontWeight: '700' }}>SUCCESS (Testnet)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Amount Paid:</span>
                <span style={{ color: 'white' }}>{amount} XLM</span>
              </div>
              {rewardToken && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Reward Asset:</span>
                  <span style={{ color: 'var(--color-amber)', fontWeight: '700' }}>{rewardToken}</span>
                </div>
              )}
              {txHash && !txHash.startsWith('sim') && (
                <div style={{ marginTop: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '6px' }}>
                  <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Tx Hash:</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', wordBreak: 'break-all' }}>{txHash}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              {txHash && !txHash.startsWith('sim') && (
                <a 
                  href={`https://stellar.expert/explorer/testnet/tx/${txHash}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn-accent"
                  style={{ textDecoration: 'none' }}
                >
                  <ExternalLink size={14} />
                  <span>Stellar.Expert Explorer</span>
                </a>
              )}
              <button onClick={onClose} className="btn-secondary">
                Close Panel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <span className="modal-category">{category}</span>
            <h2 className="modal-title">{title}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: 'monospace', marginBottom: '20px' }}>
              CREATOR ID: {creator}
            </p>

            <div className="modal-body">
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                {description}
              </p>

              {/* On-chain Asset Info */}
              <div className="glass-panel" style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.01)', border: '1px solid rgba(255, 255, 255, 0.03)', borderRadius: '16px' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Coins size={16} color="var(--color-cyan)" />
                  <span>Stellar Anchor Asset Metadata</span>
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Asset Type:</span>
                    <span className="stellar-badge">Alpha-Numeric 4</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Asset Symbol:</span>
                    <span style={{ color: 'var(--color-cyan)', fontWeight: '700' }}>{rewardToken}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Issuer Account:</span>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{creator.substring(0, 10)}...{creator.substring(creator.length - 10)}</span>
                  </div>
                </div>
              </div>

              {/* Reward yield statement */}
              <div className="asset-reward-card">
                <div className="asset-icon-box">
                  <Award size={20} />
                </div>
                <div className="asset-details">
                  <h4>Exclusive Supporter Reward Yield</h4>
                  <p>Backers earn **5 {rewardToken}** custom assets for every **1 XLM** backed. Trustline automatically established.</p>
                </div>
              </div>

              {/* Funding form */}
              <div className="funding-form-box">
                <h4 style={{ fontSize: '0.95rem', marginBottom: '12px' }}>Choose Funding Tier</h4>
                
                <div className="funding-tiers">
                  <button 
                    type="button"
                    onClick={() => handleTierSelect('backer', '50')}
                    className={`tier-button ${selectedTier === 'backer' ? 'active' : ''}`}
                  >
                    <span className="tier-name">Backer Tier</span>
                    <span className="tier-amount">50 XLM</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleTierSelect('champion', '150')}
                    className={`tier-button ${selectedTier === 'champion' ? 'active' : ''}`}
                  >
                    <span className="tier-name">Champion Tier</span>
                    <span className="tier-amount">150 XLM</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleTierSelect('legend', '500')}
                    className={`tier-button ${selectedTier === 'legend' ? 'active' : ''}`}
                  >
                    <span className="tier-name">Legend Tier</span>
                    <span className="tier-amount">500 XLM</span>
                  </button>
                </div>

                <form onSubmit={handleBackCampaign}>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label">Or Input Custom Amount (XLM)</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="number" 
                        min="1"
                        value={amount} 
                        onChange={handleCustomAmountChange} 
                        className="form-input" 
                        placeholder="Enter XLM quantity"
                        style={{ paddingRight: '60px' }}
                      />
                      <span style={{
                        position: 'absolute',
                        right: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        color: 'var(--text-muted)'
                      }}>XLM</span>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.85rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    padding: '12px',
                    borderRadius: '10px',
                    marginBottom: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.03)'
                  }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Minting Reward Allocation:</span>
                    <span style={{ color: 'var(--color-amber)', fontWeight: '700', fontFamily: 'var(--font-display)', fontSize: '1rem' }}>
                      {calculatedTokens.toLocaleString()} {rewardToken}
                    </span>
                  </div>

                  {publicKey ? (
                    <button 
                      type="submit" 
                      disabled={loading || parseFloat(amount) <= 0}
                      className="btn-primary" 
                      style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                    >
                      {loading ? (
                        <>
                          <RefreshCw size={16} className="animate-spin-slow" />
                          <span>Ledger Transaction Submitting...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={16} />
                          <span>Commit {amount} XLM to Stellar Ledger</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div 
                      className="btn-disabled"
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        textAlign: 'center',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}
                    >
                      Connect Wallet to Support Campaign
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
