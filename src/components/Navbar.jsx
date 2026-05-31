import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { Sparkles, Activity, Shield, LogOut, Wallet, User, Globe, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { 
    walletType, 
    publicKey, 
    xlmBalance, 
    disconnectWallet, 
    connectEmbeddedWallet, 
    connectFreighterWallet, 
    networkStatus 
  } = useWallet();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Shorten public key
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 5)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <nav className="navbar-container">
      <div className="logo-section">
        <div style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
          padding: '8px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
        }}>
          <Sparkles size={20} color="white" />
        </div>
        <div>
          <h1 className="logo-text">StellarSpark</h1>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginTop: '-3px' }}>
            Decentralized Impact
          </span>
        </div>
      </div>

      <div className="nav-stats">
        <div className="stat-item">
          <div className={`status-dot ${networkStatus === 'offline' ? 'status-offline' : ''}`} style={{
            backgroundColor: networkStatus === 'offline' ? 'var(--color-rose)' : 'var(--color-emerald)',
            boxShadow: networkStatus === 'offline' ? '0 0 10px var(--color-rose)' : '0 0 10px var(--color-emerald)'
          }}></div>
          <span>Horizon Testnet</span>
        </div>
        <div className="stat-item">
          <Activity size={13} color="var(--color-cyan)" />
          <span>Ping: 142ms</span>
        </div>
        <div className="stat-item">
          <Globe size={13} color="var(--color-amber)" />
          <span>Ledger: 62,810,412</span>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        {publicKey ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div 
              className="glass-panel"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '6px 14px',
                borderRadius: '14px',
                cursor: 'pointer',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(255, 255, 255, 0.02)'
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: walletType === 'embedded' 
                  ? 'linear-gradient(135deg, var(--color-indigo) 0%, var(--color-purple) 100%)'
                  : 'linear-gradient(135deg, var(--color-cyan) 0%, var(--color-emerald) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
              }}>
                {walletType === 'embedded' ? <Shield size={14} color="white" /> : <User size={14} color="white" />}
              </div>
              
              <div style={{ textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'white', lineHeight: '1.2' }}>
                  {formatAddress(publicKey)}
                </span>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-cyan)', fontWeight: '600' }}>
                  {parseFloat(xlmBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} XLM
                </span>
              </div>
              <ChevronDown size={14} color="var(--text-secondary)" />
            </div>

            {dropdownOpen && (
              <div 
                className="glass-panel"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  right: 0,
                  width: '220px',
                  padding: '12px',
                  background: 'rgba(10, 12, 22, 0.95)',
                  border: '1px solid var(--border-glass-active)',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ padding: '4px 8px 8px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block' }}>
                    Connected Via
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'white' }}>
                    {walletType === 'embedded' ? '⚡ Instant Embedded Wallet' : '🦊 Freighter Extension'}
                  </span>
                </div>
                
                <button 
                  onClick={() => {
                    disconnectWallet();
                    setDropdownOpen(false);
                  }}
                  className="btn-secondary"
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    width: '100%',
                    justifyContent: 'center',
                    border: '1px solid rgba(244, 63, 94, 0.2)',
                    color: 'var(--color-rose)',
                    background: 'rgba(244, 63, 94, 0.02)'
                  }}
                >
                  <LogOut size={13} />
                  <span>Disconnect Wallet</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)} 
              className="btn-primary"
            >
              <Wallet size={16} />
              <span>Connect Wallet</span>
              <ChevronDown size={14} />
            </button>

            {dropdownOpen && (
              <div 
                className="glass-panel"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  right: 0,
                  width: '260px',
                  padding: '16px',
                  background: 'rgba(7, 9, 19, 0.98)',
                  border: '1px solid var(--border-glass-active)',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', letterSpacing: '0.05em' }}>
                  Choose Connection
                </span>

                <button 
                  onClick={() => {
                    connectEmbeddedWallet();
                    setDropdownOpen(false);
                  }}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '10px',
                    borderRadius: '10px'
                  }}
                >
                  <Shield size={14} />
                  <span>⚡ Instant Wallet (No Ext)</span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', margin: '4px 0' }}>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.05)' }}></div>
                  <span style={{ padding: '0 8px', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>or</span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.05)' }}></div>
                </div>

                <button 
                  onClick={() => {
                    connectFreighterWallet();
                    setDropdownOpen(false);
                  }}
                  className="btn-secondary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '10px',
                    borderRadius: '10px'
                  }}
                >
                  <Wallet size={14} />
                  <span>🦊 Freighter Wallet</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
