import React from 'react';
import { Calendar, User, ShieldAlert } from 'lucide-react';

export default function CampaignCard({ campaign, onSelect }) {
  const {
    id,
    title,
    description,
    creator,
    target,
    raised,
    daysLeft,
    category,
    rewardToken,
    bannerGradient
  } = campaign;

  // Calculate raised percentage
  const percentage = Math.min(Math.round((raised / target) * 100), 100);

  // Shorten address
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 4)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <div className="glass-panel campaign-card" onClick={onSelect}>
      {/* Visual top banner */}
      <div 
        className="campaign-banner" 
        style={{ 
          background: bannerGradient || 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        <span className="campaign-category">{category}</span>
        
        {/* Fututistic vector mesh decoration */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.15,
          backgroundImage: 'radial-gradient(var(--border-glass-active) 1px, transparent 1px)',
          backgroundSize: '16px 16px'
        }}></div>
        
        {/* Glow orb */}
        <div style={{
          position: 'absolute',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          filter: 'blur(30px)',
          background: 'rgba(99, 102, 241, 0.4)',
          top: '30%',
          left: '40%'
        }}></div>

        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2rem',
          fontWeight: '900',
          color: 'rgba(255, 255, 255, 0.05)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          userSelect: 'none'
        }}>
          {rewardToken}
        </div>
      </div>

      <div className="campaign-body">
        <h3 className="campaign-title">{title}</h3>
        <p className="campaign-desc">{description}</p>

        {/* Progress Tracker */}
        <div className="campaign-progress-container">
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
          </div>
          <div className="progress-stats">
            <span className="progress-funded">
              {percentage}% funded
            </span>
            <span className="progress-target">
              {parseFloat(raised).toLocaleString()} / {parseFloat(target).toLocaleString()} XLM
            </span>
          </div>
        </div>

        {/* Custom token reward tag */}
        {rewardToken && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.04)',
            border: '1px dashed rgba(245, 158, 11, 0.25)',
            borderRadius: '10px',
            padding: '8px 12px',
            fontSize: '0.75rem',
            color: 'var(--color-amber)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <span style={{ fontWeight: '500' }}>Backed Reward Asset:</span>
            <span style={{ fontFamily: 'monospace', fontWeight: '700', background: 'rgba(245, 158, 11, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
              {rewardToken}
            </span>
          </div>
        )}

        {/* Footer row */}
        <div className="campaign-footer">
          <div className="campaign-creator">
            <div className="creator-avatar"></div>
            <span>{formatAddress(creator)}</span>
          </div>
          <div className="campaign-days">
            <Calendar size={13} />
            <span>{daysLeft} days left</span>
          </div>
        </div>
      </div>
    </div>
  );
}
