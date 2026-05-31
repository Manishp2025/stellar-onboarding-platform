import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { StellarService } from '../services/stellar';
import { X, Sparkles, Coins, HelpCircle, RefreshCw } from 'lucide-react';

export default function CreateCampaign({ onClose, onCreateSuccess }) {
  const { publicKey, addToast } = useWallet();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [target, setTarget] = useState('1000');
  const [category, setCategory] = useState('Green Energy');
  const [days, setDays] = useState('30');
  const [rewardToken, setRewardToken] = useState('SPARK');
  
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!publicKey) {
      addToast('Connect Wallet', 'Please connect a wallet to launch a campaign.', 'error');
      return;
    }

    if (!title || !description || !target || !rewardToken) {
      addToast('Missing Fields', 'Please complete all required fields.', 'error');
      return;
    }

    if (rewardToken.length < 2 || rewardToken.length > 4) {
      addToast('Invalid Token Code', 'Asset code must be between 2 and 4 characters.', 'error');
      return;
    }

    // Format reward token (only capitals)
    const formattedToken = rewardToken.toUpperCase().replace(/[^A-Z]/g, '');

    setSubmitting(true);
    addToast('Issuing Custom Asset', 'Generating campaign credentials and creating asset on-chain...', 'info');

    try {
      // Create campaign accounts and structures on Stellar
      const result = await StellarService.registerCampaignAsset(formattedToken);
      
      const newCampaign = {
        id: Date.now().toString(),
        title,
        description,
        creator: result.creatorPublic, // Actual new funded Stellar account
        target: parseFloat(target),
        raised: 0,
        daysLeft: parseInt(days),
        category,
        rewardToken: formattedToken,
        bannerGradient: _getRandomGradient()
      };

      // Delay briefly for visual polish
      await new Promise(resolve => setTimeout(resolve, 1500));

      addToast(
        'Campaign Created', 
        `Successfully issued custom Stellar reward asset "${formattedToken}"!`, 
        'success'
      );
      
      onCreateSuccess(newCampaign);
      onClose();
    } catch (err) {
      console.error(err);
      addToast('Creation Failed', 'Stellar ledger asset issuance error.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const _getRandomGradient = () => {
    const gradients = [
      'linear-gradient(135deg, #3b0764 0%, #1e1b4b 100%)', // Purple deep
      'linear-gradient(135deg, #022c22 0%, #064e3b 100%)', // Green deep
      'linear-gradient(135deg, #1c1917 0%, #44403c 100%)', // Slate deep
      'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)', // Blue deep
      'linear-gradient(135deg, #581c87 0%, #3b0764 100%)'  // Indigo deep
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content" style={{ maxWidth: '580px' }}>
        <button onClick={onClose} className="modal-close">
          <X size={20} />
        </button>

        <span className="modal-category" style={{ background: 'var(--color-indigo-glow)', color: 'var(--color-indigo)' }}>
          CREATOR SUITE
        </span>
        <h2 className="modal-title">Launch Crowdfunding Campaign</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>
          Publish your vision onto StellarSpark. This will automatically issue a custom digital token on Stellar Testnet for your project.
        </p>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label className="form-label">Project Campaign Title</label>
            <input 
              type="text" 
              required
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="form-input" 
              placeholder="e.g. EcoSphere Smart Solar Grid"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Project Core Description</label>
            <textarea 
              required
              rows="3"
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="form-input" 
              placeholder="Describe what you plan to accomplish and how funding will be used..."
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Funding Goal (XLM)</label>
              <input 
                type="number" 
                required
                min="100"
                value={target} 
                onChange={(e) => setTarget(e.target.value)} 
                className="form-input" 
                placeholder="1000"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Campaign Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="form-input"
                style={{ appearance: 'none', background: 'var(--bg-glass-input) url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2394a3b8\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E") no-repeat right 16px center', backgroundSize: '16px' }}
              >
                <option value="Green Energy">Green Energy</option>
                <option value="Tech & Gadgets">Tech & Gadgets</option>
                <option value="Web3 Innovation">Web3 Innovation</option>
                <option value="Community Impact">Community Impact</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Duration (Days)</label>
              <input 
                type="number" 
                required
                min="5"
                max="90"
                value={days} 
                onChange={(e) => setDays(e.target.value)} 
                className="form-input" 
                placeholder="30"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>Reward Token Code</span>
                <HelpCircle size={12} color="var(--text-muted)" title="A custom alphanumeric ticker that will represent your campaign's perks/points on Stellar" />
              </label>
              <input 
                type="text" 
                required
                maxLength="4"
                value={rewardToken} 
                onChange={(e) => setRewardToken(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))} 
                className="form-input" 
                placeholder="e.g. ESOL"
              />
            </div>
          </div>

          {/* Reward yield preview banner */}
          {rewardToken && (
            <div className="glass-panel" style={{
              padding: '12px 16px',
              background: 'rgba(245, 158, 11, 0.02)',
              border: '1px dashed rgba(245, 158, 11, 0.15)',
              borderRadius: '12px',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Coins size={16} color="var(--color-amber)" />
              <span style={{ color: 'var(--text-secondary)' }}>
                Backers of this campaign will instantly receive **5 {rewardToken.toUpperCase()}** assets per **1 XLM** supported.
              </span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-secondary" 
              style={{ flex: 1, justifyContent: 'center' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="btn-primary" 
              style={{ flex: 1, justifyContent: 'center' }}
            >
              {submitting ? (
                <>
                  <RefreshCw size={16} className="animate-spin-slow" />
                  <span>Issuing Asset...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Publish On-Chain</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
