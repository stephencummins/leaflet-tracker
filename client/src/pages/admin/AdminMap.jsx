import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup, GeoJSON } from 'react-leaflet';
import useTrackerStore from '../../stores/useTrackerStore';
import { adminApi } from '../../api/adminClient';
import 'leaflet/dist/leaflet.css';

const POSTAL_DISTRICT_COLORS = {
  'SS0': '#E63946',
  'SS1': '#457B9D',
  'SS2': '#2A9D8F',
  'SS3': '#E9C46A',
  'SS4': '#F4A261',
  'SS5': '#264653',
  'SS9': '#6D6875',
};

const WARD_COLORS = {
  'Belfairs': '#2A9D8F',
  'Blenheim Park': '#E9C46A',
  'Chalkwell': '#6D6875',
  'Eastwood Park': '#E63946',
  'Kursaal': '#A8DADC',
  'Leigh': '#1D3557',
  'Milton': '#B5838D',
  'Prittlewell': '#F4A261',
  'St Laurence': '#457B9D',
  "St Luke's": '#264653',
  'Shoeburyness': '#BC6C25',
  'Southchurch': '#606C38',
  'Thorpe': '#3D405B',
  'Victoria': '#81B29A',
  'Westborough': '#2A9D8F',
  'West Leigh': '#E07A5F',
  'West Shoebury': '#DDA15E',
};

