import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAdminStore from '../../stores/useAdminStore';

export default function AdminVolunteers() {
  const { volunteers, loadVolunteers, updateVolunteer, deleteVolunteer } = useAdminStore();
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editNotes, setEditNotes] = useState('');

  useEffect(() => { loadVolunteers(); }, []);

  const startEdit = (v) => {
    setEditingId(v.id);
    setEditName(v.name);
    setEditNotes(v.notes || '');
  };

  const saveEdit = async () => {
    await updateVolunteer(editingId, { name: editName, notes: editNotes });
    setEditingId(null);
  };

  const handleDelete = async (v) => {
    if (!window.confirm(`Delete volunteer "${v.name}"? This will remove their assignments and delivery history.`)) return;
    await deleteVolunteer(v.id);
  };

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Volunteers</h1>
      <p className="admin-subtitle">{volunteers.length} total volunteers</p>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Streets</th>
              <th>Houses</th>
              <th>Zones</th>
              <th>Assigned</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {volunteers.map(v => (
              <tr key={v.id}>
                <td>
                  {editingId === v.id ? (
                    <input
                      className="admin-input"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && saveEdit()}
                    />
                  ) : (
                    <Link to={`/admin/volunteers/${v.id}`}><strong>{v.name}</strong></Link>
                  )}
                </td>
                <td>{v.streets_delivered}</td>
                <td>{v.houses_delivered?.toLocaleString()}</td>
                <td>{v.zones_delivered}</td>
                <td>{v.active_assignments}</td>
                <td>
                  {editingId === v.id ? (
                    <input
                      className="admin-input"
                      value={editNotes}
                      onChange={e => setEditNotes(e.target.value)}
                      placeholder="Notes..."
                      onKeyDown={e => e.key === 'Enter' && saveEdit()}
                    />
                  ) : (
                    <span className="admin-text-muted">{v.notes || '—'}</span>
                  )}
                </td>
                <td className="admin-actions">
                  {editingId === v.id ? (
                    <>
                      <button className="admin-btn admin-btn-sm admin-btn-primary" onClick={saveEdit}>Save</button>
                      <button className="admin-btn admin-btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="admin-btn admin-btn-sm" onClick={() => startEdit(v)}>Edit</button>
                      <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => handleDelete(v)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
