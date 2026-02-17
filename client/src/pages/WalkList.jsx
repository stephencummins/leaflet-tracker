import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVolunteer } from '../hooks/useVolunteer';
import useTrackerStore from '../stores/useTrackerStore';

const FILTERS = [
  { key: 'all', label: 'Any size' },
  { key: 'small', label: 'Up to 150', min: 0, max: 150 },
  { key: 'medium', label: '150–300', min: 150, max: 300 },
  { key: 'large', label: '300–500', min: 300, max: 500 },
  { key: 'xlarge', label: '500+', min: 500, max: Infinity },
];

export default function WalkList() {
  useVolunteer();
  const navigate = useNavigate();
  const walks = useTrackerStore(s => s.walks);
  const loadWalks = useTrackerStore(s => s.loadWalks);
  const [filter, setFilter] = useState('all');

  useEffect(() => { loadWalks(); }, []);

  const activeFilter = FILTERS.find(f => f.key === filter);
  const filtered = walks.filter(w => {
    if (filter === 'all') return true;
    return w.house_count >= activeFilter.min && w.house_count < activeFilter.max;
  });

  return (
    <div className="page">
      <h1 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: '1.6rem',
        fontWeight: 700,
        color: 'var(--navy)',
        marginBottom: 4,
        letterSpacing: '-0.02em',
      }}>
        Walks
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: 16 }}>
        Pick a walk, head out, and tick off streets as you go.
      </p>

      {/* Size filter chips */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: '0.75rem',
              fontWeight: 700,
              fontFamily: "'Bricolage Grotesque', sans-serif",
              background: filter === f.key
                ? 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)'
                : 'var(--bg)',
              color: filter === f.key ? 'white' : 'var(--text-secondary)',
              border: filter === f.key ? 'none' : '1px solid var(--border-light)',
              boxShadow: filter === f.key ? '0 2px 8px rgba(15,43,60,0.2)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
          {walks.length === 0 ? 'No walks have been set up yet.' : 'No walks in this size range.'}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((walk, i) => {
          const pct = walk.street_count > 0
            ? Math.round((walk.completed_count / walk.street_count) * 100)
            : 0;
          const done = walk.completed_count === walk.street_count && walk.street_count > 0;
          return (
            <div
              key={walk.id}
              className="card"
              onClick={() => navigate(`/walks/${walk.id}`)}
              style={{
                cursor: 'pointer',
                padding: '14px 16px',
                animation: `fadeInUp 0.2s ease ${i * 0.04}s both`,
                opacity: done ? 0.7 : 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                <div>
                  <div style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontWeight: 800,
                    fontSize: '1rem',
                    color: done ? 'var(--success)' : 'var(--navy)',
                    marginBottom: 2,
                  }}>
                    {done && '✓ '}{walk.name}
                  </div>
                  {walk.description && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                      {walk.description}
                    </div>
                  )}
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {walk.street_count} streets · {walk.house_count} houses
                  </div>
                </div>
                <span style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: done ? 'var(--success)' : 'var(--text-secondary)',
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  whiteSpace: 'nowrap',
                  marginLeft: 12,
                }}>
                  {pct}%
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${pct}%`,
                    background: done ? 'var(--success)' : 'var(--navy)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
