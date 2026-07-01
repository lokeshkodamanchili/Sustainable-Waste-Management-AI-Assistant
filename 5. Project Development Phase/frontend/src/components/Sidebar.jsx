import React from 'react';
import { 
  LayoutDashboard, 
  ScanLine, 
  History, 
  BarChart3, 
  Map, 
  Settings, 
  Leaf, 
  Wifi, 
  WifiOff 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, backendStatus, sidebarOpen, setSidebarOpen }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scanner', label: 'Waste Scanner', icon: ScanLine },
    { id: 'history', label: 'Scan History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'map', label: 'Collection Map', icon: Map },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <aside className={`sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-logo">
        <Leaf size={28} />
        <span className="sidebar-logo-text">EcoSense</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false); // Close sidebar on mobile
              }}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        {backendStatus?.status === 'healthy' ? (
          <div className="connection-pill">
            <Wifi size={14} />
            <span>Server Connected ({backendStatus.mode.database === 'Firebase Firestore' ? 'Firestore' : 'Local DB'})</span>
          </div>
        ) : (
          <div className="connection-pill disconnected">
            <WifiOff size={14} />
            <span>Server Offline</span>
          </div>
        )}
      </div>
    </aside>
  );
}
