import { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminClient';

export default function AdminCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [editing, setEditing] = useState({});
  const [saving, setSaving] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminApi.getCandidates().then(setCandidates).catch(() => setError('Failed to load candidates'));
  }, []);

  const startEdit = (c) => {
    setEditing(prev => ({ ...prev, [c.id]: { ward: c.ward, candidate_name: c.candidate_name, is_paper: c.is_paper, confirmed: c.confirmed } }));
  };

  const cancelEdit = (id) => {
    setEditing(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  const save = async (id) => {
    setSaving(id);
    try {
      const updated = await adminApi.updateCandidate(id, editing[id]);
      setCandidates(prev => prev.map(c => c.id === id ? updated : c));
      cancelEdit(id);
    } catch {
      setError('Failed to save');
    } finally {
      setSaving(null);
    }
  };

  const hasNonPaper = candidates.some(c => !c.is_paper);

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Candidates</h1>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ward</th>
              <th>Candidate</th>
              <th style={{ width: 90, textAlign: 'center' }}>Confirmed</th>
              <th style={{ width: 120 }}></th>
            </tr>
          </thead>
          <tbody>
            {candidates.map(c => {
              const isEditing = !!editing[c.id];
              const vals = editing[c.id] || {};
              return (
                <tr key={c.id}>
                  <td>
                    {isEditing
                      ? <input
                          className="admin-input"
                          value={vals.ward}
                          onChange={e => setEditing(prev => ({ ...prev, [c.id]: { ...prev[c.id], ward: e.target.value } }))}
                        />
                      : <span style={{ fontWeight: 600 }}>{c.ward}</span>
                    }
                  </td>
                  <td>
                    {isEditing ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <input
                          className="admin-input"
                          value={vals.candidate_name}
                          placeholder="TBC"
                          onChange={e => setEditing(prev => ({ ...prev, [c.id]: { ...prev[c.id], candidate_name: e.target.value } }))}
                          onKeyDown={e => e.key === 'Enter' && save(c.id)}
                        />
                        <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={!vals.is_paper}
                            onChange={e => setEditing(prev => ({ ...prev, [c.id]: { ...prev[c.id], is_paper: e.target.checked ? 0 : 1 } }))}
                          />
                          Real candidate
                        </label>
                      </div>
                    ) : (
                      <span style={{ color: c.candidate_name ? 'var(--navy)' : 'var(--text-muted)' }}>
                        {c.candidate_name || '???'}{!c.is_paper ? '*' : ''}
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={isEditing ? !!vals.confirmed : !!c.confirmed}
                      onChange={isEditing
                        ? e => setEditing(prev => ({ ...prev, [c.id]: { ...prev[c.id], confirmed: e.target.checked ? 1 : 0 } }))
                        : async (e) => {
                            try {
                              const updated = await adminApi.updateCandidate(c.id, { ...c, confirmed: e.target.checked ? 1 : 0 });
                              setCandidates(prev => prev.map(x => x.id === c.id ? updated : x));
                            } catch { setError('Failed to save'); }
                          }
                      }
                    />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button
                          className="admin-btn admin-btn-sm admin-btn-primary"
                          onClick={() => save(c.id)}
                          disabled={saving === c.id}
                        >
                          {saving === c.id ? 'Saving…' : 'Save'}
                        </button>
                        <button className="admin-btn admin-btn-sm" onClick={() => cancelEdit(c.id)}>
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button className="admin-btn admin-btn-sm" onClick={() => startEdit(c)}>
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {hasNonPaper && (
          <p style={{ marginTop: 12, fontSize: '0.78rem', color: 'var(--text-muted)', paddingLeft: 4 }}>
            * Not a paper candidate
          </p>
        )}
      </div>
    </div>
  );
}
