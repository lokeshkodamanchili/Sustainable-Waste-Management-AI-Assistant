import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Scanner from './components/Scanner';
import History from './components/History';
import Analytics from './components/Analytics';
import Map from './components/Map';
import SettingsPage from './components/Settings';
import Toast from './components/Toast';
import { fetchHealth, fetchStatistics } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  
  // Connection states
  const [backendStatus, setBackendStatus] = useState(null);
  const [stats, setStats] = useState({
    totalScans: 0,
    recyclableItems: 0,
    hazardousItems: 0,
    recyclingPercentage: 0
  });

  // Global Toast function
  const addToast = (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Ping backend status
  const pingBackend = async () => {
    try {
      const health = await fetchHealth();
      setBackendStatus(health);
    } catch (e) {
      setBackendStatus({ status: 'offline', mode: { ai: 'Offline', database: 'Offline' } });
    }
  };

  // Reload statistics from backend
  const loadStats = async () => {
    try {
      const data = await fetchStatistics();
      setStats({
        totalScans: data.totalScans,
        recyclableItems: data.recyclableItems,
        hazardousItems: data.hazardousItems,
        recyclingPercentage: data.recyclingPercentage
      });
    } catch (e) {
      // Keep defaults on failure
    }
  };

  useEffect(() => {
    pingBackend();
    loadStats();
  }, []);

  // Render view conditionally based on activeTab
  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard stats={stats} setActiveTab={setActiveTab} />;
      case 'scanner':
        return <Scanner addToast={addToast} refreshStats={loadStats} />;
      case 'history':
        return <History addToast={addToast} refreshStats={loadStats} />;
      case 'analytics':
        return <Analytics addToast={addToast} />;
      case 'map':
        return <Map addToast={addToast} />;
      case 'settings':
        return (
          <SettingsPage 
            addToast={addToast} 
            refreshStats={loadStats} 
            backendStatus={backendStatus} 
            refreshStatus={pingBackend} 
          />
        );
      default:
        return <Dashboard stats={stats} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        backendStatus={backendStatus}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="main-content">
        <Navbar 
          activeTab={activeTab} 
          setSidebarOpen={setSidebarOpen} 
          sidebarOpen={sidebarOpen}
        />
        
        <main className="content-body">
          {renderView()}
        </main>
      </div>

      {/* Global Toasts Container */}
      <div className="toast-container">
        {toasts.map((t) => (
          <Toast 
            key={t.id} 
            message={t.message} 
            type={t.type} 
            onClose={() => removeToast(t.id)} 
          />
        ))}
      </div>
    </div>
  );
}
