import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet';
import { usePolling } from '../hooks/usePolling';
import { useCelebration } from '../hooks/useCelebration';
import useTrackerStore from '../stores/useTrackerStore';
import { api } from '../api/client';
import 'leaflet/dist/leaflet.css';

function FitBounds({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 1) map.fitBounds(bounds, { padding: [24, 24] });
  }, [map, bounds]);
  return null;
}

export default function WalkView() {
  const [searchParams] = useSearchParams();
  const volunteer = useTrackerStore(s => s.volunteer);
  const setVolunteer = useTrackerStore(s => s.setVolunteer);

  // Auto-register volunteer from ?volunteer= query param
  useEffect(() => {
    const name = searchParams.get('volunteer');
    if (name && !volunteer) {
      api.registerVolunteer(name).then((v) => {
        setVolunteer(v);
        localStorage.setItem('volunteer_name', name);
      });
    }
  }, [searchParams, volunteer, setVolunteer]);

  const { walkId } = useParams();
  const navigate = useNavigate();
  const walk = useTrackerStore(s => s.activeWalk);
  const loadWalk = useTrackerStore(s => s.loadWalk);
  const completeStreet = useTrackerStore(s => s.completeStreet);
  const { processCelebrations, fireBigConfetti, addCelebration } = useCelebration();
  const addCelebrationStore = useTrackerStore(s => s.addCelebration);
  const [completing, setCompleting] = useState(null);
  const [walkDone, setWalkDone] = useState(false);

  usePolling(() => loadWalk(walkId), 10000);

  useEffect(() => { loadWalk(walkId); }, [walkId]);

  if (!walk || walk.id !== parseInt(walkId)) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'var(--text-muted)' }}>Loading...</span>
      </div>
    );
  }

  const streets = walk.streets || [];
  const geocoded = streets.filter(s => s.latitude && s.longitude);
  const completedCount = streets.filter(s => s.is_complete).length;
  const pct = streets.length > 0 ? Math.round((completedCount / streets.length) * 100) : 0;
  const bounds = geocoded.length > 0 ? geocoded.map(s => [s.latitude, s.longitude]) : null;

  const handleComplete = async (streetId) => {
    if (completing === streetId) return;
    setCompleting(streetId);
    try {
      const result = await completeStreet(streetId);
      processCelebrations(result);
      // Check if walk is now complete
      const updatedStreets = streets.map(s => s.id === streetId ? { ...s, is_complete: 1 } : s);
      const allDone = updatedStreets.every(s => s.is_complete);
      if (allDone && !walkDone) {
        setWalkDone(true);
        fireBigConfetti();
        addCelebrationStore({
          type: 'achievement',
          name: 'Walk Complete!',
          description: `You delivered to all ${walk.house_count} houses on this walk. Brilliant work!`,
          icon: '🎉',
        });
      }
    } finally {
      setCompleting(null);
    }
  };

  const incomplete = streets.filter(s => !s.is_complete);
  const completed = streets.filter(s => s.is_complete);

  return (
    <div className="page" style={{ paddingBottom: 90 }}>
      <button
        onClick={() => navigate('/walks')}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 600,
          marginBottom: 12, padding: '6px 0', letterSpacing: '0.02em',
        }}
      >
        <span style={{ fontSize: '0.9rem' }}>‹</span> Back to Walks
      </button>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <h1 style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.03em',
        }}>
          {walk.name}
        </h1>
        <span style={{
          fontSize: '0.82rem', color: pct === 100 ? 'var(--success)' : 'var(--text-secondary)',
          fontWeight: 600, marginLeft: 'auto',
          fontFamily: "'Bricolage Grotesque', sans-serif",
        }}>
          {completedCount}/{streets.length} · {pct}%
        </span>
      </div>
      {walk.description && (
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>
          {walk.description}
        </p>
      )}

      <div className="progress-bar" style={{ marginBottom: 16 }}>
        <div
          className="progress-bar-fill"
          style={{ width: `${pct}%`, background: pct === 100 ? 'var(--success)' : 'var(--navy)' }}
        />
      </div>

      {/* Map */}
      {bounds && (
        <div style={{
          height: 220, borderRadius: 10, overflow: 'hidden',
          border: '1px solid var(--border-light)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          marginBottom: 16,
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
            {geocoded.map(street => (
              <CircleMarker
                key={street.id}
                center={[street.latitude, street.longitude]}
                radius={Math.max(5, Math.sqrt(street.house_count) * 1.4)}
                pathOptions={{
                  color: street.is_complete ? '#27AE60' : (street.zone_color || '#1B4332'),
                  fillColor: street.is_complete ? '#27AE60' : (street.zone_color || '#1B4332'),
                  fillOpacity: 0.75,
                  weight: 2,
                }}
                eventHandlers={{
                  click: () => !street.is_complete && handleComplete(street.id),
                }}
              />
            ))}
          </MapContainer>
        </div>
      )}
      {bounds && (
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 14, textAlign: 'center' }}>
          Tap a marker on the map to mark a street done
        </p>
      )}

      {/* Incomplete streets */}
      {incomplete.length > 0 && (
        <>
          <h2 style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)',
            letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8,
          }}>
            To Do ({incomplete.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {incomplete.map(street => (
              <div key={street.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 14px', borderRadius: 10,
                background: 'white', border: '1px solid var(--border-light)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                gap: 10,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontWeight: 700, fontSize: '0.88rem', color: 'var(--navy)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {street.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    {street.house_count} houses · {street.zone_id}
                  </div>
                </div>
                <button
                  onClick={() => handleComplete(street.id)}
                  disabled={completing === street.id}
                  style={{
                    padding: '8px 16px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700,
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    background: completing === street.id
                      ? 'var(--border-light)'
                      : 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)',
                    color: completing === street.id ? 'var(--text-muted)' : 'white',
                    border: 'none', cursor: completing === street.id ? 'default' : 'pointer',
                    whiteSpace: 'nowrap', flexShrink: 0,
                    boxShadow: '0 2px 6px rgba(15,43,60,0.2)',
                  }}
                >
                  {completing === street.id ? '...' : 'Done ✓'}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Completed streets */}
      {completed.length > 0 && (
        <>
          <h2 style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: '0.78rem', fontWeight: 700, color: 'var(--success)',
            letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8,
          }}>
            Done ({completed.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {completed.map(street => (
              <div key={street.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', borderRadius: 10,
                background: '#f0faf4', border: '1px solid #c3e6cb',
                gap: 10,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontWeight: 600, fontSize: '0.85rem', color: '#27AE60',
                    textDecoration: 'line-through', opacity: 0.8,
                  }}>
                    {street.name}
                  </div>
                  {street.completed_by_name && (
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      by {street.completed_by_name}
                    </div>
                  )}
                </div>
                <span style={{ fontSize: '1.1rem' }}>✓</span>
              </div>
            ))}
          </div>
        </>
      )}

      {pct === 100 && (
        <div style={{
          textAlign: 'center', padding: '24px 16px', marginTop: 20,
          background: 'linear-gradient(135deg, #f0faf4 0%, #e8f5e9 100%)',
          borderRadius: 12, border: '1px solid #c3e6cb',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🎉</div>
          <div style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700, fontSize: '1.2rem', color: '#27AE60', marginBottom: 4,
          }}>
            Walk Complete!
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {walk.house_count} houses covered. Brilliant work!
          </div>
        </div>
      )}
    </div>
  );
}
