import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
import { api } from '../api/client';
import 'leaflet/dist/leaflet.css';

const SECTOR_COLORS = {
  'SS0 0': '#E9C46A', 'SS0 7': '#B5838D', 'SS0 8': '#6D6875', 'SS0 9': '#2A9D8F',
  'SS1 1': '#A8DADC', 'SS1 2': '#457B9D', 'SS1 3': '#3D405B',
  'SS2 4': '#F4A261', 'SS2 5': '#264653', 'SS2 6': '#5B8ABF',
  'SS3 0': '#81B29A', 'SS3 8': '#DDA15E', 'SS3 9': '#BC6C25',
  'SS9 1': '#1D3557', 'SS9 2': '#606C38', 'SS9 3': '#2A9D8F', 'SS9 4': '#E07A5F', 'SS9 5': '#E63946',
};

const WARD_COLORS = {
  'Belfairs': '#2A9D8F', 'Blenheim Park': '#E9C46A', 'Chalkwell': '#6D6875',
  'Eastwood Park': '#E63946', 'Kursaal': '#A8DADC', 'Leigh': '#1D3557',
  'Milton': '#B5838D', 'Prittlewell': '#F4A261', 'St Laurence': '#457B9D',
  "St Luke's": '#264653', 'Shoeburyness': '#BC6C25', 'Southchurch': '#606C38',
  'Thorpe': '#3D405B', 'Victoria': '#81B29A', 'Westborough': '#2A9D8F',
  'West Leigh': '#E07A5F', 'West Shoebury': '#DDA15E',
};

function Legend({ showWards, showSectors }) {
  return (
    <div style={{
      position: 'absolute', bottom: 20, left: 10, zIndex: 1000,
      background: '#fff', borderRadius: 8, padding: '10px 14px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)', border: '1px solid #ddd',
      fontSize: '0.7rem', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto',
    }}>
      {showWards && (
        <>
          <div style={{ fontWeight: 700, fontSize: '0.72rem', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Wards</div>
          {Object.entries(WARD_COLORS).sort(([a], [b]) => a.localeCompare(b)).map(([ward, color]) => (
            <div key={ward} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0, opacity: 0.8 }} />
              <span>{ward}</span>
            </div>
          ))}
        </>
      )}
      {showWards && showSectors && <div style={{ height: 1, background: '#eee', margin: '8px 0' }} />}
      {showSectors && (
        <>
          <div style={{ fontWeight: 700, fontSize: '0.72rem', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Postcode Sectors</div>
          {Object.entries(SECTOR_COLORS).sort(([a], [b]) => a.localeCompare(b)).map(([sector, color]) => (
            <div key={sector} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0, opacity: 0.8, border: '1px dashed rgba(0,0,0,0.2)' }} />
              <span>{sector}</span>
            </div>
          ))}
        </>
      )}
      <div style={{ marginTop: 8, paddingTop: 6, borderTop: '1px solid #eee', fontSize: '0.62rem', color: '#aaa', lineHeight: 1.4 }}>
        Southend Liberal Democrats<br />May 2026
      </div>
    </div>
  );
}

export default function PublicMap() {
  const [boundaries, setBoundaries] = useState(null);
  const [showWards, setShowWards] = useState(true);
  const [showSectors, setShowSectors] = useState(true);

  useEffect(() => {
    api.getBoundaries().then(setBoundaries).catch(() => {});
  }, []);

  const wardStyle = useCallback((feature) => ({
    fillColor: WARD_COLORS[feature.properties.name] || '#999',
    fillOpacity: 0.15,
    color: WARD_COLORS[feature.properties.name] || '#999',
    weight: 2,
    opacity: 0.8,
  }), []);

  const onEachWard = useCallback((feature, layer) => {
    layer.bindPopup(`<div style="text-align:center"><strong>${feature.properties.name}</strong><div style="font-size:0.7rem;color:#999">Council Ward</div></div>`);
    layer.on('mouseover', () => layer.setStyle({ fillOpacity: 0.35 }));
    layer.on('mouseout', () => layer.setStyle({ fillOpacity: 0.15 }));
  }, []);

  const sectorStyle = useCallback((feature) => {
    const color = SECTOR_COLORS[feature.properties.name] || '#999';
    return { fillColor: color, fillOpacity: 0.12, color, weight: 2.5, opacity: 0.8, dashArray: '6 4' };
  }, []);

  const onEachSector = useCallback((feature, layer) => {
    const name = feature.properties.name;
    const color = SECTOR_COLORS[name] || '#999';
    const count = feature.properties.count || 0;
    layer.bindPopup(`<div style="text-align:center"><div style="font-size:1.1rem;font-weight:700;color:${color}">${name}</div><div style="font-size:0.75rem;color:#666">${count} postcodes</div></div>`);
    layer.bindTooltip(name, { permanent: true, direction: 'center', className: 'sector-label' });
    layer.on('mouseover', () => layer.setStyle({ fillOpacity: 0.28 }));
    layer.on('mouseout', () => layer.setStyle({ fillOpacity: 0.12 }));
  }, []);

  if (!boundaries) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>Loading map...</div>;
  }

  const btnStyle = (active) => ({
    padding: '8px 14px', fontSize: '0.72rem', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.06em',
    background: active ? '#1a2332' : '#fff', color: active ? '#5bc0de' : '#999',
    border: 'none', cursor: 'pointer',
  });

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      <style>{`
        .sector-label{background:rgba(26,35,50,0.85)!important;border:1px solid rgba(91,188,222,0.5)!important;color:#5bc0de!important;font-size:0.68rem!important;font-weight:700!important;padding:2px 6px!important;border-radius:4px!important;box-shadow:none!important;}
      `}</style>

      <div style={{
        position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', zIndex: 1000,
        background: 'rgba(255,255,255,0.95)', borderRadius: 8, padding: '6px 12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)', border: '1px solid #ddd',
        fontSize: '0.8rem', fontWeight: 700, color: '#1a2332', textAlign: 'center',
      }}>
        Southend-on-Sea — Wards & Postcode Sectors
      </div>

      <div style={{
        position: 'absolute', top: 10, right: 10, zIndex: 1000,
        display: 'flex', gap: 0, borderRadius: 8, overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)', border: '1px solid #ddd',
      }}>
        <button onClick={() => setShowWards(b => !b)} style={btnStyle(showWards)}>Wards</button>
        <button onClick={() => setShowSectors(b => !b)} style={btnStyle(showSectors)}>Sectors</button>
      </div>

      <Legend showWards={showWards} showSectors={showSectors} />

      <MapContainer center={[51.548, 0.720]} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {showSectors && boundaries.postalSectors && (
          <GeoJSON key="sectors" data={boundaries.postalSectors} style={sectorStyle} onEachFeature={onEachSector} />
        )}
        {showWards && boundaries.wards && (
          <GeoJSON key="wards" data={boundaries.wards} style={wardStyle} onEachFeature={onEachWard} />
        )}
      </MapContainer>
    </div>
  );
}
