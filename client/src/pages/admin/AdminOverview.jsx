import { useEffect } from 'react';
import useAdminStore from '../../stores/useAdminStore';

export default function AdminOverview() {
  const { overview, loadOverview } = useAdminStore();

  useEffect(() => { loadOverview(); }, []);

  if (!overview) return <div className="admin-page"><p>Loading...</p></div>;

  const { ward, zones, volunteerCount, recent } = overview;
  const wardPercent = ward.total_houses ? Math.round((ward.completed_houses / ward.total_houses) * 100) : 0;

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Overview</h1>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-value">{ward.completed_streets}/{ward.total_streets}</div>
          <div className="admin-stat-label">Streets Completed</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{ward.completed_houses?.toLocaleString()}/{ward.total_houses?.toLocaleString()}</div>
          <div className="admin-stat-label">Houses Covered</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{wardPercent}%</div>
          <div className="admin-stat-label">Ward Progress</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{volunteerCount}</div>
          <div className="admin-stat-label">Volunteers</div>
        </div>
      </div>

      {Object.entries(
        zones.reduce((acc, z) => {
          const w = z.ward || 'Other';
          if (!acc[w]) acc[w] = [];
          acc[w].push(z);
          return acc;
        }, {})
      ).map(([wardName, wardZones]) => (
        <div key={wardName}>
          <h2 className="admin-section-title">{wardName}</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Zone</th>
                  <th>Streets</th>
                  <th>Houses</th>
                  <th>Progress</th>
                </tr>
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

      <h2 className="admin-section-title">Recent Activity</h2>
      <div className="admin-activity-list">
        {recent.map(r => (
          <div key={r.id} className="admin-activity-item">
            <span className="admin-zone-badge" style={{ background: r.zone_color }}>{r.zone_id}</span>
            <span className="admin-activity-street">{r.street_name}</span>
            <span className="admin-activity-vol">{r.volunteer_name}</span>
            <span className="admin-activity-houses">{r.house_count} houses</span>
            <span className="admin-activity-time">{new Date(r.delivered_at).toLocaleDateString("en-GB")}</span>
          </div>
        ))}
        {recent.length === 0 && <p className="admin-empty">No activity yet</p>}
      </div>
    </div>
  );
}
