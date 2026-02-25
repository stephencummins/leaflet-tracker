import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useTrackerStore from '../stores/useTrackerStore';

function ProgressBar({ done, total }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div style={{ margin: '8px 0 4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6B5D4F', marginBottom: 4 }}>
        <span>{done}/{total} roads done</span>
        <span>{pct}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: 'rgba(27,67,50,0.1)', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          borderRadius: 3,
          background: pct === 100 ? '#10b981' : pct > 0 ? '#f59e0b' : 'transparent',
          transition: 'width 0.3s ease',
        }} />
      </div>
    </div>
  );
}

function TallyChips({ support, against, undecided, not_home }) {
  const chips = [
    { label: 'For', value: support, color: '#059669' },
    { label: 'Against', value: against, color: '#dc2626' },
    { label: '?', value: undecided, color: '#d97706' },
    { label: 'NH', value: not_home, color: '#6B5D4F' },
  ];
  const total = support + against + undecided + not_home;
  if (total === 0) return null;
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
      {chips.map(c => c.value > 0 && (
        <span key={c.label} style={{
          fontSize: '0.7rem',
          padding: '2px 8px',
          borderRadius: 12,
          background: `${c.color}15`,
          color: c.color,
          border: `1px solid ${c.color}30`,
          fontWeight: 600,
        }}>
          {c.label}: {c.value}
        </span>
      ))}
    </div>
  );
}

export default function CanvassList() {
  const { canvassGroups, loadCanvassGroups } = useTrackerStore();
  const navigate = useNavigate();

  useEffect(() => { loadCanvassGroups(); }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      paddingBottom: 'calc(var(--nav-height) + 24px)',
    }}>
      <div style={{
        background: 'var(--navy)',
        borderBottom: '2px solid var(--cyan)',
        padding: '20px 16px 16px',
      }}>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '1.5rem',
          color: '#F5F0E6',
          margin: 0,
        }}>Canvassing</h1>
        <p style={{ color: 'rgba(245,240,230,0.6)', fontSize: '0.85rem', margin: '4px 0 0' }}>
          Leigh Ward — 9 Road Groups
        </p>
      </div>

      <div style={{ padding: '16px' }}>
        {canvassGroups.length === 0 ? (
          <div style={{ color: '#6B5D4F', textAlign: 'center', padding: 40 }}>
            Loading groups...
          </div>
        ) : (
          canvassGroups.map(group => (
            <div
              key={group.id}
              onClick={() => navigate(`/canvass/${group.id}`)}
              style={{
                background: 'white',
                border: '1px solid rgba(27,67,50,0.12)',
                borderRadius: 12,
                padding: '14px 16px',
                marginBottom: 12,
                cursor: 'pointer',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{
                      background: 'var(--cyan)',
                      color: 'var(--navy)',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      padding: '2px 7px',
                      borderRadius: 10,
                      fontFamily: "'Playfair Display', Georgia, serif",
                    }}>
                      G{group.number}
                    </span>
                    <span style={{ color: 'var(--navy)', fontWeight: 600, fontSize: '0.95rem' }}>
                      {group.name}
                    </span>
                  </div>
                  <div style={{ color: '#6B5D4F', fontSize: '0.75rem' }}>
                    {group.assignee} · Week {group.week}
                  </div>
                </div>
                <span style={{ color: 'rgba(27,67,50,0.3)', fontSize: '1.2rem' }}>›</span>
              </div>
              <ProgressBar done={group.roads_done || 0} total={group.road_count || 0} />
              <TallyChips
                support={group.total_support || 0}
                against={group.total_against || 0}
                undecided={group.total_undecided || 0}
                not_home={group.total_not_home || 0}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
