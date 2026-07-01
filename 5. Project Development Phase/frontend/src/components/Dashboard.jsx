import React from 'react';
import { 
  ClipboardList, 
  CheckCircle, 
  AlertTriangle, 
  Percent, 
  ArrowRight, 
  Lightbulb,
  Sparkles,
  Camera
} from 'lucide-react';

const ECO_TIPS = [
  "Rinse plastic containers before recycling to avoid contaminating the batch.",
  "Composting organic scraps reduces methane emissions from landfills.",
  "E-waste contains hazardous metals. Never discard old electronics in standard trash.",
  "Only #1 (PETE) and #2 (HDPE) plastics are universally recyclable. Check the label!",
  "Wet or food-soiled paper and cardboard cannot be recycled; compost them instead.",
  "Cardboard boxes should always be flattened to maximize shipping efficiency in trucks."
];

export default function Dashboard({ stats, setActiveTab }) {
  // Select a tip of the day based on the current date
  const tipOfTheDay = ECO_TIPS[new Date().getDate() % ECO_TIPS.length];

  return (
    <div>
      {/* Welcome Banner */}
      <div 
        className="glass-card" 
        style={{ 
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.05))',
          borderColor: 'rgba(16, 185, 129, 0.25)',
          marginBottom: '2rem',
          padding: '2rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
          <Sparkles size={20} />
          <span style={{ fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>AI Powered Eco-Assistant</span>
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.2 }}>
          Let's make recycling simple.
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', marginBottom: '1.5rem' }}>
          Identify household waste items instantly using generative AI, locate verified local disposal sites, and keep track of your family's waste footprint.
        </p>
        <button className="btn btn-primary" onClick={() => setActiveTab('scanner')}>
          <Camera size={18} />
          <span>Scan New Item</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ color: '#3b82f6' }}>
            <ClipboardList size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalScans}</div>
            <div className="stat-label">Total Scans</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ color: 'var(--primary)' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.recyclableItems}</div>
            <div className="stat-label">Recyclable Items</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ color: '#ef4444' }}>
            <AlertTriangle size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.hazardousItems}</div>
            <div className="stat-label">Hazardous Items</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ color: '#eab308' }}>
            <Percent size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.recyclingPercentage}%</div>
            <div className="stat-label">Recycling Rate</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginTop: '2rem' }} className="charts-grid">
        {/* Tip Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#eab308' }}>
            <Lightbulb size={24} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Eco-Tip of the Day</h3>
          </div>
          <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            "{tipOfTheDay}"
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary" onClick={() => setActiveTab('analytics')} style={{ fontSize: '0.85rem' }}>
              <span>View Analytics</span>
              <ArrowRight size={14} />
            </button>
            <button className="btn btn-secondary" onClick={() => setActiveTab('map')} style={{ fontSize: '0.85rem' }}>
              <span>Locate Dropoffs</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Quick Instructions Card */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>How it Works</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>1.</span>
              <span style={{ color: 'var(--text-secondary)' }}>Type in any waste item name or simulate a scanner scan.</span>
            </li>
            <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>2.</span>
              <span style={{ color: 'var(--text-secondary)' }}>Our Llama 3.3 model analyzes recyclability and safety.</span>
            </li>
            <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>3.</span>
              <span style={{ color: 'var(--text-secondary)' }}>Receive direct step-by-step disposal procedures.</span>
            </li>
            <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>4.</span>
              <span style={{ color: 'var(--text-secondary)' }}>View recycling centers nearby and see your stats improve!</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
