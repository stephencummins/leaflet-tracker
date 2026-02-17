import { useEffect, useState } from 'react';
import useAdminStore from '../../stores/useAdminStore';

export default function AdminStreets() {
  const {
    streets, zones, allVolunteers, selectedZone, setSelectedZone,
    loadStreets, updateStreet, completeStreet, uncompleteStreet, assignStreet, unassignStreet,
  } = useAdminStore();
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editHouseCount, setEditHouseCount] = useState('');
  const [completeVolId, setCompleteVolId] = useState({});

  useEffect(() => { loadStreets(selectedZone); }, [selectedZone]);

  const startEdit = (s) => {
    setEditingId(s.id);
    setEditName(s.name);
    setEditHouseCount(String(s.house_count));
  };

  const saveEdit = async () => {
    await updateStreet(editingId, { name: editName, house_count: parseInt(editHouseCount, 10) });
    setEditingId(null);
  };

  const handleComplete = async (s) => {
    const volId = completeVolId[s.id];
    if (!volId) return;
    await completeStreet(s.id, parseInt(volId, 10));
    setCompleteVolId(prev => ({ ...prev, [s.id]: '' }));
  };

  const handleAssign = async (streetId, volId) => {
    if (volId) {
      await assignStreet(streetId, parseInt(volId, 10));
    } else {
      await unassignStreet(streetId);
    }
  };

  const completed = streets.filter(s => s.is_complete);
  const incomplete = streets.filter(s => !s.is_complete);

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Streets</h1>

      <div className="admin-toolbar">
        <select
          className="admin-select"
          value={selectedZone}
          onChange={e => setSelectedZone(e.target.value)}
        >
          <option value="">All Zones</option>
          {Object.entries(
            zones.reduce((acc, z) => {
              const w = z.ward || 'Other';
              if (!acc[w]) acc[w] = [];
              acc[w].push(z);
              return acc;
            }, {})
          ).map(([wardName, wardZones]) => (
            <optgroup key={wardName} label={wardName}>
              {wardZones.map(z => (
                <option key={z.id} value={z.id}>{z.id} — {z.name}</option>
              ))}
            </optgroup>
          ))}
        </select>
        <span className="admin-subtitle">
          {incomplete.length} remaining, {completed.length} complete ({streets.length} total)
        </span>
        <a
          href={`/api/admin/export/streets.csv${selectedZone ? '?zone_id=' + selectedZone : ''}`}
          className="admin-btn admin-btn-sm"
          download
        >
          Export CSV
        </a>
      </div>

      <h2 className="admin-section-title">Incomplete ({incomplete.length})</h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Zone</th>
              <th>Street</th>
              <th>Houses</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {incomplete.map(s => (
              <tr key={s.id}>
                <td>
                  <span className="admin-zone-badge" style={{ background: s.zone_color }}>{s.zone_id}</span>
                </td>
                <td>
                  {editingId === s.id ? (
                    <input className="admin-input" value={editName} onChange={e => setEditName(e.target.value)} />
                  ) : s.name}
                </td>
                <td>
                  {editingId === s.id ? (
                    <input className="admin-input admin-input-sm" type="number" value={editHouseCount} onChange={e => setEditHouseCount(e.target.value)} />
                  ) : s.house_count}
                </td>
                <td>
                  <select
                    className="admin-select admin-select-sm"
                    value={s.assigned_volunteer_id || ''}
                    onChange={e => handleAssign(s.id, e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {allVolunteers.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </td>
                <td className="admin-actions">
                  {editingId === s.id ? (
                    <>
                      <button className="admin-btn admin-btn-sm admin-btn-primary" onClick={saveEdit}>Save</button>
                      <button className="admin-btn admin-btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="admin-btn admin-btn-sm" onClick={() => startEdit(s)}>Edit</button>
                      <div className="admin-complete-group">
                        <select
                          className="admin-select admin-select-sm"
                          value={completeVolId[s.id] || ''}
                          onChange={e => setCompleteVolId(prev => ({ ...prev, [s.id]: e.target.value }))}
                        >
                          <option value="">Volunteer...</option>
                          {allVolunteers.map(v => (
                            <option key={v.id} value={v.id}>{v.name}</option>
                          ))}
                        </select>
                        <button
                          className="admin-btn admin-btn-sm admin-btn-success"
                          onClick={() => handleComplete(s)}
                          disabled={!completeVolId[s.id]}
                        >
                          Complete
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {incomplete.length === 0 && (
              <tr><td colSpan="5" className="admin-empty">All streets complete!</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 className="admin-section-title">Completed ({completed.length})</h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Zone</th>
              <th>Street</th>
              <th>Houses</th>
              <th>Completed By</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {completed.map(s => (
              <tr key={s.id} className="admin-row-complete">
                <td>
                  <span className="admin-zone-badge" style={{ background: s.zone_color }}>{s.zone_id}</span>
                </td>
                <td>{s.name}</td>
                <td>{s.house_count}</td>
                <td>{s.completed_by_name || '—'}</td>
                <td>{s.completed_at ? new Date(s.completed_at).toLocaleDateString("en-GB") : '—'}</td>
                <td className="admin-actions">
                  <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => uncompleteStreet(s.id)}>
                    Uncomplete
                  </button>
                </td>
              </tr>
            ))}
            {completed.length === 0 && (
              <tr><td colSpan="6" className="admin-empty">No completed streets</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
