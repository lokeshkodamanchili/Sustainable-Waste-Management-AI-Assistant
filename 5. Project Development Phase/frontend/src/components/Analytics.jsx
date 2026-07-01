import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';
import { BarChart3, PieChart, LineChart, TrendingUp, Info } from 'lucide-react';
import { fetchStatistics } from '../services/api';

export default function Analytics({ addToast }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // References to canvas elements
  const doughnutCanvasRef = useRef(null);
  const lineCanvasRef = useRef(null);
  const barCanvasRef = useRef(null);

  // References to chart instances
  const doughnutChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);

  const loadStats = async () => {
    try {
      const data = await fetchStatistics();
      setStats(data);
    } catch (err) {
      addToast(err.message || 'Failed to fetch statistics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (!stats) return;

    // Helper for common chart styling options
    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#9ca3af',
            font: { family: 'Outfit', size: 12 }
          }
        }
      }
    };

    // 1. Doughnut Chart - Category distribution
    if (doughnutCanvasRef.current) {
      if (doughnutChartRef.current) doughnutChartRef.current.destroy();
      
      const labels = Object.keys(stats.categoryDistribution);
      const data = Object.values(stats.categoryDistribution);
      
      const colors = {
        'Plastic': '#3b82f6',
        'Paper': '#f97316',
        'Glass': '#a855f7',
        'Metal': '#64748b',
        'Organic': '#10b981',
        'Hazardous': '#ef4444',
        'E-waste': '#eab308',
        'Medical waste': '#b91c1c'
      };

      doughnutChartRef.current = new Chart(doughnutCanvasRef.current, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: labels.map(l => colors[l] || '#10b981'),
            borderColor: '#111827',
            borderWidth: 2
          }]
        },
        options: {
          ...commonOptions,
          plugins: {
            ...commonOptions.plugins,
            legend: {
              position: 'right',
              labels: {
                color: '#9ca3af',
                font: { family: 'Outfit' }
              }
            }
          }
        }
      });
    }

    // 2. Line Chart - Daily scan activity
    if (lineCanvasRef.current) {
      if (lineChartRef.current) lineChartRef.current.destroy();

      const dates = stats.dailyScanActivity.map(d => {
        // Format e.g., "Jun 30"
        const p = d.date.split('-');
        if (p.length === 3) {
          const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          return `${months[parseInt(p[1])-1]} ${p[2]}`;
        }
        return d.date;
      });
      const counts = stats.dailyScanActivity.map(d => d.count);

      lineChartRef.current = new Chart(lineCanvasRef.current, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [{
            label: 'Items Scanned',
            data: counts,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.3,
            borderWidth: 3,
            pointBackgroundColor: '#10b981'
          }]
        },
        options: {
          ...commonOptions,
          scales: {
            y: {
              grid: { color: 'rgba(255,255,255,0.06)' },
              ticks: { color: '#9ca3af', stepSize: 1 },
              beginAtZero: true
            },
            x: {
              grid: { display: false },
              ticks: { color: '#9ca3af' }
            }
          }
        }
      });
    }

    // 3. Bar Chart - Recyclable vs Non-recyclable vs Hazardous volume
    if (barCanvasRef.current) {
      if (barChartRef.current) barChartRef.current.destroy();

      const nonRecyclableItems = stats.totalScans - stats.recyclableItems - stats.hazardousItems;

      barChartRef.current = new Chart(barCanvasRef.current, {
        type: 'bar',
        data: {
          labels: ['Recyclable', 'Landfill / Other', 'Hazardous'],
          datasets: [{
            label: 'Volume Share',
            data: [stats.recyclableItems, Math.max(0, nonRecyclableItems), stats.hazardousItems],
            backgroundColor: ['rgba(16, 185, 129, 0.7)', 'rgba(249, 115, 22, 0.7)', 'rgba(239, 68, 68, 0.7)'],
            borderColor: ['#10b981', '#f97316', '#ef4444'],
            borderWidth: 1.5,
            borderRadius: 6
          }]
        },
        options: {
          ...commonOptions,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              grid: { color: 'rgba(255,255,255,0.06)' },
              ticks: { color: '#9ca3af', stepSize: 1 },
              beginAtZero: true
            },
            x: {
              grid: { display: false },
              ticks: { color: '#9ca3af' }
            }
          }
        }
      });
    }

    // Cleanups on unmount
    return () => {
      if (doughnutChartRef.current) doughnutChartRef.current.destroy();
      if (lineChartRef.current) lineChartRef.current.destroy();
      if (barChartRef.current) barChartRef.current.destroy();
    };
  }, [stats]);

  if (loading) {
    return (
      <div className="empty-state">
        <div style={{ animation: 'spin 1s infinite linear', fontSize: '2rem' }}>⚙️</div>
        <p style={{ marginTop: '1rem' }}>Compiling statistical logs...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Top dashboard values */}
      <div className="dashboard-grid">
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Logged Items</span>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem' }}>{stats.totalScans}</h3>
        </div>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Recycling Progress</span>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--primary)' }}>
            {stats.recyclingPercentage}%
          </h3>
        </div>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Hazard Warning Rate</span>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem', color: '#ef4444' }}>
            {stats.totalScans > 0 ? Math.round((stats.hazardousItems / stats.totalScans) * 100) : 0}%
          </h3>
        </div>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Database Mode</span>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.75rem', color: '#6366f1' }}>
            {stats.databaseMode}
          </h3>
        </div>
      </div>

      {/* Main charts layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        {/* Row 1: Line Chart (Daily activity) */}
        <div className="glass-card chart-card">
          <div className="chart-header">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: 700 }}>
              <LineChart size={18} color="var(--primary)" />
              <span>Daily Scan Activity</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Scan count over last 7 days</span>
          </div>
          <div className="chart-container">
            <canvas ref={lineCanvasRef}></canvas>
          </div>
        </div>

        {/* Row 2: Two charts side-by-side */}
        <div className="charts-grid" style={{ marginTop: 0 }}>
          {/* Doughnut: Category Distribution */}
          <div className="glass-card chart-card">
            <div className="chart-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: 700 }}>
                <PieChart size={18} color="#a855f7" />
                <span>Waste Category Breakdown</span>
              </h3>
            </div>
            <div className="chart-container" style={{ minHeight: '260px' }}>
              <canvas ref={doughnutCanvasRef}></canvas>
            </div>
          </div>

          {/* Bar Chart: Sustainability Profile */}
          <div className="glass-card chart-card">
            <div className="chart-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: 700 }}>
                <BarChart3 size={18} color="#f97316" />
                <span>Eco-Material Volume</span>
              </h3>
            </div>
            <div className="chart-container" style={{ minHeight: '260px' }}>
              <canvas ref={barCanvasRef}></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
