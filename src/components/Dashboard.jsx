import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { Rocket, Sparkles, TrendingUp, Users, ArrowRight, Wallet, History, Gift, Globe, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const { wallet, account, balances, fundWallet, fetchHistory, createTrustline } = useWallet();
  const [funding, setFunding] = useState(false);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [trustlineLoading, setTrustlineLoading] = useState(false);

  const handleFund = async () => {
    if (!wallet) return;
    setFunding(true);
    await fundWallet(wallet.publicKey);
    setFunding(false);
  };

  const handleFetchHistory = async () => {
    if (!wallet) return;
    setLoadingHistory(true);
    const records = await fetchHistory(wallet.publicKey);
    setHistory(records || []);
    setLoadingHistory(false);
  };

  const handleAddTrustline = async () => {
    if (!wallet) return;
    setTrustlineLoading(true);
    // Hardcoded example token for demo purposes
    await createTrustline('SPARK', 'GB3J5X2C3A2O2U6QY7Y765P6F7A6N3V5A5J2P7Q6X3P2D6F7Q7T6S7T7');
    setTrustlineLoading(false);
  };

  const MOCK_CAMPAIGNS = [
    {
      id: 1,
      title: "Neon City Metaverse",
      creator: "GBK...4F9E",
      description: "A cyberpunk virtual reality world built on the Stellar network. Support us to get exclusive land NFTs and early access SPARK tokens.",
      raised: 45000,
      goal: 100000,
      daysLeft: 12,
      image: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 2,
      title: "Stellar Carbon Credits",
      creator: "GDX...1A2B",
      description: "Tokenizing real-world carbon offset credits on the Stellar blockchain for instant, low-fee environmental impact.",
      raised: 12500,
      goal: 20000,
      daysLeft: 5,
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 3,
      title: "DeFi Micro-lending",
      creator: "GCL...9Z8Y",
      description: "Peer-to-peer micro-lending protocol utilizing USDC on Stellar for unbanked populations worldwide.",
      raised: 89000,
      goal: 100000,
      daysLeft: 2,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
      {/* Hero Section */}
      <div className="hero-section glass-panel">
        <div className="hero-content">
          <h1 className="hero-title">
            Fuel the Future of <span className="gradient-text">Web3</span>
          </h1>
          <p className="hero-subtitle">
            StellarSpark is the premier crowdfunding platform built on the Stellar network. Back innovative projects with low fees and instant settlement.
          </p>
          <div className="flex" style={{ gap: '1rem', marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={() => window.scrollTo({ top: 600, behavior: 'smooth'})}>
              <Rocket size={18} /> Explore Campaigns
            </button>
            <button className="btn btn-outline" onClick={() => window.open('https://forms.gle/YOUR_GOOGLE_FORM_LINK', '_blank')}>
              Submit Feedback
            </button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><Globe size={24} /></div>
            <div className="stat-value">1.2M+</div>
            <div className="stat-label">XLM Raised</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Users size={24} /></div>
            <div className="stat-value">5,000+</div>
            <div className="stat-label">Active Backers</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Rocket size={24} /></div>
            <div className="stat-value">42</div>
            <div className="stat-label">Funded Projects</div>
          </div>
        </div>
      </div>

      {/* Wallet Dashboard Section (if connected) */}
      {wallet && (
        <div className="wallet-dashboard">
          <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className="flex" style={{ alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', fontWeight: '600' }}>
              <Wallet className="gradient-text" /> Your Wallet
            </h2>
            <div className="flex" style={{ gap: '1rem' }}>
              <button className="btn btn-outline" onClick={handleAddTrustline} disabled={trustlineLoading}>
                {trustlineLoading ? 'Adding...' : 'Add SPARK Trustline'}
              </button>
              <button className="btn btn-primary" onClick={handleFund} disabled={funding}>
                {funding ? <span className="loading-spinner"></span> : <Gift size={18} />}
                {funding ? 'Funding...' : 'Get Testnet XLM'}
              </button>
            </div>
          </div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {/* Balances */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Asset Balances</h3>
              {balances && balances.length > 0 ? (
                <div className="flex" style={{ flexDirection: 'column', gap: '1rem' }}>
                  {balances.map((b, i) => (
                    <div key={i} className="flex" style={{ justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div className="flex" style={{ alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {b.asset_type === 'native' ? 'XLM' : b.asset_code.substring(0, 3)}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{b.asset_type === 'native' ? 'Stellar Lumens' : b.asset_code}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{b.asset_type === 'native' ? 'Native' : 'Custom Token'}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
                        {parseFloat(b.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                  Loading balances...
                </div>
              )}
            </div>

            {/* Quick Actions & Info */}
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
               <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Recent Activity</h3>
                  <button className="btn btn-outline" onClick={handleFetchHistory} disabled={loadingHistory} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    <History size={14} /> {loadingHistory ? 'Loading...' : 'Refresh'}
                  </button>
               </div>
               
               <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '1rem', overflowY: 'auto', maxHeight: '200px' }}>
                  {history && history.length > 0 ? (
                    <div className="flex" style={{ flexDirection: 'column', gap: '0.75rem' }}>
                      {history.slice(0, 5).map((tx, i) => (
                        <div key={i} className="flex" style={{ justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <div className="flex" style={{ flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{tx.type === 'create_account' ? 'Account Created' : 'Payment'}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(tx.created_at).toLocaleDateString()}</span>
                          </div>
                          <a href={`https://stellar.expert/explorer/testnet/tx/${tx.transaction_hash}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            View <ArrowRight size={12} />
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', gap: '0.5rem' }}>
                      <History size={24} style={{ opacity: 0.5 }} />
                      <p style={{ fontSize: '0.9rem' }}>No recent activity found or click refresh.</p>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Campaigns Section */}
      <div style={{ marginTop: '4rem' }}>
        <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Trending <span className="gradient-text">Campaigns</span></h2>
            <p style={{ color: 'var(--text-secondary)' }}>Discover and back cutting-edge projects on Stellar.</p>
          </div>
          <button className="btn btn-outline" style={{ border: 'none' }}>View All <ArrowRight size={16} /></button>
        </div>

        <div className="grid">
          {MOCK_CAMPAIGNS.map((campaign) => (
            <div key={campaign.id} className="campaign-card glass-panel p-0">
              <div className="campaign-image" style={{ backgroundImage: `url(${campaign.image})` }}>
                <div className="campaign-badge">{campaign.daysLeft} Days Left</div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600', marginBottom: '0.5rem' }}>By {campaign.creator}</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem', lineHeight: '1.3' }}>{campaign.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {campaign.description}
                </p>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <div className="flex" style={{ justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Raised</span>
                    <span style={{ fontWeight: '600' }}>{(campaign.raised / campaign.goal * 100).toFixed(0)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(campaign.raised / campaign.goal * 100)}%` }}></div>
                  </div>
                  <div className="flex" style={{ justifyContent: 'space-between', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: '500' }}>
                    <span>{campaign.raised.toLocaleString()} XLM</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{campaign.goal.toLocaleString()} XLM</span>
                  </div>
                </div>

                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Back this Project
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
