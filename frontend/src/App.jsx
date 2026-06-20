import React, { useState, useEffect } from 'react';
import { WalletProvider, useWallet } from './context/WalletContext';
import { Keypair } from '@stellar/stellar-sdk';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import CampaignCard from './components/CampaignCard';
import CampaignDetailsModal from './components/CampaignDetailsModal';
import CreateCampaign from './components/CreateCampaign';
import { Search, Filter, Sparkles, HelpCircle, ExternalLink, X, Info } from 'lucide-react';

function AppContent() {
  const { toasts, removeToast } = useWallet();
  
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Prepopulate standard high-fidelity campaigns
  useEffect(() => {
    // Generate valid testnet public keys on mount so payments actually execute successfully on-chain!
    const key1 = Keypair.random().publicKey();
    const key2 = Keypair.random().publicKey();
    const key3 = Keypair.random().publicKey();
    const key4 = Keypair.random().publicKey();

    const standardCampaigns = [
      {
        id: '1',
        title: 'EcoSphere Smart Solar Grid',
        description: 'EcoSphere aims to build decentralized community solar grids in rural areas. By funding this project, you help procure high-efficiency photovoltaic panels. Backers receive ESOL tokens, representing kilowatt-hour credits redeemable on our smart grid once live on-chain.',
        creator: key1,
        target: 5000,
        raised: 2150,
        daysLeft: 24,
        category: 'Green Energy',
        rewardToken: 'ESOL',
        bannerGradient: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)'
      },
      {
        id: '2',
        title: 'CyberRunner Cyberpunk MMO',
        description: 'A play-to-earn cyberpunk universe built with stunning 3D aesthetics. Assets are represented on the Stellar Ledger for lighting-fast trading and microtransactions. Funding goes directly towards game engine rendering. Backers earn CYBR reward tokens, which can be spent in-game.',
        creator: key2,
        target: 8000,
        raised: 5200,
        daysLeft: 45,
        category: 'Web3 Innovation',
        rewardToken: 'CYBR',
        bannerGradient: 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)'
      },
      {
        id: '3',
        title: 'Horizon Biotech diagnostic Reader',
        description: 'Development of an open-source, portable diagnostic reader that scans for pathogens in seconds. Funding will help assemble physical prototypes. Backers receive HLTH tokens, which grant voting power on the open-source firmware updates and project design parameters.',
        creator: key3,
        target: 3500,
        raised: 950,
        daysLeft: 18,
        category: 'Tech & Gadgets',
        rewardToken: 'HLTH',
        bannerGradient: 'linear-gradient(135deg, #581c87 0%, #0f172a 100%)'
      },
      {
        id: '4',
        title: 'AquaFlow Smart Filtering Core',
        description: 'AquaFlow delivers zero-electricity mechanical gravity water filters to remote settlements. Funding supports direct manufacturing and logistics. Backers are awarded AQUA tokens, which represent volume-matched water allocations donated to partners.',
        creator: key4,
        target: 2500,
        raised: 1800,
        daysLeft: 12,
        category: 'Community Impact',
        rewardToken: 'AQUA',
        bannerGradient: 'linear-gradient(135deg, #0369a1 0%, #0c4a6e 100%)'
      }
    ];

    setCampaigns(standardCampaigns);
    setFilteredCampaigns(standardCampaigns);
  }, []);

  // Filter campaigns whenever query or tab selection changes
  useEffect(() => {
    let result = campaigns;

    if (activeCategory !== 'All') {
      result = result.filter(c => c.category === activeCategory);
    }

    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.description.toLowerCase().includes(q) ||
        c.rewardToken.toLowerCase().includes(q)
      );
    }

    setFilteredCampaigns(result);
  }, [searchTerm, activeCategory, campaigns]);

  // Handle successful support/funding
  const handleFundSuccess = (campaignId, amountBacked) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === campaignId) {
        return {
          ...c,
          raised: c.raised + amountBacked
        };
      }
      return c;
    }));

    // Update active modal display
    setSelectedCampaign(prev => {
      if (prev && prev.id === campaignId) {
        return {
          ...prev,
          raised: prev.raised + amountBacked
        };
      }
      return prev;
    });
  };

  // Add new campaign
  const handleCreateCampaign = (newCamp) => {
    setCampaigns(prev => [newCamp, ...prev]);
  };

  // Aggregated stats
  const totalFundedXlm = campaigns.reduce((acc, c) => acc + c.raised, 0);
  const categories = ['All', 'Green Energy', 'Web3 Innovation', 'Tech & Gadgets', 'Community Impact'];

  return (
    <div>
      {/* Top Header */}
      <Navbar />

      {/* Stats Dashboard */}
      <Dashboard 
        onCreateCampaignClick={() => setIsCreateOpen(true)}
        campaignsCount={campaigns.length}
        totalFundedXlm={totalFundedXlm}
      />

      {/* Search and Filters */}
      <div className="campaigns-section" style={{ paddingBottom: 0 }}>
        <div className="glass-panel" style={{
          padding: '20px 24px',
          background: 'rgba(255, 255, 255, 0.01)',
          border: '1px solid rgba(255, 255, 255, 0.03)',
          borderRadius: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap',
          marginBottom: '24px'
        }}>
          {/* Search bar */}
          <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input" 
              placeholder="Search campaigns, reward symbols..." 
              style={{ paddingLeft: '44px', background: 'rgba(5, 7, 15, 0.6)' }}
            />
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setActiveCategory(cat)}
                className={`tab-btn ${activeCategory === cat ? 'active' : ''}`}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  whiteSpace: 'nowrap',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Campaign List */}
      <main className="campaigns-section" style={{ paddingTop: 0, paddingBottom: '80px' }}>
        <div className="section-header">
          <h2 className="section-title">
            <Sparkles size={20} color="var(--color-indigo)" />
            <span>Discover Opportunities</span>
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing {filteredCampaigns.length} campaigns
          </span>
        </div>

        {filteredCampaigns.length > 0 ? (
          <div className="campaigns-grid">
            {filteredCampaigns.map((camp) => (
              <CampaignCard 
                key={camp.id} 
                campaign={camp} 
                onSelect={() => setSelectedCampaign(camp)}
              />
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{
            padding: '60px 20px',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.01)',
            border: '1px solid rgba(255, 255, 255, 0.03)'
          }}>
            <HelpCircle size={44} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No Campaigns Found</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              We couldn't find any campaigns matching your active filter keywords.
            </p>
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer style={{
        textAlign: 'center',
        padding: '30px 20px 40px',
        borderTop: '1px solid rgba(255, 255, 255, 0.03)',
        background: 'rgba(3, 4, 8, 0.6)',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}>
        <p style={{ marginBottom: '6px' }}>StellarSpark © 2026. Built with extreme visual fidelity on Stellar Horizon Testnet.</p>
        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <span>Frictionless Web3 Smart Tokenization Platform</span>
          <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--text-muted)' }}></span>
          <a href="https://developers.stellar.org/" target="_blank" rel="noreferrer" style={{ color: 'var(--color-cyan)', textDecoration: 'none', fontWeight: '600' }}>
            Powered by Stellar
          </a>
        </p>
      </footer>

      {/* Modals & Popups */}
      {selectedCampaign && (
        <CampaignDetailsModal 
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
          onFundSuccess={handleFundSuccess}
        />
      )}

      {isCreateOpen && (
        <CreateCampaign 
          onClose={() => setIsCreateOpen(false)}
          onCreateSuccess={handleCreateCampaign}
        />
      )}

      {/* Toast Alert Queues */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className={`toast ${
              toast.type === 'success' 
                ? 'toast-success' 
                : toast.type === 'error' 
                ? 'toast-error' 
                : 'toast-info'
            }`}
          >
            <div className="toast-content">
              <h4 className="toast-title">{toast.title}</h4>
              <p className="toast-desc">{toast.desc}</p>
              
              {toast.hash && !toast.hash.startsWith('sim') && (
                <a 
                  href={`https://stellar.expert/explorer/testnet/tx/${toast.hash}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="toast-link"
                >
                  <span>Verify on Stellar.Expert</span>
                  <ExternalLink size={10} />
                </a>
              )}
            </div>
            <button 
              onClick={() => removeToast(toast.id)} 
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', alignSelf: 'flex-start' }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
}
