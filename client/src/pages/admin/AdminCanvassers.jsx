import { useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function AdminCanvassers() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getCanvassingSummary()
      .then(setData)
      .catch(e => setError(e.message));
  }, []);

  if (error) return <div className="admin-error">{error}</div>;
  if (!data) return <div className="admin-loading"><div className="admin-loading-text">Loading...</div></div>;

  // Build canvasser list from groups
  const canvasserMap = {};
  data.groups.forEach(g => {
    const name = g.assignee;
    if (!name) return;
    if (!canvasserMap[name]) {
      canvasserMap[name] = { name, groups: [], totalRoads: 0, roadsDone: 0, support: 0, against: 0, undecided: 0, not_home: 0 };
    }
    canvasserMap[name].groups.push(g);
    canvasserMap[name].totalRoads += g.road_count;
    canvasserMap[name].roadsDone += g.roads_done;
    canvasserMap[name].support += g.support;
    canvasserMap[name].against += g.against;
    canvasserMap[name].undecided += g.undecided;
    canvasserMap[name].not_home += g.not_home;
  });

  const canvassers = Object.values(canvasserMap).sort((a, b) => b.roadsDone - a.roadsDone);
  const totalDoors = data.totals.total_support + data.totals.total_against + data.totals.total_undecided + data.totals.total_not_home;

  return (
    <div className="admin-content">
      <h1 className="admin-title">Canvassers</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Canvassers', value: canvassers.length, color: '#6366f1' },
          { label: 'Road Groups', value: data.groups.length, color: '#8b5cf6' },
          { label: 'Total Roads', value: data.totals.roads_total, color: '#0ea5e9' },
          { label: 'Roads Done', value: data.totals.roads_done, color: '#10b981' },
          { label: 'Doors Knocked', value: totalDoors, color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} style={{ background: 'white', borderRadius: 10, padding: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderTop: `3px solid ${s.color}` }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {canvassers.map(c => {
          const total = c.support + c.against + c.undecided + c.not_home;
          const pct = c.totalRoads > 0 ? Math.round((c.roadsDone / c.totalRoads) * 100) : 0;

          return (
            <div key={c.name} style={{
              background: 'white', borderRadius: 12, padding: '18px 20px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              borderLeft: `4px solid ${pct === 100 ? '#10b981' : pct > 0 ? '#f59e0b' : '#e5e7eb'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937' }}>{c.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 2 }}>
                    {c.groups.map(g => `G${g.number} (Wk ${g.week})`).join(' · ')}
                  </div>
                </div>
                <div style={{
                  padding: '4px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700,
                  background: pct === 100 ? '#d1fae5' : pct > 0 ? '#fef3c7' : '#f3f4f6',
                  color: pct === 100 ? '#065f46' : pct > 0 ? '#92400e' : '#6b7280',
                }}>
                  {pct}%
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280', marginBottom: 4 }}>
                  <span>{c.roadsDone}/{c.totalRoads} roads done</span>
                  <span>{total} doors knocked</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: '#f3f4f6', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${pct}%`, borderRadius: 3,
                    background: pct === 100 ? '#10b981' : '#f59e0b',
                    transition: 'width 0.3s ease',
                  }} />
                </div>
              </div>

              {/* Tally breakdown */}
              {total > 0 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[
                    { label: 'Support', value: c.support, color: '#10b981', bg: '#d1fae5' },
                    { label: 'Against', value: c.against, color: '#ef4444', bg: '#fee2e2' },
                    { label: 'Undecided', value: c.undecided, color: '#f59e0b', bg: '#fef3c7' },
                    { label: 'Not Home', value: c.not_home, color: '#6b7280', bg: '#f3f4f6' },
                  ].filter(t => t.value > 0).map(t => (
                    <span key={t.label} style={{
                      fontSize: '0.72rem', padding: '3px 8px', borderRadius: 12,
                      background: t.bg, color: t.color, fontWeight: 600,
                    }}>
                      {t.label}: {t.value}
                    </span>
                  ))}
                </div>
              )}

              {/* Groups detail */}
              {c.groups.length > 1 && (
                <div style={{ marginTop: 10, borderTop: '1px solid #f3f4f6', paddingTop: 8 }}>
                  {c.groups.map(g => (
                    <div key={g.number} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#6b7280', padding: '3px 0' }}>
                      <span>G{g.number} {g.name}</span>
                      <span style={{ color: g.roads_done === g.road_count ? '#10b981' : '#6b7280', fontWeight: 600 }}>
                        {g.roads_done}/{g.road_count}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
