import { useEffect, useState } from 'react';
import useAdminStore from '../../stores/useAdminStore';

const STATUS_LABELS = {
  confirmed: 'Confirmed',
  tbc: 'TBC',
  no_candidate: 'No Candidate',
};

const STATUS_COLORS = {
  confirmed: 'var(--success)',
  tbc: 'var(--cyan)',
  no_candidate: 'var(--danger)',
};

export default function AdminCandidates() {
  const { candidates, loadCandidates, updateCandidate } = useAdminStore();
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');

  useEffect(() => { loadCandidates(); }, []);

  const startEdit = (c) => {
    setEditingId(c.id);
    setEditName(c.candidate_name || '');
    setEditStatus(c.status);
    setEditNotes(c.notes || '');
  };

  const saveEdit = async () => {
    await updateCandidate(editingId, {
      candidate_name: editName,
      status: editStatus,
      notes: editNotes,
    });
    setEditingId(null);
  };

  const confirmed = candidates.filter(c => c.status === 'confirmed').length;
  const tbc = candidates.filter(c => c.status === 'tbc').length;
  const none = candidates.filter(c => c.status === 'no_candidate').length;

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Candidates</h1>

      <div className="admin-stats-grid" style={{ marginBottom: 24 }}>
        <div className="admin-stat-card">
          <div className="admin-stat-value" style={{ color: 'var(--success)' }}>{confirmed}</div>
          <div className="admin-stat-label">Confirmed</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value" style={{ color: 'var(--cyan)' }}>{tbc}</div>
          <div className="admin-stat-label">TBC</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value" style={{ color: 'var(--danger)' }}>{none}</div>
          <div className="admin-stat-label">No Candidate</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{candidates.length}</div>
          <div className="admin-stat-label">Total Wards</div>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ward</th>
              <th>Candidate</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map(c => (
              <tr key={c.id}>
                <td><strong>{c.ward}</strong></td>
                <td>
                  {editingId === c.id ? (
                    <input
                      className="admin-input"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      placeholder="Candidate name..."
                      onKeyDown={e => e.key === 'Enter' && saveEdit()}
                    />
                  ) : (
                    c.candidate_name || <span className="admin-text-muted">???</span>
                  )}
                </td>
                <td>
                  {editingId === c.id ? (
                    <select
                      className="admin-select admin-select-sm"
                      value={editStatus}
                      onChange={e => setEditStatus(e.target.value)}
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="tbc">TBC</option>
                      <option value="no_candidate">No Candidate</option>
                    </select>
                  ) : (
                    <span
                      className="admin-candidate-status"
                      style={{ background: STATUS_COLORS[c.status] }}
                    >
                      {STATUS_LABELS[c.status]}
                    </span>
                  )}
                </td>
                <td>
                  {editingId === c.id ? (
                    <input
                      className="admin-input"
                      value={editNotes}
                      onChange={e => setEditNotes(e.target.value)}
                      placeholder="Notes..."
                      onKeyDown={e => e.key === 'Enter' && saveEdit()}
                    />
                  ) : (
                    <span className="admin-text-muted">{c.notes || '—'}</span>
                  )}
                </td>
                <td className="admin-actions">
                  {editingId === c.id ? (
                    <>
                      <button className="admin-btn admin-btn-sm admin-btn-primary" onClick={saveEdit}>Save</button>
                      <button className="admin-btn admin-btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                    </>
                  ) : (
                    <button className="admin-btn admin-btn-sm" onClick={() => startEdit(c)}>Edit</button>
                  )}
                </td>
              </tr>
            ))}
            {candidates.length === 0 && (
              <tr><td colSpan="5" className="admin-empty">No candidates yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
