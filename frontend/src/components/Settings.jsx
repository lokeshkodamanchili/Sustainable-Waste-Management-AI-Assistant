import React, { useState } from 'react';
import { Settings, Database, Cpu, RefreshCw, Trash2, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { resetDatabase, addHistoryRecord } from '../services/api';

const SAMPLE_DATASET = [
  {
    wasteType: "Plastic Soda Bottle",
    category: "Plastic",
    hazardLevel: "Low",
    recyclable: true,
    disposalSteps: ["Empty remaining liquid", "Rinse", "Flatten to save space", "Place in plastic recycling bin"],
    recyclingInstructions: ["Single-stream curbside accepted", "Keep cap attached"],
    ecoSuggestions: ["Purchase a reusable vacuum insulated flask"]
  },
  {
    wasteType: "Organic Banana Peel",
    category: "Organic",
    hazardLevel: "Low",
    recyclable: false,
    disposalSteps: ["Remove sticker labels", "Toss in green compost collection bin"],
    recyclingInstructions: ["Not recyclable", "Breaks down aerobically to organic compost fertilizer"],
    ecoSuggestions: ["Incorporate into home composting systems or garden soil enrichment"]
  },
  {
    wasteType: "Rechargeable Laptop Battery",
    category: "Hazardous",
    hazardLevel: "High",
    recyclable: false,
    disposalSteps: ["Cover terminals with electrical tape", "Place in small plastic zipper bag", "Drop off at specialized battery recycling point"],
    recyclingInstructions: ["Valuable metals extracted safely", "Prevents heavy metals from poisoning ground soil"],
    ecoSuggestions: ["Switch to devices with modular, replaceable battery structures"]
  },
  {
    wasteType: "Corrugated Cardboard Box",
    category: "Paper",
    hazardLevel: "Low",
    recyclable: true,
    disposalSteps: ["Remove plastic sealing tape", "Flatten cardboard flat", "Place in blue paper bin"],
    recyclingInstructions: ["Fibers re-pulped into raw cardboard", "Do not recycle if soiled by grease/food"],
    ecoSuggestions: ["Reuse shipping boxes for home storage or mailing packages"]
  },
  {
    wasteType: "Cracked Wine Glass",
    category: "Glass",
    hazardLevel: "Low",
    recyclable: true,
    disposalSteps: ["Wrap sharp edges in newspaper", "Place carefully in glass recycling bin"],
    recyclingInstructions: ["Crushed into cullet and melted to form new bottles"],
    ecoSuggestions: ["Reuse jars and bottles for storage instead of buying single-use glass packaging"]
  },
  {
    wasteType: "Defunct LCD Display Monitor",
    category: "E-waste",
    hazardLevel: "Medium",
    recyclable: true,
    disposalSteps: ["Wipe clean of private data storage elements", "Transport to authorized electronics recovery hub"],
    recyclingInstructions: ["Reclaims valuable copper and trace gold", "Saves raw metal mining energy"],
    ecoSuggestions: ["Consider refurbishing or donating working electronics to charity"]
  }
];

export default function SettingsPage({ addToast, refreshStats, backendStatus, refreshStatus }) {
  const [clearing, setClearing] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const handleReset = async () => {
    if (!window.confirm("WARNING: This will permanently delete all scanned waste records and reset the dashboard. Proceed?")) {
      return;
    }
    setClearing(true);
    try {
      await resetDatabase();
      addToast("Database reset successfully", "success");
      refreshStats();
    } catch (err) {
      addToast(err.message || "Failed to clear database", "error");
    } finally {
      setClearing(false);
    }
  };

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      let count = 0;
      for (const item of SAMPLE_DATASET) {
        await addHistoryRecord(item);
        count++;
      }
      addToast(`Seeded ${count} sample items successfully!`, "success");
      refreshStats();
    } catch (err) {
      addToast(err.message || "Failed to seed sample dataset", "error");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
      {/* Configuration Status Card */}
      <div className="glass-card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Settings size={20} color="var(--primary)" />
          <span>System Information</span>
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {/* AI Connection Info */}
          <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '0.75rem', backgroundColor: 'rgba(31,41,55,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Cpu size={18} color="#eab308" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Generative AI Engine</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              <strong>Provider:</strong> Groq API Cloud
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              <strong>Model:</strong> llama-3.3-70b-versatile
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <strong>Status:</strong> {backendStatus?.mode?.ai === 'Groq Llama-3.3' ? (
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Active (API Connected)</span>
              ) : (
                <span style={{ color: '#ef4444', fontWeight: 600 }}>Fallback Simulation Mode (No Key Set)</span>
              )}
            </p>
          </div>

          {/* DB Connection Info */}
          <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '0.75rem', backgroundColor: 'rgba(31,41,55,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Database size={18} color="#6366f1" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Database Storage</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              <strong>Provider:</strong> Google Firebase
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              <strong>Collection:</strong> Firestore ('scans')
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <strong>Engine:</strong> {backendStatus?.mode?.database === 'Firebase Firestore' ? (
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Active Firestore</span>
              ) : (
                <span style={{ color: '#eab308', fontWeight: 600 }}>Local JSON File (`local_db.json`)</span>
              )}
            </p>
          </div>
        </div>

        <button 
          className="btn btn-secondary" 
          onClick={refreshStatus} 
          style={{ marginTop: '1.5rem', fontSize: '0.85rem', display: 'inline-flex', gap: '0.5rem' }}
        >
          <RefreshCw size={14} />
          <span>Ping Connection</span>
        </button>
      </div>

      {/* Demo Maintenance Operations */}
      <div className="glass-card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#ef4444' }}>
          Database Operations
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Manage records stored in the active database engine. Convenient for testing various states of the application.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Seed button */}
          <button 
            className="btn btn-primary" 
            onClick={handleSeedData} 
            disabled={seeding || clearing}
            style={{ backgroundColor: '#6366f1', color: '#fff' }}
          >
            {seeding ? (
              <RefreshCw size={16} style={{ animation: 'spin 1s infinite linear' }} />
            ) : (
              <CheckCircle2 size={16} />
            )}
            <span>Seed Sample Dataset</span>
          </button>

          {/* Reset button */}
          <button 
            className="btn btn-secondary" 
            onClick={handleReset} 
            disabled={seeding || clearing}
            style={{ border: '1px solid #ef4444', color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
          >
            {clearing ? (
              <RefreshCw size={16} style={{ animation: 'spin 1s infinite linear' }} />
            ) : (
              <Trash2 size={16} />
            )}
            <span>Reset Database (Delete All Scans)</span>
          </button>
        </div>
      </div>

      {/* Integration Guide */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Environment Configuration Guide</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
          To transition the application from simulation fallback to fully connected cloud services, create a file named `.env` in the <code>backend/</code> folder with the following variables:
        </p>
        <pre style={{ 
          backgroundColor: 'var(--bg-secondary)', 
          padding: '1rem', 
          borderRadius: '0.5rem', 
          border: '1px solid var(--border)',
          fontSize: '0.8rem',
          fontFamily: 'monospace',
          color: 'var(--text-primary)',
          overflowX: 'auto'
        }}>
{`# Setup cloud providers
GROQ_API_KEY=gsk_your_groq_api_token_here
USE_FIREBASE=true
FIREBASE_SERVICE_ACCOUNT_KEY=C:/path/to/serviceAccountKey.json`}
        </pre>
      </div>
    </div>
  );
}
