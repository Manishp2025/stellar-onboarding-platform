import React from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import { WalletProvider } from './context/WalletContext';

function App() {
  return (
    <WalletProvider>
      <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Dashboard />
        </main>
      </div>
    </WalletProvider>
  );
}

export default App;
