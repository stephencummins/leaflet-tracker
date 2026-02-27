import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import useAdminStore from '../../stores/useAdminStore';
import { adminApi } from '../../api/adminClient';
import { useState } from 'react';

const DEADLINE = new Date('2026-04-09T16:00:00');

function daysTo(date) {
  return Math.max(0, Math.ceil((date - new Date()) / 86400000));
}

const NAV_CARDS = [
  { to: '/admin/volunteers', icon: '\u{1F465}', label: 'Volunteers', desc: 'Manage registered volunteers' },
  { to: '/admin/streets', icon: '\u{1F3D8}', label: 'Streets', desc: 'Search, filter & manage streets' },
  { to: '/admin/walks', icon: '\u{1F6B6}', label: 'Walks', desc: 'Pre-planned delivery routes' },
  { to: '/admin/candidates', icon: '\u{1F5F3}', label: 'Candidates', desc: 'Nominations, packs & contacts' },
  { to: '/admin/canvassing', icon: '\u{1F5E3}', label: 'Canvassing', desc: 'Door-knocking tallies & casework' },
  { to: '/admin/canvassers', icon: '\u{1F4CB}', label: 'Canvassers', desc: 'Canvasser assignments' },
  { to: '/admin/map', icon: '\u{1F5FA}', label: 'Map', desc: 'Ward coverage map' },
  { to: '/admin/poster-boards', icon: '\u{1F4CC}', label: 'Poster Boards', desc: 'Poster board locations' },
];

export default function AdminOverview() {
  const { overview, loadOverview } = useAdminStore();
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    loadOverview();
    adminApi.getCandidates().then(setCandidates).catch(() => {});
  }, []);

  const days = daysTo(DEADLINE);

  const candStats = useMemo(() => {
    const total = candidates.length;
    const submitted = candidates.filter(c => c.nomination_submitted).length;
    const confirmed = candidates.filter(c => c.confirmed).length;
    return { total, submitted, confirmed };
  }, [candidates]);

  const wardPercent = overview
    ? (overview.ward.total_houses ? Math.round((overview.ward.completed_houses / overview.ward.total_houses) * 100) : 0)
    : 0;

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Dashboard</h1>

      {/* Key stats */}
      <div className="admin-stats-grid" style={{ marginBottom: 28 }}>
        {overview && (
          <>
            <div className="admin-stat-card">
              <div className="admin-stat-value">{wardPercent}%</div>
              <div className="admin-stat-label">Leaflet Coverage</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-value">{overview.volunteerCount}</div>
              <div className="admin-stat-label">Volunteers</div>
            </div>
          </>
        )}
        <div className="admin-stat-card">
          <div className="admin-stat-value">{candStats.confirmed}/{candStats.total}</div>
          <div className="admin-stat-label">Candidates Confirmed</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{candStats.submitted}/{candStats.total}</div>
          <div className="admin-stat-label">Noms Submitted</div>
        </div>
        <div className={`admin-stat-card candidate-deadline-card ${days > 14 ? 'green' : days >= 7 ? 'amber' : 'red'}`}>
          <div className="admin-stat-value">{days} days</div>
          <div className="admin-stat-label">To Nomination Deadline</div>
        </div>
      </div>

      {/* Navigation cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 14,
        marginBottom: 28,
      }}>
        {NAV_CARDS.map(card => (
          <Link
            key={card.to}
            to={card.to}
            className="admin-card"
            style={{
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
              textDecoration: 'none',
              color: 'inherit',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
          >
            <span style={{ fontSize: '1.6rem', lineHeight: 1, flexShrink: 0 }}>{card.icon}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy)', marginBottom: 3 }}>
                {card.label}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {card.desc}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Zone progress table */}
      {overview && (
        <>
          <h2 className="admin-section-title">Leaflet Progress by Zone</h2>
          {Object.entries(
            overview.zones.reduce((acc, z) => {
              const w = z.ward || 'Other';
              if (!acc[w]) acc[w] = [];
              acc[w].push(z);
              return acc;
            }, {})
          ).map(([wardName, wardZones]) => (
            <div key={wardName}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', margin: '16px 0 8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{wardName}</h3>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr><th>Zone</th><th>Streets</th><th>Houses</th><th>Progress</th></tr>
                  </thead>
                  <tbody>
                    {wardZones.map(z => {
                      const pct = z.total_houses ? Math.round((z.completed_houses / z.total_houses) * 100) : 0;
                      return (
                        <tr key={z.id}>
                          <td>
                            <span className="admin-zone-badge" style={{ background: z.color }}>{z.id}</span>
                            {z.name}
                          </td>
                          <td>{z.completed_streets}/{z.total_streets}</td>
                          <td>{z.completed_houses?.toLocaleString()}/{z.total_houses?.toLocaleString()}</td>
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
            </div>
          ))}

          <h2 className="admin-section-title" style={{ marginTop: 28 }}>Recent Activity</h2>
          <div className="admin-activity-list">
            {overview.recent.map(r => (
              <div key={r.id} className="admin-activity-item">
                <span className="admin-zone-badge" style={{ background: r.zone_color }}>{r.zone_id}</span>
                <span className="admin-activity-street">{r.street_name}</span>
                <span className="admin-activity-vol">{r.volunteer_name}</span>
                <span className="admin-activity-houses">{r.house_count} houses</span>
                <span className="admin-activity-time">{new Date(r.delivered_at).toLocaleDateString("en-GB")}</span>
              </div>
            ))}
            {overview.recent.length === 0 && <p className="admin-empty">No activity yet</p>}
          </div>
        </>
      )}
    </div>
  );
}
