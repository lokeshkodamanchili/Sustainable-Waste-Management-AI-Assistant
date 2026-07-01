import React, { useState } from 'react';
import { 
  Camera, 
  Search, 
  FileText, 
  RotateCcw, 
  ShieldAlert, 
  ThumbsUp, 
  ThumbsDown, 
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { classifyWasteItem } from '../services/api';

const PRESETS = [
  { name: 'Plastic Bottle', icon: '🥤' },
  { name: 'Banana Peel', icon: '🍌' },
  { name: 'AA Battery', icon: '🔋' },
  { name: 'Laptop', icon: '💻' },
  { name: 'Syringe', icon: '💉' },
  { name: 'Glass Jar', icon: '🫙' }
];

export default function Scanner({ addToast, refreshStats }) {
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleClassify = async (itemName) => {
    if (!itemName || !itemName.trim()) {
      addToast('Please enter a waste item name', 'error');
      return;
    }
    setLoading(true);
    setResult(null);

    // Simulate scanning animation duration (2 seconds)
    setTimeout(async () => {
      try {
        const data = await classifyWasteItem(itemName);
        setResult(data);
        addToast(`Successfully identified: ${data.wasteType}`, 'success');
        refreshStats();
      } catch (err) {
        addToast(err.message || 'Failed to classify item', 'error');
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      // Simulate file classification by using its name or a default
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      addToast(`Image uploaded: ${file.name}`, 'info');
      handleClassify(baseName);
    }
  };

  const getHazardIcon = (level) => {
    switch (level) {
      case 'Critical':
      case 'High':
        return <ShieldAlert size={18} color="#ef4444" />;
      case 'Medium':
        return <ShieldAlert size={18} color="#f59e0b" />;
      default:
        return <CheckCircle2 size={18} color="#10b981" />;
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Plastic': return '#3b82f6'; // Blue
      case 'Paper': return '#f97316';   // Orange
      case 'Glass': return '#a855f7';   // Purple
      case 'Metal': return '#64748b';   // Slate
      case 'Organic': return '#10b981'; // Emerald
      case 'Hazardous': return '#ef4444'; // Red
      case 'E-waste': return '#eab308'; // Yellow
      case 'Medical waste': return '#b91c1c'; // Crimson
      default: return '#10b981';
    }
  };

  return (
    <div className="scanner-container">
      {/* Scanner Control Panel */}
      <div>
        <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Identify Waste</h2>
          
          {/* Drag & Drop Upload Block */}
          <div 
            className={`scan-box ${dragActive ? 'active' : ''}`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload').click()}
          >
            <input 
              type="file" 
              id="file-upload" 
              style={{ display: 'none' }} 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const baseName = e.target.files[0].name.split('.')[0];
                  handleClassify(baseName);
                }
              }}
              accept="image/*"
            />
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <div className="pulse-circle">
                  <Camera size={36} color="var(--primary)" />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Analyzing Waste Item...</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Generative AI is classifying materials</p>
                <div className="scanner-progress-bar">
                  <div className="scanner-progress-fill"></div>
                </div>
              </div>
            ) : (
              <>
                <Camera size={48} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Upload Waste Image</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  Drag & drop your file here, or click to browse
                </p>
              </>
            )}
          </div>

          <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center' }}>
            <span style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }}></span>
            <span style={{ padding: '0 1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>OR SEARCH BY NAME</span>
            <span style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }}></span>
          </div>

          {/* Text Input */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              className="scan-input" 
              style={{ margin: 0, flex: 1 }}
              placeholder="e.g. Cardboard pizza box, aerosol paint..." 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleClassify(inputVal)}
              disabled={loading}
            />
            <button 
              className="btn btn-primary" 
              onClick={() => handleClassify(inputVal)}
              disabled={loading || !inputVal.trim()}
              style={{ padding: '0.75rem 1.25rem' }}
            >
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* Presets Grid */}
        <div className="glass-card">
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Quick Demo Presets
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {PRESETS.map((p) => (
              <button
                key={p.name}
                className="btn btn-secondary"
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.25rem', 
                  padding: '0.75rem 0.5rem', 
                  fontSize: '0.8rem',
                  fontWeight: 500
                }}
                onClick={() => {
                  setInputVal(p.name);
                  handleClassify(p.name);
                }}
                disabled={loading}
              >
                <span style={{ fontSize: '1.5rem' }}>{p.icon}</span>
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scanner Output Results Panel */}
      <div>
        {result ? (
          <div className="glass-card" style={{ animation: 'toastSlideIn 0.4s ease-out' }}>
            <div className="result-header">
              <div>
                <span 
                  className="badge" 
                  style={{ 
                    backgroundColor: `${getCategoryColor(result.category)}20`, 
                    color: getCategoryColor(result.category),
                    border: `1px solid ${getCategoryColor(result.category)}35`,
                    marginBottom: '0.5rem'
                  }}
                >
                  {result.category}
                </span>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{result.wasteType}</h2>
              </div>
              
              <span className={`badge ${result.recyclable ? 'badge-recyclable' : 'badge-landfill'}`}>
                {result.recyclable ? 'Recyclable' : 'Non-Recyclable'}
              </span>
            </div>

            {/* Hazard Warning Block */}
            <div className={`hazard-warning ${result.hazardLevel}`}>
              <div className="hazard-warning-title" style={{ color: result.hazardLevel === 'Low' ? 'var(--primary)' : result.hazardLevel === 'Medium' ? '#f59e0b' : '#ef4444' }}>
                {getHazardIcon(result.hazardLevel)}
                <span>Hazard Level: {result.hazardLevel}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                {result.hazardLevel === 'Low' && "This item poses no chemical or bodily danger when sorted correctly."}
                {result.hazardLevel === 'Medium' && "Take caution. Contains internal components or chemicals requiring special handling."}
                {result.hazardLevel === 'High' && "Potentially dangerous. Avoid open contact, and do not dispose with standard refuse."}
                {result.hazardLevel === 'Critical' && "Highly toxic or biohazardous. Must be kept separate and taken to hazardous waste systems."}
              </p>
            </div>

            {/* Disposal Steps */}
            <div className="result-section">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Trash2 size={16} />
                <span>Disposal Protocol</span>
              </h3>
              <ol className="result-list">
                {result.disposalSteps.map((step, idx) => (
                  <li key={idx} className="result-list-item" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Recycling Instructions */}
            {result.recyclingInstructions && result.recyclingInstructions.length > 0 && (
              <div className="result-section">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={16} />
                  <span>Recycling Guidelines</span>
                </h3>
                <ul className="result-list">
                  {result.recyclingInstructions.map((ins, idx) => (
                    <li key={idx} className="result-list-item" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {ins}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Eco Suggestions */}
            {result.ecoSuggestions && result.ecoSuggestions.length > 0 && (
              <div className="result-section" style={{ marginBottom: 0 }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#eab308' }}>
                  <Lightbulb size={16} />
                  <span>Eco-friendly Alternatives</span>
                </h3>
                <ul className="result-list">
                  {result.ecoSuggestions.map((sug, idx) => (
                    <li key={idx} className="result-list-item" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {sug}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button 
              className="btn btn-secondary" 
              style={{ width: '100%', marginTop: '2rem' }}
              onClick={() => {
                setResult(null);
                setInputVal('');
              }}
            >
              <RotateCcw size={16} />
              <span>Reset Scanner</span>
            </button>
          </div>
        ) : (
          <div 
            className="glass-card" 
            style={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '4rem 2rem',
              textAlign: 'center',
              minHeight: '380px'
            }}
          >
            <HelpCircle size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Scan Result</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '320px' }}>
              Upload an image or enter a product name above to classify the material properties.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
