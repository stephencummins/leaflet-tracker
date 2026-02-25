import { useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function AdminCanvassing() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const d = await api.getCanvassingSummary();
      setData(d);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this casework entry?')) return;
    await api.deleteCasework(id);
    load();
  };

  if (error) return <div className="admin-error">{error}</div>;
  if (!data) return <div className="admin-loading"><div className="admin-loading-text">Loading...</div></div>;

  const { totals, groups, casework } = data;
  const total = totals.total_support + totals.total_against + totals.total_undecided + totals.total_not_home;

  return (
    <div className="admin-content">
      <h1 className="admin-title">Canvassing Overview</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Support', value: totals.total_support, color: '#10b981' },
          { label: 'Against', value: totals.total_against, color: '#ef4444' },
          { label: 'Undecided', value: totals.total_undecided, color: '#f59e0b' },
          { label: 'Not Home', value: totals.total_not_home, color: '#6b7280' },
          { label: 'Total', value: total, color: '#6366f1' },
          { label: 'Roads Done', value: `${totals.roads_done}/${totals.roads_total}`, color: '#10b981' },
        ].map(s => (
          <div key={s.label} style={{ background: 'white', borderRadius: 10, padding: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderTop: `3px solid ${s.color}` }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12, color: '#1f2937' }}>By Group</h2>
      <div style={{ overflowX: 'auto', marginBottom: 32 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#f9fafb', textAlign: 'left' }}>
              {['#', 'Group', 'Assignee', 'Wk', 'Done', 'For', 'Against', '?', 'NH'].map(h => (
                <th key={h} style={{ padding: '8px 10px', borderBottom: '1px solid #e5e7eb', color: '#374151', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map(g => (
              <tr key={g.number} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '8px 10px', color: '#6b7280' }}>{g.number}</td>
                <td style={{ padding: '8px 10px', fontWeight: 500 }}>{g.name}</td>
                <td style={{ padding: '8px 10px', color: '#6b7280' }}>{g.assignee}</td>
                <td style={{ padding: '8px 10px', color: '#6b7280' }}>{g.week}</td>
                <td style={{ padding: '8px 10px', color: '#10b981', fontWeight: 600 }}>{g.roads_done}/{g.road_count}</td>
                <td style={{ padding: '8px 10px', color: '#10b981' }}>{g.support}</td>
                <td style={{ padding: '8px 10px', color: '#ef4444' }}>{g.against}</td>
                <td style={{ padding: '8px 10px', color: '#f59e0b' }}>{g.undecided}</td>
                <td style={{ padding: '8px 10px', color: '#6b7280' }}>{g.not_home}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12, color: '#1f2937' }}>
        Casework ({casework.length})
      </h2>
      {casework.length === 0 ? (
        <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>No casework logged yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {casework.map(c => (
            <div key={c.id} style={{ background: 'white', borderRadius: 10, padding: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderLeft: '4px solid #6366f1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginBottom: 4 }}>
                    {c.group_name} → {c.road_name} · {c.volunteer_name} · {new Date(c.created_at).toLocaleDateString('en-GB')}
                  </div>
                  {c.resident_name && <div style={{ fontWeight: 600, color: '#1f2937', fontSize: '0.85rem' }}>{c.resident_name}</div>}
                  {c.address && <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>{c.address}</div>}
                  {c.contact && <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>{c.contact}</div>}
                  <div style={{ color: '#374151', fontSize: '0.85rem', marginTop: 4 }}>{c.issue}</div>
                </div>
                <button
                  onClick={() => handleDelete(c.id)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem', padding: '4px 8px', borderRadius: 6, marginLeft: 8 }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
