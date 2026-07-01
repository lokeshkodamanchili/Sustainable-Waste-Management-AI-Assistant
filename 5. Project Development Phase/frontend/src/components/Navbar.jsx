import React from 'react';
import { Menu, User, Bell } from 'lucide-react';

export default function Navbar({ activeTab, setSidebarOpen, sidebarOpen }) {
  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'scanner': return 'AI Waste Scanner';
      case 'history': return 'Disposal History';
      case 'analytics': return 'Environmental Analytics';
      case 'map': return 'Waste Collection Map';
      case 'settings': return 'App Configuration';
      default: return 'Waste Management Assistant';
    }
  };

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          className="mobile-menu-btn" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={24} />
        </button>
        <div className="header-title">
          <h1>{getTitle()}</h1>
        </div>
      </div>

      <div className="header-actions">
        <button 
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            transition: 'background-color 0.2s'
          }}
          hover-bg="var(--bg-tertiary)"
        >
          <Bell size={20} />
        </button>
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            padding: '0.25rem 0.75rem', 
            borderRadius: '9999px',
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border)',
            fontSize: '0.85rem',
            fontWeight: 500
          }}
        >
          <User size={16} color="var(--primary)" />
          <span>Eco User</span>
        </div>
      </div>
    </header>
  );
}
