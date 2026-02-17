import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, GeoJSON, useMap } from 'react-leaflet';
import useTrackerStore from '../../stores/useTrackerStore';
import 'leaflet/dist/leaflet.css';

function FitBounds({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) map.fitBounds(bounds, { padding: [20, 20] });
  }, [map, bounds]);
  return null;
}

export default function ZoneMiniMap({ zoneId, zoneColor, streets }) {
  const boundaries = useTrackerStore(s => s.boundaries);
  const loadBoundaries = useTrackerStore(s => s.loadBoundaries);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!boundaries) loadBoundaries();
  }, [boundaries, loadBoundaries]);

  const zoneBoundary = boundaries?.zones?.features?.find(f => f.properties.id === zoneId);
  const geocodedStreets = (streets || []).filter(s => s.latitude && s.longitude);

  // Compute bounds from boundary or streets
  let bounds = null;
  if (zoneBoundary) {
    const coords = zoneBoundary.geometry.coordinates[0];
    bounds = coords.map(([lng, lat]) => [lat, lng]);
  } else if (geocodedStreets.length > 0) {
    bounds = geocodedStreets.map(s => [s.latitude, s.longitude]);
  }

  if (!bounds || bounds.length === 0) return null;

  return (
    <div style={{ marginBottom: 14 }}>
      <button
        onClick={() => setCollapsed(c => !c)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '0.72rem',
          fontWeight: 700,
          fontFamily: "'Bricolage Grotesque', sans-serif",
          color: 'var(--text-secondary)',
          marginBottom: collapsed ? 0 : 8,
          padding: '4px 0',
          letterSpacing: '0.02em',
        }}
      >
        <span style={{ fontSize: '0.8rem', transform: collapsed ? 'rotate(-90deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
          ▾
        </span>
        {collapsed ? 'Show map' : 'Hide map'}
      </button>
      {!collapsed && (
        <div style={{
          height: 200,
          borderRadius: 10,
          overflow: 'hidden',
          border: '1px solid var(--border-light)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
          <MapContainer
            center={[51.543, 0.654]}
            zoom={14}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
            <FitBounds bounds={bounds} />
            {zoneBoundary && (
              <GeoJSON
                data={zoneBoundary}
                style={{
                  color: zoneColor,
                  weight: 2,
                  opacity: 0.7,
                  fillColor: zoneColor,
                  fillOpacity: 0.12,
                }}
              />
            )}
            {geocodedStreets.map(street => (
              <CircleMarker
                key={street.id}
                center={[street.latitude, street.longitude]}
                radius={Math.max(4, Math.sqrt(street.house_count) * 1.2)}
                pathOptions={{
                  color: street.is_complete ? '#27AE60' : zoneColor,
                  fillColor: street.is_complete ? '#27AE60' : zoneColor,
                  fillOpacity: 0.7,
                  weight: 1,
                }}
              />
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
}