function MapLegend({ showWards, showPostalDistricts }) {
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
      maxHeight: 'calc(100vh - 80px)',
      overflowY: 'auto',
    }}>
      <div style={{ fontWeight: 700, fontSize: '0.72rem', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Leafleting
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27AE60', flexShrink: 0 }} />
        <span>Complete</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#E67E22', border: '2px solid #C0392B', flexShrink: 0, boxSizing: 'border-box' }} />
        <span>Assigned</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#999', flexShrink: 0 }} />
        <span>Unassigned</span>
      </div>
      {showWards && (
        <>
          <div style={{ fontWeight: 700, fontSize: '0.72rem', marginTop: 8, paddingTop: 8, borderTop: '1px solid #eee', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            Wards
          </div>
          {Object.entries(WARD_COLORS).sort(([a], [b]) => a.localeCompare(b)).map(([ward, color]) => (
            <div key={ward} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0, opacity: 0.8 }} />
              <span>{ward}</span>
            </div>
          ))}
          <div style={{ marginTop: 4, paddingTop: 4, borderTop: '1px solid #eee', fontSize: '0.68rem', color: '#999' }}>
            Click ward for candidate
          </div>
        </>
      )}
      {showPostalDistricts && (
        <>
          <div style={{ fontWeight: 700, fontSize: '0.72rem', marginTop: 8, paddingTop: 8, borderTop: '1px solid #eee', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            Postal Districts
          </div>
          {Object.entries(POSTAL_DISTRICT_COLORS).sort(([a], [b]) => a.localeCompare(b)).map(([district, color]) => (
            <div key={district} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0, opacity: 0.8 }} />
              <span>{district}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default function AdminMap() {
  const mapStreets = useTrackerStore(s => s.mapStreets);
  const loadMapStreets = useTrackerStore(s => s.loadMapStreets);
  const boundaries = useTrackerStore(s => s.boundaries);
  const loadBoundaries = useTrackerStore(s => s.loadBoundaries);
  const [searchParams] = useSearchParams();
  const highlightWard = searchParams.get('ward');
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [showPostalDistricts, setShowPostalDistricts] = useState(false);
  const [candidates, setCandidates] = useState({});

  useEffect(() => {
    loadMapStreets();
    loadBoundaries();
    adminApi.getCandidates().then(rows => {
      const map = {};
      for (const c of rows) {
        map[c.ward] = { name: c.candidate_name, phone: c.phone || '', paper: !!c.is_paper };
      }
      setCandidates(map);
    });
  }, [loadMapStreets, loadBoundaries]);

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

  const wardStyle = (feature) => {
    const isHighlighted = highlightWard && feature.properties.name === highlightWard;
    return {
      fillColor: WARD_COLORS[feature.properties.name] || '#999',
      fillOpacity: isHighlighted ? 0.5 : 0.15,
      color: WARD_COLORS[feature.properties.name] || '#999',
      weight: isHighlighted ? 4 : 2,
      opacity: isHighlighted ? 1 : 0.8,
    };
  };

  const onEachWard = useCallback((feature, layer) => {
    const ward = feature.properties.name;
    const candidate = candidates[ward];
    const color = WARD_COLORS[ward] || '#999';
    if (candidate) {
      layer.bindPopup(`
        <div style="min-width:170px">
          <div style="font-size:0.7rem;font-weight:700;color:${color};text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px">${ward}</div>
          <div style="font-weight:700;font-size:1rem;color:#1a2332;margin-bottom:6px;line-height:1.3">${candidate.name}</div>
          <div style="font-size:0.82rem;color:#666">${candidate.phone}</div>
          <div style="margin-top:6px;padding-top:6px;border-top:1px solid #eee;font-size:0.7rem;color:#999;font-style:italic">${candidate.paper ? 'Paper candidate' : 'Candidate'}</div>
        </div>
      `);
    } else {
      layer.bindPopup(`<strong>${ward}</strong>`);
    }
    const isHighlighted = highlightWard && ward === highlightWard;
    layer.on('mouseover', () => layer.setStyle({ fillOpacity: isHighlighted ? 0.6 : 0.35 }));
    layer.on('mouseout', () => layer.setStyle({ fillOpacity: isHighlighted ? 0.5 : 0.15 }));
    if (isHighlighted) {
      layer.once('add', () => layer.openPopup());
    }
  }, [highlightWard, candidates]);

  const postalDistrictStyle = (feature) => {
    const color = POSTAL_DISTRICT_COLORS[feature.properties.name] || '#999';
    return {
      fillColor: color,
      fillOpacity: 0.1,
      color,
      weight: 3,
      opacity: 0.9,
      dashArray: '6 4',
    };
  };

  const onEachPostalDistrict = useCallback((feature, layer) => {
    const name = feature.properties.name;
    const color = POSTAL_DISTRICT_COLORS[name] || '#999';
    layer.bindPopup(`
      <div style="min-width:100px;text-align:center">
        <div style="font-size:1.1rem;font-weight:700;color:${color}">${name}</div>
        <div style="font-size:0.75rem;color:#666">${feature.properties.description || 'Postal district'}</div>
      </div>
    `);
    layer.on('mouseover', () => layer.setStyle({ fillOpacity: 0.25 }));
    layer.on('mouseout', () => layer.setStyle({ fillOpacity: 0.1 }));
  }, []);

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
        {boundaries?.wards && (
          <button
            onClick={() => setShowBoundaries(b => !b)}
            style={toggleBtnStyle(showBoundaries)}
          >
            Wards
          </button>
        )}
        {boundaries?.postalDistricts && (
          <button
            onClick={() => setShowPostalDistricts(b => !b)}
            style={toggleBtnStyle(showPostalDistricts)}
          >
            Postcodes
          </button>
        )}
      </div>

      <MapLegend showWards={showBoundaries && !!boundaries?.wards} showPostalDistricts={showPostalDistricts && !!boundaries?.postalDistricts} />

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

        {showPostalDistricts && boundaries?.postalDistricts && (
          <GeoJSON key="postal-districts" data={boundaries.postalDistricts} style={postalDistrictStyle} onEachFeature={onEachPostalDistrict} />
        )}

        {showBoundaries && boundaries?.wards && (
          <GeoJSON key={`ward-boundaries-${Object.keys(candidates).length}`} data={boundaries.wards} style={wardStyle} onEachFeature={onEachWard} />
        )}

        {mapStreets.map(street => (
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

      </MapContainer>
    </div>
  );
}
