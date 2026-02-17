import { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminClient';
import useAdminStore from '../../stores/useAdminStore';

export default function AdminWalks() {
  const { zones, allVolunteers, loadStreets, streets } = useAdminStore();
  const [walks, setWalks] = useState([]);
  const [selectedZone, setSelectedZone] = useState('');
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', street_ids: [] });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadWalks = async () => {
    const data = await adminApi.getWalks();
    setWalks(data);
  };

  useEffect(() => { loadWalks(); }, []);
  useEffect(() => { if (selectedZone) loadStreets(selectedZone); }, [selectedZone]);

  const toggleStreet = (id) => {
    setForm(f => ({
      ...f,
      street_ids: f.street_ids.includes(id)
        ? f.street_ids.filter(s => s !== id)
        : [...f.street_ids, id],
    }));
  };

  const selectedHouses = streets
    .filter(s => form.street_ids.includes(s.id))
    .reduce((sum, s) => sum + s.house_count, 0);

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Name is required'); return; }
    if (form.street_ids.length === 0) { setError('Select at least one street'); return; }
    setSaving(true);
    setError('');
    try {
      await adminApi.createWalk(form);
      setForm({ name: '', description: '', street_ids: [] });
      setSelectedZone('');
      setCreating(false);
      await loadWalks();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this walk?')) return;
    await adminApi.deleteWalk(id);
    await loadWalks();
  };

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Walks</h1>

      <div className="admin-toolbar" style={{ marginBottom: 20 }}>
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => setCreating(c => !c)}
        >
          {creating ? 'Cancel' : '+ New Walk'}
        </button>
      </div>

      {/* New walk form */}
      {creating && (
        <div style={{
          background: 'white', border: '1px solid var(--border-light)',
          borderRadius: 10, padding: 20, marginBottom: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <h2 className="admin-section-title" style={{ marginBottom: 16 }}>Create Walk</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Walk Name *
              </label>
              <input
                className="admin-input"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. West Leigh South Loop"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Description (optional)
              </label>
              <input
                className="admin-input"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="e.g. Covers the marine parade area"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
            Add Streets — filter by zone:
          </label>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
            <select
              className="admin-select"
              value={selectedZone}
              onChange={e => setSelectedZone(e.target.value)}
            >
              <option value="">Select a zone...</option>
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
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {form.street_ids.length} streets · {selectedHouses} houses selected
            </span>
          </div>

          {selectedZone && streets.length > 0 && (
            <div style={{
              border: '1px solid var(--border-light)', borderRadius: 8,
              maxHeight: 280, overflowY: 'auto', marginBottom: 12,
            }}>
              {streets.map(s => (
                <label
                  key={s.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 14px', cursor: 'pointer',
                    borderBottom: '1px solid var(--border-light)',
                    background: form.street_ids.includes(s.id) ? '#f0faf4' : 'white',
                    transition: 'background 0.15s',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.street_ids.includes(s.id)}
                    onChange={() => toggleStreet(s.id)}
                    style={{ accentColor: 'var(--navy)', flexShrink: 0 }}
                  />
                  <span style={{ flex: 1, fontSize: '0.84rem', color: 'var(--navy)', fontWeight: 500 }}>
                    {s.name}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                    {s.house_count} houses
                  </span>
                  {s.is_complete ? (
                    <span style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: 600, flexShrink: 0 }}>✓ done</span>
                  ) : null}
                </label>
              ))}
            </div>
          )}

          {error && (
            <p style={{ color: 'var(--error)', fontSize: '0.82rem', marginBottom: 10 }}>{error}</p>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="admin-btn admin-btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Walk'}
            </button>
            <button className="admin-btn" onClick={() => setCreating(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Walks list */}
      {walks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
          No walks yet. Create one above.
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Streets</th>
                <th>Houses</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {walks.map(w => {
                const pct = w.street_count > 0 ? Math.round((w.completed_count / w.street_count) * 100) : 0;
                return (
                  <tr key={w.id}>
                    <td style={{ fontWeight: 600 }}>{w.name}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{w.description || '—'}</td>
                    <td>{w.street_count}</td>
                    <td>{w.house_count}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 6, background: 'var(--border-light)', borderRadius: 3, minWidth: 60 }}>
                          <div style={{
                            height: '100%', borderRadius: 3,
                            background: pct === 100 ? 'var(--success)' : 'var(--navy)',
                            width: `${pct}%`,
                          }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                          {pct}%
                        </span>
                      </div>
                    </td>
                    <td className="admin-actions">
                      <button
                        className="admin-btn admin-btn-sm admin-btn-danger"
                        onClick={() => handleDelete(w.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
