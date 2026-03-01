import { useEffect, useState } from 'react';
import useAdminStore from '../../stores/useAdminStore';

export default function AdminRounds() {
  const { rounds, roundStats, loadRounds, loadRoundStats, createRound } = useAdminStore();
  const [expandedId, setExpandedId] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { loadRounds(); }, []);

  const handleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    loadRoundStats(id);
  };

  const handleCreate = async () => {
    if (!newName.trim()) { setError('Round name required'); return; }
    if (!confirm(`Start a new round? This will:\n\n• Close the current round\n• Reset all streets to incomplete\n• Clear all assignments\n\nThis cannot be undone.`)) return;
    setCreating(true);
    setError('');
    try {
      await createRound(newName.trim());
      setNewName('');
      setShowNewForm(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setCreating(false);
    }
  };

  const activeRound = rounds.find(r => r.is_active);

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Delivery Rounds</h1>

      <div className="admin-toolbar" style={{ marginBottom: 20 }}>
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => setShowNewForm(f => !f)}
        >
          {showNewForm ? 'Cancel' : '+ New Round'}
        </button>
      </div>

      {showNewForm && (
        <div style={{
          background: 'white', border: '1px solid var(--border-light)',
          borderRadius: 10, padding: 20, marginBottom: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <h2 className="admin-section-title" style={{ marginBottom: 12 }}>Start New Round</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.5 }}>
            This will close the current round, reset all streets to incomplete, and clear all assignments.
            Historical data from the current round will be preserved.
          </p>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              className="admin-input"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder={`e.g. Round ${rounds.length + 1}`}
              style={{ width: 220 }}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
            />
            <button
              className="admin-btn admin-btn-primary"
              onClick={handleCreate}
              disabled={creating}
            >
              {creating ? 'Creating...' : 'Create Round'}
            </button>
          </div>
          {error && (
            <p style={{ color: 'var(--error)', fontSize: '0.82rem', marginTop: 8 }}>{error}</p>
          )}
        </div>
      )}

      {/* Round cards */}
      {rounds.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
          No rounds yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {rounds.map(round => {
            const isActive = round.is_active;
            const isExpanded = expandedId === round.id;

            return (
              <div
                key={round.id}
                className="admin-card"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  borderLeft: isActive ? '4px solid var(--navy)' : '4px solid var(--border-light)',
                }}
              >
                {/* Header */}
                <div
                  style={{
                    padding: '16px 20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                  }}
                  onClick={() => handleExpand(round.id)}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--navy)' }}>
                        {round.name}
                      </span>
                      {isActive && (
                        <span style={{
                          fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase',
                          background: 'var(--navy)', color: 'white',
                          padding: '2px 8px', borderRadius: 4, letterSpacing: '0.04em',
                        }}>
                          Active
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {formatDate(round.started_at)}
                      {round.ended_at ? ` — ${formatDate(round.ended_at)}` : ' — present'}
                    </div>
                  </div>

                  {/* Summary stats */}
                  <div style={{ display: 'flex', gap: 20, flexShrink: 0 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--navy)' }}>{round.deliveries}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>deliveries</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--navy)' }}>{round.houses?.toLocaleString()}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>houses</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--navy)' }}>{round.volunteers}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>volunteers</div>
                    </div>
                  </div>

                  <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'none' }}>
                    ▾
                  </span>
                </div>

                {/* Expanded stats */}
                {isExpanded && roundStats && roundStats.round.id === round.id && (
                  <div style={{
                    borderTop: '1px solid var(--border-light)',
                    padding: '20px',
                    background: '#fafaf8',
                  }}>
                    {/* Ward coverage */}
                    <div className="admin-stats-grid" style={{ marginBottom: 20 }}>
                      <div className="admin-stat-card">
                        <div className="admin-stat-value">{roundStats.wardPercent}%</div>
                        <div className="admin-stat-label">Ward Coverage</div>
                      </div>
                      <div className="admin-stat-card">
                        <div className="admin-stat-value">{roundStats.wardStats.streets_delivered}</div>
                        <div className="admin-stat-label">Streets Delivered</div>
                      </div>
                      <div className="admin-stat-card">
                        <div className="admin-stat-value">{roundStats.wardStats.houses_delivered?.toLocaleString()}</div>
                        <div className="admin-stat-label">Houses Reached</div>
                      </div>
                    </div>

                    {/* Top volunteers */}
                    {roundStats.topVolunteers.length > 0 && (
                      <>
                        <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Top Volunteers
                        </h3>
                        <div className="admin-table-wrap" style={{ marginBottom: 20 }}>
                          <table className="admin-table">
                            <thead>
                              <tr><th>Name</th><th>Streets</th><th>Houses</th></tr>
                            </thead>
                            <tbody>
                              {roundStats.topVolunteers.map((v, i) => (
                                <tr key={v.id}>
                                  <td style={{ fontWeight: i < 3 ? 600 : 400 }}>{v.name}</td>
                                  <td>{v.streets_delivered}</td>
                                  <td>{v.houses_delivered?.toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}

                    {/* Zone breakdown */}
                    <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Zone Breakdown
                    </h3>
                    <div className="admin-table-wrap" style={{ marginBottom: 20 }}>
                      <table className="admin-table">
                        <thead>
                          <tr><th>Zone</th><th>Streets</th><th>Houses</th><th>Coverage</th></tr>
                        </thead>
                        <tbody>
                          {roundStats.zones.filter(z => z.delivered_streets > 0).map(z => {
                            const pct = z.total_houses ? Math.round((z.delivered_houses / z.total_houses) * 100) : 0;
                            return (
                              <tr key={z.id}>
                                <td>
                                  <span className="admin-zone-badge" style={{ background: z.color }}>{z.id}</span>
                                  {z.name}
                                </td>
                                <td>{z.delivered_streets}/{z.total_streets}</td>
                                <td>{z.delivered_houses?.toLocaleString()}/{z.total_houses?.toLocaleString()}</td>
                                <td>
                                  <div className="admin-progress">
                                    <div className="admin-progress-bar">
                                      <div className="admin-progress-fill" style={{ width: `${pct}%`, background: z.color }} />
                                    </div>
                                    <span className="admin-progress-text">{pct}%</span>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Recent activity */}
                    {roundStats.recent.length > 0 && (
                      <>
                        <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Recent Activity
                        </h3>
                        <div className="admin-activity-list">
                          {roundStats.recent.slice(0, 20).map(r => (
                            <div key={r.id} className="admin-activity-item">
                              <span className="admin-zone-badge" style={{ background: r.zone_color }}>{r.zone_id}</span>
                              <span className="admin-activity-street">{r.street_name}</span>
                              <span className="admin-activity-vol">{r.volunteer_name}</span>
                              <span className="admin-activity-houses">{r.house_count} houses</span>
                              <span className="admin-activity-time">{new Date(r.delivered_at).toLocaleDateString('en-GB')}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
