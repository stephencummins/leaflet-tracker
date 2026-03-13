import { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import proposersData from '../../data/proposers.json';

const COLUMNS = [
  { key: 'asked', label: 'Asked' },
  { key: 'ward', label: 'Ward' },
  { key: 'type', label: 'Type' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'firstName', label: 'First Name' },
  { key: 'address', label: 'Address' },
  { key: 'postcode', label: 'Postcode' },
  { key: 'phone', label: 'Phone' },
  { key: 'email', label: 'Email' },
  { key: 'electorNumber', label: 'Elector #' },
  { key: 'notes', label: 'Notes' },
];

function proposerKey(r) {
  return `${r.ward}::${r.lastName}::${r.firstName}::${r.electorNumber}`;
}

export default function AdminProposers() {
  const [sortKey, setSortKey] = useState('ward');
  const [sortAsc, setSortAsc] = useState(true);
  const [wardFilter, setWardFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [askedFilter, setAskedFilter] = useState('');
  const [search, setSearch] = useState('');
  const [tracking, setTracking] = useState({});
  const [editingNotes, setEditingNotes] = useState(null);
  const [notesDraft, setNotesDraft] = useState('');

  useEffect(() => {
    fetch('/api/admin/proposer-tracking')
      .then(r => r.json())
      .then(setTracking)
      .catch(() => {});
  }, []);

  const saveTracking = useCallback((key, data) => {
    setTracking(prev => ({ ...prev, [key]: data }));
    fetch(`/api/admin/proposer-tracking/${encodeURIComponent(key)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(() => {});
  }, []);

  const toggleAsked = useCallback((key) => {
    const current = tracking[key] || { asked: false, notes: '' };
    saveTracking(key, { ...current, asked: !current.asked });
  }, [tracking, saveTracking]);

  const saveNotes = useCallback((key) => {
    const current = tracking[key] || { asked: false, notes: '' };
    saveTracking(key, { ...current, notes: notesDraft });
    setEditingNotes(null);
  }, [tracking, notesDraft, saveTracking]);

  const wards = useMemo(() => [...new Set(proposersData.map(r => r.ward))].sort(), []);
  const types = useMemo(() => [...new Set(proposersData.map(r => r.type))].sort(), []);

  const filtered = useMemo(() => {
    let rows = proposersData;
    if (wardFilter) rows = rows.filter(r => r.ward === wardFilter);
    if (typeFilter) rows = rows.filter(r => r.type === typeFilter);
    if (askedFilter === 'yes') rows = rows.filter(r => tracking[proposerKey(r)]?.asked);
    if (askedFilter === 'no') rows = rows.filter(r => !tracking[proposerKey(r)]?.asked);
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(r =>
        r.firstName.toLowerCase().includes(q) ||
        r.lastName.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q) ||
        r.postcode.toLowerCase().includes(q) ||
        (r.email && r.email.toLowerCase().includes(q)) ||
        (tracking[proposerKey(r)]?.notes || '').toLowerCase().includes(q)
      );
    }
    return rows;
  }, [wardFilter, typeFilter, askedFilter, search, tracking]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortKey === 'asked') {
        const av = tracking[proposerKey(a)]?.asked ? 1 : 0;
        const bv = tracking[proposerKey(b)]?.asked ? 1 : 0;
        return sortAsc ? av - bv : bv - av;
      }
      if (sortKey === 'notes') {
        const av = (tracking[proposerKey(a)]?.notes || '').toLowerCase();
        const bv = (tracking[proposerKey(b)]?.notes || '').toLowerCase();
        if (av < bv) return sortAsc ? -1 : 1;
        if (av > bv) return sortAsc ? 1 : -1;
        return 0;
      }
      const av = (a[sortKey] || '').toLowerCase();
      const bv = (b[sortKey] || '').toLowerCase();
      if (av < bv) return sortAsc ? -1 : 1;
      if (av > bv) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortAsc, tracking]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const askedCount = useMemo(() => {
    return proposersData.filter(r => tracking[proposerKey(r)]?.asked).length;
  }, [tracking]);

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Proposers &amp; Seconders</h1>
        <Link
          to="/admin/candidates"
          style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'underline' }}
        >
          Back to Candidates
        </Link>
      </div>

      <div className="admin-card" style={{ padding: '12px 14px', marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <select className="admin-input" value={wardFilter} onChange={e => setWardFilter(e.target.value)} style={{ width: 'auto', minWidth: 140 }}>
          <option value="">All Wards</option>
          {wards.map(w => <option key={w} value={w}>{w}</option>)}
        </select>
        <select className="admin-input" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ width: 'auto', minWidth: 140 }}>
          <option value="">All Types</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="admin-input" value={askedFilter} onChange={e => setAskedFilter(e.target.value)} style={{ width: 'auto', minWidth: 120 }}>
          <option value="">All (Asked)</option>
          <option value="yes">Asked</option>
          <option value="no">Not Asked</option>
        </select>
        <input
          className="admin-input"
          type="text"
          placeholder="Search name, address, postcode, notes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 180 }}
        />
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {sorted.length} of {proposersData.length} &middot; {askedCount} asked
        </span>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'auto' }}>
        <table className="admin-table" style={{ fontSize: '0.82rem' }}>
          <thead>
            <tr>
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  style={{ cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none' }}
                >
                  {col.label}
                  {sortKey === col.key ? (sortAsc ? ' \u25B2' : ' \u25BC') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => {
              const key = proposerKey(r);
              const t = tracking[key] || { asked: false, notes: '' };
              return (
                <tr key={i} style={t.asked ? { opacity: 0.6 } : undefined}>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={t.asked}
                      onChange={() => toggleAsked(key)}
                      style={{ cursor: 'pointer', width: 16, height: 16 }}
                    />
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{r.ward}</td>
                  <td style={{ whiteSpace: 'nowrap', fontSize: '0.78rem' }}>{r.type}</td>
                  <td style={{ fontWeight: 600 }}>{r.lastName}</td>
                  <td>{r.firstName}</td>
                  <td style={{ fontSize: '0.78rem' }}>{r.address}{r.city ? `, ${r.city}` : ''}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{r.postcode}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{r.phone ? <a href={`tel:${r.phone}`}>{r.phone}</a> : ''}</td>
                  <td>{r.email ? <a href={`mailto:${r.email}`} style={{ fontSize: '0.78rem' }}>{r.email}</a> : ''}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{r.electorNumber}</td>
                  <td style={{ minWidth: 150 }}>
                    {editingNotes === key ? (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <input
                          className="admin-input"
                          type="text"
                          value={notesDraft}
                          onChange={e => setNotesDraft(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') saveNotes(key); if (e.key === 'Escape') setEditingNotes(null); }}
                          autoFocus
                          style={{ flex: 1, fontSize: '0.78rem', padding: '2px 6px' }}
                        />
                        <button onClick={() => saveNotes(key)} style={{ fontSize: '0.72rem', padding: '2px 6px', cursor: 'pointer' }}>Save</button>
                      </div>
                    ) : (
                      <span
                        onClick={() => { setEditingNotes(key); setNotesDraft(t.notes); }}
                        style={{ cursor: 'pointer', fontSize: '0.78rem', color: t.notes ? 'inherit' : 'var(--text-muted)', fontStyle: t.notes ? 'normal' : 'italic' }}
                      >
                        {t.notes || 'Add note...'}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
