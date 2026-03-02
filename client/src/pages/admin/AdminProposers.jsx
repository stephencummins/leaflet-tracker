import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import proposersData from '../../data/proposers.json';

const COLUMNS = [
  { key: 'ward', label: 'Ward' },
  { key: 'type', label: 'Type' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'firstName', label: 'First Name' },
  { key: 'address', label: 'Address' },
  { key: 'postcode', label: 'Postcode' },
  { key: 'phone', label: 'Phone' },
  { key: 'email', label: 'Email' },
  { key: 'electorNumber', label: 'Elector #' },
];

export default function AdminProposers() {
  const [sortKey, setSortKey] = useState('ward');
  const [sortAsc, setSortAsc] = useState(true);
  const [wardFilter, setWardFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');

  const wards = useMemo(() => [...new Set(proposersData.map(r => r.ward))].sort(), []);
  const types = useMemo(() => [...new Set(proposersData.map(r => r.type))].sort(), []);

  const filtered = useMemo(() => {
    let rows = proposersData;
    if (wardFilter) rows = rows.filter(r => r.ward === wardFilter);
    if (typeFilter) rows = rows.filter(r => r.type === typeFilter);
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(r =>
        r.firstName.toLowerCase().includes(q) ||
        r.lastName.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q) ||
        r.postcode.toLowerCase().includes(q) ||
        (r.email && r.email.toLowerCase().includes(q))
      );
    }
    return rows;
  }, [wardFilter, typeFilter, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = (a[sortKey] || '').toLowerCase();
      const bv = (b[sortKey] || '').toLowerCase();
      if (av < bv) return sortAsc ? -1 : 1;
      if (av > bv) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortAsc]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

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
        <input
          className="admin-input"
          type="text"
          placeholder="Search name, address, postcode..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 180 }}
        />
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {sorted.length} of {proposersData.length}
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
            {sorted.map((r, i) => (
              <tr key={i}>
                <td style={{ whiteSpace: 'nowrap' }}>{r.ward}</td>
                <td style={{ whiteSpace: 'nowrap', fontSize: '0.78rem' }}>{r.type}</td>
                <td style={{ fontWeight: 600 }}>{r.lastName}</td>
                <td>{r.firstName}</td>
                <td style={{ fontSize: '0.78rem' }}>{r.address}{r.city ? `, ${r.city}` : ''}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{r.postcode}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{r.phone ? <a href={`tel:${r.phone}`}>{r.phone}</a> : ''}</td>
                <td>{r.email ? <a href={`mailto:${r.email}`} style={{ fontSize: '0.78rem' }}>{r.email}</a> : ''}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{r.electorNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
