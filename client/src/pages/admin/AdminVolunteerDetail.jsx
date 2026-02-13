import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useAdminStore from '../../stores/useAdminStore';

export default function AdminVolunteerDetail() {
  const { id } = useParams();
  const { volunteerDetail, loadVolunteerDetail } = useAdminStore();

  useEffect(() => { loadVolunteerDetail(id); }, [id]);

  if (!volunteerDetail) return <div className="admin-page"><p>Loading...</p></div>;

  const { volunteer, completed, assigned, totals } = volunteerDetail;

  return (
    <div className="admin-page">
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/admin/volunteers" className="admin-back-link">&larr; All Volunteers</Link>
        <Link to="/" className="admin-back-link">&larr; Main App</Link>
        <a href="https://stephen8n.com" className="admin-back-link">&larr; stephen8n.com</a>
      </div>
      <h1 className="admin-page-title">{volunteer.name}</h1>
      {volunteer.notes && <p className="admin-subtitle">{volunteer.notes}</p>}
      <p className="admin-text-muted">Joined {new Date(volunteer.created_at).toLocaleDateString("en-GB")}</p>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-value">{totals.streets_completed}</div>
          <div className="admin-stat-label">Streets Completed</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{totals.houses_completed.toLocaleString()}</div>
          <div className="admin-stat-label">Houses Delivered</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{totals.streets_assigned}</div>
          <div className="admin-stat-label">Streets Assigned</div>
        </div>
      </div>

      <h2 className="admin-section-title">Completed Streets</h2>
      {completed.length === 0 ? (
        <p className="admin-empty">No completed streets yet</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Zone</th>
                <th>Street</th>
                <th>Houses</th>
                <th>Completed</th>
              </tr>
            </thead>
            <tbody>
              {completed.map(s => (
                <tr key={`c-${s.id}`}>
                  <td><span className="admin-zone-badge" style={{ background: s.zone_color }}>{s.zone_id}</span> {s.zone_name}</td>
                  <td>{s.name}</td>
                  <td>{s.house_count}</td>
                  <td>{new Date(s.completed_at).toLocaleDateString("en-GB")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {assigned.length > 0 && (
        <>
          <h2 className="admin-section-title">Assigned Streets</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Zone</th>
                  <th>Street</th>
                  <th>Houses</th>
                  <th>Assigned</th>
                </tr>
              </thead>
              <tbody>
                {assigned.map(s => (
                  <tr key={`a-${s.id}`}>
                    <td><span className="admin-zone-badge" style={{ background: s.zone_color }}>{s.zone_id}</span> {s.zone_name}</td>
                    <td>{s.name}</td>
                    <td>{s.house_count}</td>
                    <td>{new Date(s.assigned_at).toLocaleDateString("en-GB")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
