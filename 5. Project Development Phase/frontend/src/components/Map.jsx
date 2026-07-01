import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Phone, Clock, Filter, List } from 'lucide-react';
import { fetchCollectionCenters } from '../services/api';

const CENTER_TYPES = ['All', 'Recycling centers', 'E-waste centers', 'Organic waste centers', 'Hazardous waste centers'];

export default function Map({ addToast }) {
  const [centers, setCenters] = useState([]);
  const [filteredCenters, setFilteredCenters] = useState([]);
  const [selectedType, setSelectedType] = useState('All');
  const [activeCenterId, setActiveCenterId] = useState(null);
  
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  // SVG Pins for different center types
  const getMarkerIcon = (type) => {
    let color = '#10b981'; // Green
    if (type.includes('Recycling')) color = '#3b82f6'; // Blue
    if (type.includes('E-waste')) color = '#eab308'; // Yellow
    if (type.includes('Hazardous')) color = '#ef4444'; // Red

    const html = `
      <div style="position: relative; width: 32px; height: 32px;">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 2px 5px rgba(0,0,0,0.4));">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="${color}30"></path>
          <circle cx="12" cy="10" r="3" fill="${color}"></circle>
        </svg>
      </div>
    `;

    return L.divIcon({
      html: html,
      className: 'custom-map-pin',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  };

  // Fetch centers on load
  useEffect(() => {
    const loadCenters = async () => {
      try {
        const data = await fetchCollectionCenters();
        setCenters(data);
        setFilteredCenters(data);
      } catch (err) {
        addToast(err.message || 'Failed to fetch collection centers', 'error');
      }
    };
    loadCenters();
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // SF coordinates as baseline center
    const defaultCenter = [37.7749, -122.4194];
    
    // Create map instance
    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 13,
      zoomControl: false // We will place zoom control on top-right manually
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    // Dark-themed tiles from CartoDB or general OSM
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Apply filters and markers updates
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Filter centers
    const filtered = centers.filter(c => selectedType === 'All' || c.type === selectedType);
    setFilteredCenters(filtered);

    // Clear old markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Add new markers
    const group = L.featureGroup();
    filtered.forEach(center => {
      const [lat, lng] = center.coordinates;
      
      const popupContent = `
        <div style="font-family: Outfit, sans-serif; padding: 0.25rem;">
          <h4 style="margin: 0 0 0.5rem 0; font-size: 1rem; font-weight: 700; color: #f3f4f6;">${center.name}</h4>
          <p style="margin: 0 0 0.25rem 0; font-size: 0.8rem; color: #9ca3af;">📍 ${center.address}</p>
          <p style="margin: 0 0 0.25rem 0; font-size: 0.8rem; color: #9ca3af;">📞 ${center.phone}</p>
          <p style="margin: 0 0 0.5rem 0; font-size: 0.8rem; color: #9ca3af;">🕒 ${center.hours}</p>
          <div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
            ${center.acceptedTypes.map(type => `
              <span style="font-size: 0.7rem; font-weight: 600; padding: 0.1rem 0.4rem; border-radius: 9999px; background-color: rgba(16, 185, 129, 0.15); color: #10b981;">
                ${type}
              </span>
            `).join('')}
          </div>
        </div>
      `;

      const marker = L.marker([lat, lng], { icon: getMarkerIcon(center.type) })
        .bindPopup(popupContent)
        .addTo(map);

      marker.on('click', () => {
        setActiveCenterId(center.id);
      });

      markersRef.current[center.id] = marker;
      group.addLayer(marker);
    });

    // Auto fit map boundary if markers exist
    if (filtered.length > 0) {
      map.fitBounds(group.getBounds(), { padding: [40, 40] });
    }
  }, [centers, selectedType]);

  const handleCenterClick = (center) => {
    setActiveCenterId(center.id);
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo(center.coordinates, 15, { duration: 1.2 });
      
      const marker = markersRef.current[center.id];
      if (marker) {
        setTimeout(() => marker.openPopup(), 1200);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      {/* Filters header */}
      <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Filter size={18} color="var(--primary)" />
          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Filter Collection Hubs:</span>
          <div className="filter-tabs" style={{ margin: 0 }}>
            {CENTER_TYPES.map(type => (
              <button
                key={type}
                className={`filter-tab ${selectedType === type ? 'active' : ''}`}
                onClick={() => setSelectedType(type)}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              >
                {type === 'All' ? 'All Centers' : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Content grid */}
      <div className="map-layout" style={{ flex: 1 }}>
        {/* Leaflet canvas container */}
        <div className="leaflet-map-container" ref={mapContainerRef}></div>

        {/* Sidebar Centers List */}
        <div className="centers-sidebar">
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-secondary)' }}>
            <List size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Location Directory ({filteredCenters.length})</h3>
          </div>

          <div className="centers-list">
            {filteredCenters.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No dropoff centers found for this filter category.
              </div>
            ) : (
              filteredCenters.map(center => (
                <div
                  key={center.id}
                  className={`center-card ${activeCenterId === center.id ? 'active' : ''}`}
                  onClick={() => handleCenterClick(center)}
                >
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.25rem' }}>{center.name}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                    <MapPin size={12} color="var(--primary)" />
                    <span>{center.address}</span>
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                    <Phone size={12} />
                    <span>{center.phone}</span>
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={12} />
                    <span>{center.hours}</span>
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
