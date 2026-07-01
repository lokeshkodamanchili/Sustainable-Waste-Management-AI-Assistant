import React, { useState, useEffect } from 'react';
import { Trash2, Calendar, Search, Filter, AlertCircle, RefreshCw } from 'lucide-react';
import { fetchHistory, deleteHistoryRecord } from '../services/api';

const CATEGORIES = ['All', 'Plastic', 'Paper', 'Glass', 'Organic', 'Metal', 'Hazardous', 'E-waste', 'Medical waste'];

export default function History({ addToast, refreshStats }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await fetchHistory();
      setHistory(data);
    } catch (err) {
      addToast(err.message || 'Failed to fetch history', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name} from your scan history?`)) {
      return;
    }
    try {
      await deleteHistoryRecord(id);
      setHistory(history.filter(item => item.id !== id));
      addToast(`Deleted ${name} from history`, 'success');
      refreshStats();
    } catch (err) {
      addToast(err.message || 'Failed to delete record', 'error');
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Plastic': return '#3b82f6';
      case 'Paper': return '#f97316';
      case 'Glass': return '#a855f7';
      case 'Metal': return '#64748b';
      case 'Organic': return '#10b981';
      case 'Hazardous': return '#ef4444';
      case 'E-waste': return '#eab308';
      case 'Medical waste': return '#b91c1c';
      default: return '#10b981';
    }
  };

  const formatDate = (isoStr) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoStr;
    }
  };

  // Filter history based on search & tab selectors
  const filteredHistory = history.filter(item => {
    const matchesSearch = item.wasteType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Filters Card */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="scan-input" 
                style={{ margin: 0, paddingLeft: '2.5rem' }} 
                placeholder="Search history by item name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Refresh button */}
            <button className="btn btn-secondary" onClick={loadHistory} disabled={loading} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <RefreshCw size={16} className={loading ? 'spin-anim' : ''} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Category Tabs */}
          <div>
            <div className="filter-tabs">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`filter-tab ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* History Grid */}
      {loading ? (
        <div className="empty-state">
          <RefreshCw size={36} className="spin-anim" />
          <p style={{ marginTop: '1rem' }}>Retrieving history log...</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="glass-card">
          <div className="empty-state">
            <AlertCircle size={48} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '1rem', marginBottom: '0.5rem' }}>No Records Found</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '320px' }}>
              {history.length === 0 
                ? "You haven't scanned any items yet. Run your first classification on the Waste Scanner tab!" 
                : "No items match your active search filter criteria."
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="history-list">
          {filteredHistory.map((item) => (
            <div key={item.id} className="glass-card history-card interactive">
              {/* Name & category */}
              <div>
                <div className="history-name">{item.wasteType}</div>
                <span 
                  className="badge" 
                  style={{ 
                    backgroundColor: `${getCategoryColor(item.category)}15`, 
                    color: getCategoryColor(item.category),
                    border: `1px solid ${getCategoryColor(item.category)}25`,
                    marginTop: '0.25rem'
                  }}
                >
                  {item.category}
                </span>
              </div>

              {/* Recyclability */}
              <div>
                <span className={`badge ${item.recyclable ? 'badge-recyclable' : 'badge-landfill'}`}>
                  {item.recyclable ? 'Recyclable' : 'Landfill'}
                </span>
              </div>

              {/* Hazard level */}
              <div>
                <span 
                  style={{ 
                    fontSize: '0.8rem', 
                    fontWeight: 600,
                    color: item.hazardLevel === 'Low' ? 'var(--primary)' : item.hazardLevel === 'Medium' ? '#f59e0b' : '#ef4444' 
                  }}
                >
                  {item.hazardLevel} Hazard
                </span>
              </div>

              {/* Date */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <Calendar size={14} />
                <span>{formatDate(item.timestamp)}</span>
              </div>

              {/* Action */}
              <div style={{ textAlign: 'right' }}>
                <button 
                  className="delete-btn" 
                  onClick={() => handleDelete(item.id, item.wasteType)}
                  aria-label={`Delete ${item.wasteType}`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Simple Inline Animation style */}
      <style>{`
        .spin-anim {
          animation: spin 1s infinite linear;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
