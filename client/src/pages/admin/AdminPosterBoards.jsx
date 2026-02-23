import { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminClient';

const AREAS = ['Eastwood Park', 'CPW', 'Belfairs', 'Leigh', 'West Leigh', 'Whitehouse Meadows'];
const STATUSES = ['pending', 'placed', 'confirmed', 'collected'];

const STATUS_STYLE = {
  pending:   { background: '#f3f4f6', color: '#4b5563' },
  placed:    { background: '#fef3c7', color: '#92400e' },
  confirmed: { background: '#d1fae5', color: '#065f46' },
  collected: { background: '#dbeafe', color: '#1e40af' },
};

const EMPTY_FORM = { area: 'Eastwood Park', address: '', name: '', phone: '', email: '', notes: '', status: 'pending' };

function StatusBadge({ status, onClick }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.pending;
  return (
    <button
      onClick={onClick}
      title="Click to cycle status"
      style={{
        ...s,
        border: 'none',
        borderRadius: 12,
        padding: '2px 10px',
        fontSize: '0.75rem',
        fontWeight: 700,
        cursor: 'pointer',
        textTransform: 'capitalize',
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </button>
  );
}

function BoardForm({ initial = EMPTY_FORM, onSave, onCancel, saving }) {
  const [form, setForm] = useState({ ...initial });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: 16, marginBottom: 8 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        <div style={{ gridColumn: '1/-1' }}>
          <label className="admin-label">Address *</label>
          <input className="admin-input" value={form.address} onChange={set('address')} placeholder="e.g. 36 Leighcliff Drive SS9 1AA" autoFocus />
        </div>
        <div>
          <label className="admin-label">Name *</label>
          <input className="admin-input" value={form.name} onChange={set('name')} placeholder="e.g. Mr & Mrs Jones" />
        </div>
        <div>
          <label className="admin-label">Area *</label>
          <select className="admin-input" value={form.area} onChange={set('area')}>
            {AREAS.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>
        <div>
          <label className="admin-label">Phone</label>
          <input className="admin-input" value={form.phone} onChange={set('phone')} placeholder="e.g. 01702 123456" />
        </div>
        <div>
          <label className="admin-label">Email</label>
          <input className="admin-input" type="email" value={form.email} onChange={set('email')} placeholder="e.g. name@example.com" />
        </div>
        <div>
          <label className="admin-label">Status</label>
          <select className="admin-input" value={form.status} onChange={set('status')}>
            {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
        <div style={{ gridColumn: '1/-1' }}>
          <label className="admin-label">Notes</label>
          <textarea className="admin-input" value={form.notes} onChange={set('notes')} rows={2} placeholder="Placement instructions, access notes, etc." style={{ resize: 'vertical' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          className="admin-btn admin-btn-primary admin-btn-sm"
          onClick={() => onSave(form)}
          disabled={saving || !form.address.trim() || !form.name.trim()}
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button className="admin-btn admin-btn-sm" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

export default function AdminPosterBoards() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterArea, setFilterArea] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const [addingNew, setAddingNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [collapsed, setCollapsed] = useState({});

  useEffect(() => {
    adminApi.getPosterBoards()
      .then(setBoards)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const cycleStatus = async (board) => {
    const next = STATUSES[(STATUSES.indexOf(board.status) + 1) % STATUSES.length];
    try {
      const updated = await adminApi.updatePosterBoard(board.id, { status: next });
      setBoards(prev => prev.map(b => b.id === board.id ? updated : b));
    } catch (e) { setError(e.message); }
  };

  const saveEdit = async (id, form) => {
    setSaving(true);
    try {
      const updated = await adminApi.updatePosterBoard(id, form);
      setBoards(prev => prev.map(b => b.id === id ? updated : b));
      setEditingId(null);
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const saveNew = async (form) => {
    setSaving(true);
    try {
      const created = await adminApi.createPosterBoard(form);
      setBoards(prev => [...prev, created]);
      setAddingNew(false);
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const deleteBoard = async (id) => {
    try {
      await adminApi.deletePosterBoard(id);
      setBoards(prev => prev.filter(b => b.id !== id));
      setConfirmDelete(null);
    } catch (e) { setError(e.message); }
  };

  const filtered = boards.filter(b => {
    if (filterArea !== 'All' && b.area !== filterArea) return false;
    if (filterStatus !== 'All' && b.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      return b.address.toLowerCase().includes(q) || b.name.toLowerCase().includes(q) || b.notes.toLowerCase().includes(q);
    }
    return true;
  });

  const byArea = AREAS.map(area => ({ area, boards: filtered.filter(b => b.area === area) })).filter(g => g.boards.length > 0);

  const totals = { total: boards.length, placed: boards.filter(b => b.status === 'placed').length, confirmed: boards.filter(b => b.status === 'confirmed').length, collected: boards.filter(b => b.status === 'collected').length };

  if (loading) return <div className="admin-page-header"><p style={{ color: 'var(--text-muted)' }}>Loading…</p></div>;

  return (
    <div>
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 className="admin-page-title">Poster Boards</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 2 }}>
            {totals.total} sites &middot; <span style={{ color: '#92400e', fontWeight: 600 }}>{totals.placed} placed</span> &middot; <span style={{ color: '#065f46', fontWeight: 600 }}>{totals.confirmed} confirmed</span> &middot; <span style={{ color: '#1e40af', fontWeight: 600 }}>{totals.collected} collected</span>
          </p>
        </div>
        <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={() => setAddingNew(true)}>+ Add Site</button>
      </div>

      {error && <div className="admin-error" style={{ display: 'flex', justifyContent: 'space-between' }}>{error} <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>×</button></div>}

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          className="admin-input"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search address, name, notes…"
          style={{ flex: '1 1 200px', minWidth: 0 }}
        />
        <select className="admin-input" value={filterArea} onChange={e => setFilterArea(e.target.value)} style={{ flex: '0 0 auto' }}>
          <option value="All">All areas</option>
          {AREAS.map(a => <option key={a}>{a}</option>)}
        </select>
        <select className="admin-input" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ flex: '0 0 auto' }}>
          <option value="All">All statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {addingNew && (
        <div className="admin-card" style={{ marginBottom: 16 }}>
          <BoardForm onSave={saveNew} onCancel={() => setAddingNew(false)} saving={saving} />
        </div>
      )}

      {byArea.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '48px 0' }}>No sites match your filters</p>}

      {byArea.map(({ area, boards: areaBoards }) => {
        const placed = areaBoards.filter(b => b.status === 'placed').length;
        const confirmed = areaBoards.filter(b => b.status === 'confirmed').length;
        const collected = areaBoards.filter(b => b.status === 'collected').length;
        const isCollapsed = collapsed[area];

        return (
          <div key={area} className="admin-card" style={{ marginBottom: 12 }}>
            <button
              onClick={() => setCollapsed(c => ({ ...c, [area]: !c[area] }))}
              style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0 12px', textAlign: 'left' }}
            >
              <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: '1rem', color: 'var(--navy)' }}>{area}</span>
              <span style={{ marginLeft: 'auto', display: 'flex', gap: 8, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {confirmed > 0 && <span style={{ color: '#065f46', fontWeight: 600 }}>{confirmed} confirmed</span>}
                {placed > 0 && <span style={{ color: '#92400e', fontWeight: 600 }}>{placed} placed</span>}
                {collected > 0 && <span style={{ color: '#1e40af', fontWeight: 600 }}>{collected} collected</span>}
                <span>{areaBoards.length} sites</span>
                <span style={{ color: 'var(--text-muted)' }}>{isCollapsed ? '▶' : '▼'}</span>
              </span>
            </button>

            {!isCollapsed && (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Address</th>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Notes</th>
                    <th style={{ width: 100, textAlign: 'center' }}>Status</th>
                    <th style={{ width: 80 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {areaBoards.map(b => {
                    const isEditing = editingId === b.id;
                    const isConfirmingDelete = confirmDelete === b.id;

                    if (isEditing) {
                      return (
                        <tr key={b.id}>
                          <td colSpan={6} style={{ padding: 8 }}>
                            <BoardForm
                              initial={b}
                              onSave={(form) => saveEdit(b.id, form)}
                              onCancel={() => setEditingId(null)}
                              saving={saving}
                            />
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr key={b.id}>
                        <td style={{ fontWeight: 500 }}>{b.address}</td>
                        <td>{b.name}</td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {b.phone && <div>{b.phone}</div>}
                          {b.email && <div>{b.email}</div>}
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: 260 }}>{b.notes}</td>
                        <td style={{ textAlign: 'center' }}>
                          <StatusBadge status={b.status} onClick={() => cycleStatus(b)} />
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {isConfirmingDelete ? (
                            <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                              <button className="admin-btn admin-btn-sm" style={{ background: 'var(--rose)', color: '#fff', borderColor: 'var(--rose)' }} onClick={() => deleteBoard(b.id)}>Delete</button>
                              <button className="admin-btn admin-btn-sm" onClick={() => setConfirmDelete(null)}>Cancel</button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                              <button className="admin-btn admin-btn-sm" onClick={() => setEditingId(b.id)}>Edit</button>
                              <button className="admin-btn admin-btn-sm" onClick={() => setConfirmDelete(b.id)} style={{ color: 'var(--rose)' }}>✕</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        );
      })}
    </div>
  );
}
