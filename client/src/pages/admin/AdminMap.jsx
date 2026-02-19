import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, GeoJSON, useMap } from 'react-leaflet';
import useTrackerStore from '../../stores/useTrackerStore';
import 'leaflet/dist/leaflet.css';

function HeatLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;

    let heat;
    import('leaflet.heat').then(() => {
      heat = L.heatLayer(points, {
        radius: 30,
        blur: 20,
        maxZoom: 17,
        gradient: {
          0.2: '#2D5A47',
          0.4: '#D4A03C',
          0.6: '#E76F51',
          0.8: '#8B2635',
          1.0: '#8B2635',
        },
      }).addTo(map);
    });

    return () => {
      if (heat) map.removeLayer(heat);
    };
  }, [map, points]);

  return null;
}

function ZoneLegend({ zones, showBoundaries }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: 20,
      left: 10,
      zIndex: 1000,
      background: 'var(--card, #fff)',
      borderRadius: 8,
      padding: '10px 14px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      border: '1px solid #ddd',
      fontSize: '0.7rem',
      maxWidth: 160,
    }}>
      <div style={{
        fontWeight: 700,
        fontSize: '0.72rem',
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}>
        Zones
      </div>
      {zones.map(z => (
        <div key={z.id} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <div style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: z.color,
            flexShrink: 0,
          }} />
          <span>{z.id}</span>
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, paddingTop: 6, borderTop: '1px solid #eee' }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27AE60', flexShrink: 0 }} />
        <span>Complete</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#E67E22', border: '2px solid #C0392B', flexShrink: 0, boxSizing: 'border-box' }} />
        <span>Assigned</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#999', flexShrink: 0 }} />
        <span>Unassigned</span>
      </div>
      {showBoundaries && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, paddingTop: 6, borderTop: '1px solid #eee' }}>
          <div style={{ width: 16, height: 0, borderTop: '2.5px dashed #2ECC71', flexShrink: 0 }} />
          <span>Ward boundary</span>
        </div>
      )}
    </div>
  );
}

export default function AdminMap() {
  const mapStreets = useTrackerStore(s => s.mapStreets);
  const loadMapStreets = useTrackerStore(s => s.loadMapStreets);
  const boundaries = useTrackerStore(s => s.boundaries);
  const loadBoundaries = useTrackerStore(s => s.loadBoundaries);
  const [viewMode, setViewMode] = useState('markers');
  const [showBoundaries, setShowBoundaries] = useState(true);

  useEffect(() => {
    loadMapStreets();
    loadBoundaries();
  }, [loadMapStreets, loadBoundaries]);

  const zones = useMemo(() => {
    const seen = new Map();
    for (const s of mapStreets) {
      if (!seen.has(s.zone_id)) {
        seen.set(s.zone_id, { id: s.zone_id, color: s.zone_color, name: s.zone_name });
      }
    }
    return Array.from(seen.values());
  }, [mapStreets]);

  const heatPoints = useMemo(() => {
    return mapStreets
      .filter(s => !s.is_complete)
      .map(s => [s.latitude, s.longitude, s.house_count / 50]);
  }, [mapStreets]);

  function getMarkerColor(street) {
    if (street.is_complete) return '#27AE60';
    if (street.assigned_volunteer_id) return '#E67E22';
    return '#999';
  }

  function getStatus(street) {
    if (street.is_complete) return 'Complete';
    if (street.assigned_volunteer_name) return `Assigned: ${street.assigned_volunteer_name}`;
    return 'Unassigned';
  }

  const zoneStyle = (feature) => ({
    fillColor: feature.properties.color,
    fillOpacity: 0.12,
    color: feature.properties.color,
    weight: 2,
    opacity: 0.6,
  });

  const wardStyle = () => ({
    fill: false,
    color: '#2ECC71',
    weight: 3,
    opacity: 0.9,
    dashArray: '8 6',
  });

  if (mapStreets.length === 0) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>Loading map...</div>;
  }

  const toggleBtnStyle = (active) => ({
    padding: '8px 14px',
    fontSize: '0.72rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    background: active ? '#1a2332' : '#fff',
    color: active ? '#5bc0de' : '#999',
    border: 'none',
    cursor: 'pointer',
  });

  return (
    <div style={{ position: 'relative', height: 'calc(100vh - 40px)', width: '100%' }}>
      <div style={{
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1000,
        display: 'flex',
        gap: 0,
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        border: '1px solid #ddd',
      }}>
        <button
          onClick={() => setViewMode('markers')}
          style={{ ...toggleBtnStyle(viewMode === 'markers'), borderRight: '1px solid #ddd' }}
        >
          Markers
        </button>
        <button
          onClick={() => setViewMode('heat')}
          style={{ ...toggleBtnStyle(viewMode === 'heat'), borderRight: boundaries ? '1px solid #ddd' : 'none' }}
        >
          Heat Map
        </button>
        {boundaries && (
          <button
            onClick={() => setShowBoundaries(b => !b)}
            style={toggleBtnStyle(showBoundaries)}
          >
            Boundaries
          </button>
        )}
      </div>

      <ZoneLegend zones={zones} showBoundaries={showBoundaries && !!boundaries} />

      <MapContainer
        center={[51.543, 0.654]}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {showBoundaries && boundaries?.zones && (
          <GeoJSON key="zone-boundaries" data={boundaries.zones} style={zoneStyle} />
        )}
        {showBoundaries && boundaries?.wards && (
          <GeoJSON key="ward-boundaries" data={boundaries.wards} style={wardStyle} />
        )}

        {viewMode === 'markers' && mapStreets.map(street => (
          <CircleMarker
            key={street.id}
            center={[street.latitude, street.longitude]}
            radius={Math.max(6, Math.sqrt(street.house_count) * 1.2)}
            pathOptions={{
              fillColor: getMarkerColor(street),
              fillOpacity: street.is_complete ? 0.7 : 0.85,
              color: street.assigned_volunteer_id && !street.is_complete ? '#C0392B' : street.is_complete ? '#1B4332' : '#fff',
              weight: street.assigned_volunteer_id && !street.is_complete ? 3 : street.is_complete ? 1 : 2,
            }}
          >
            <Popup>
              <div style={{ minWidth: 160 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4, color: '#1B4332' }}>
                  {street.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#4A3F32', lineHeight: 1.6 }}>
                  <div>
                    <span style={{
                      display: 'inline-block',
                      width: 8, height: 8,
                      borderRadius: '50%',
                      background: street.zone_color,
                      marginRight: 5,
                      verticalAlign: 'middle',
                    }} />
                    {street.zone_name}
                  </div>
                  <div>{street.house_count} houses</div>
                  <div style={{ fontWeight: 600, color: street.is_complete ? '#2D5A47' : '#8B2635' }}>
                    {getStatus(street)}
                  </div>
                  {street.completed_by_name && (
                    <div style={{ fontStyle: 'italic', fontSize: '0.72rem' }}>
                      Delivered by {street.completed_by_name}
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {viewMode === 'heat' && <HeatLayer points={heatPoints} />}
      </MapContainer>
    </div>
  );
}
