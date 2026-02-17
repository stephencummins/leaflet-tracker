import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVolunteer } from '../hooks/useVolunteer';
import { usePolling } from '../hooks/usePolling';
import { useCelebration } from '../hooks/useCelebration';
import useTrackerStore from '../stores/useTrackerStore';
import StreetCard from '../components/zone/StreetCard';
import ZoneMiniMap from '../components/zone/ZoneMiniMap';

export default function ZoneView() {
  useVolunteer();
  const { zoneId } = useParams();
  const navigate = useNavigate();
  const zone = useTrackerStore(s => s.activeZone);
  const loadZone = useTrackerStore(s => s.loadZone);
  const completeStreet = useTrackerStore(s => s.completeStreet);
  const { processCelebrations } = useCelebration();
  const [filter, setFilter] = useState('all');

  usePolling(() => loadZone(zoneId), 10000);

  if (!zone || zone.id !== zoneId) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'var(--text-muted)' }}>Loading...</span>
      </div>
    );
  }

  const streets = zone.streets || [];
  const completedCount = streets.filter(s => s.is_complete).length;
  const pct = streets.length > 0 ? Math.round((completedCount / streets.length) * 100) : 0;

  const filtered = streets.filter(s => {
    if (filter === 'todo') return !s.is_complete;
    if (filter === 'done') return s.is_complete;
    return true;
  });

  const handleComplete = async (streetId) => {
    const result = await completeStreet(streetId);
    processCelebrations(result);
  };

  return (
    <div className="page">
      <button
        onClick={() => navigate('/zones')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          color: 'var(--text-secondary)',
          fontSize: '0.78rem',
          fontWeight: 600,
          marginBottom: 14,
          padding: '6px 0',
          letterSpacing: '0.02em',
          transition: 'color 0.2s',
        }}
      >
        <span style={{ fontSize: '0.9rem' }}>‹</span> Back to Zones
      </button>

      {/* Zone header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 6,
      }}>
        <div style={{
          width: 14,
          height: 14,
          borderRadius: 4,
          background: zone.color,
          boxShadow: `0 0 8px ${zone.color}40`,
        }} />
        <h1 style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: '1.5rem',
          fontWeight: 800,
          color: 'var(--navy)',
          letterSpacing: '-0.03em',
        }}>
          {zone.id}
        </h1>
        <span style={{
          fontSize: '0.82rem',
          color: pct === 100 ? 'var(--success)' : 'var(--text-secondary)',
          fontWeight: 600,
          marginLeft: 'auto',
          fontFamily: "'Bricolage Grotesque', sans-serif",
        }}>
          {completedCount}/{streets.length} streets · {pct}%
        </span>
      </div>

      <div className="progress-bar" style={{ marginBottom: 18 }}>
        <div
          className="progress-bar-fill"
          style={{
            width: `${pct}%`,
            background: pct === 100 ? 'var(--success)' : zone.color,
          }}
        />
      </div>

      <ZoneMiniMap zoneId={zone.id} zoneColor={zone.color} streets={streets} />

      {/* Filter tabs */}
      <div style={{
        display: 'flex',
        gap: 6,
        marginBottom: 14,
      }}>
        {[
          { key: 'all', label: `All (${streets.length})` },
          { key: 'todo', label: `To Do (${streets.length - completedCount})` },
          { key: 'done', label: `Done (${completedCount})` },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{
              padding: '7px 14px',
              borderRadius: 20,
              fontSize: '0.75rem',
              fontWeight: 700,
              fontFamily: "'Bricolage Grotesque', sans-serif",
              background: filter === tab.key
                ? 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)'
                : 'var(--bg)',
              color: filter === tab.key ? 'white' : 'var(--text-secondary)',
              boxShadow: filter === tab.key ? '0 2px 8px rgba(15,43,60,0.2)' : 'none',
              border: filter === tab.key ? 'none' : '1px solid var(--border-light)',
              transition: 'all 0.2s cubic-bezier(0.25,0.46,0.45,0.94)',
              letterSpacing: '0.01em',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map((street, i) => (
          <div key={street.id} style={{ animation: `fadeInUp 0.2s ease ${i * 0.03}s both` }}>
            <StreetCard
              street={street}
              zoneColor={zone.color}
              onComplete={handleComplete}
            />
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: 32,
            color: 'var(--text-muted)',
          }}>
            {filter === 'todo' ? 'All streets done! 🎉' : 'No streets match this filter.'}
          </div>
        )}
      </div>
    </div>
  );
}
