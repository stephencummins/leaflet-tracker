import { useEffect, useState, useMemo, useRef } from 'react';
import { adminApi } from '../../api/adminClient';

const CATEGORIES = [
  { value: 'printing', label: 'Printing' },
  { value: 'postage', label: 'Postage' },
  { value: 'advertising', label: 'Advertising' },
  { value: 'stationery', label: 'Stationery' },
  { value: 'travel', label: 'Travel' },
  { value: 'room_hire', label: 'Room hire' },
  { value: 'other', label: 'Other' },
];

const ELECTION_DAY = new Date('2026-05-07');

function fmt(n) {
  return n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' });
}

function spendPct(spent, max) {
  if (!max) return 0;
  return Math.min(100, Math.round((spent / max) * 100));
}

// Inline editable cell — commits on blur or Enter
function EditCell({ value, type = 'number', step, min, onSave, style }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef(null);

  useEffect(() => { setDraft(value); }, [value]);
  useEffect(() => { if (editing && ref.current) ref.current.select(); }, [editing]);

  const commit = () => {
    setEditing(false);
    const parsed = type === 'number' ? (parseFloat(draft) || 0) : draft;
    if (parsed !== value) onSave(parsed);
  };

  if (!editing) {
    return (
      <span
        onClick={() => setEditing(true)}
        style={{ cursor: 'pointer', display: 'block', padding: '2px 4px', borderRadius: 3, ...style }}
        className="editable-cell"
      >
        {type === 'number' && typeof value === 'number'
          ? (step && step < 1 ? fmt(value) : (value || '—'))
          : (value || '—')}
      </span>
    );
  }

  return (
    <input
      ref={ref}
      className="admin-input"
      type={type}
      step={step}
      min={min}
      value={draft}
      onChange={e => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setDraft(value); setEditing(false); } }}
      style={{ width: '100%', fontSize: '0.82rem', padding: '3px 6px', textAlign: style?.textAlign || 'left' }}
    />
  );
}

export default function AdminExpenses() {
  const [wards, setWards] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [tab, setTab] = useState('summary');
  const [newItem, setNewItem] = useState({ ward_id: '', description: '', amount: '', category: 'printing', date: '', receipt_ref: '' });
  const [error, setError] = useState(null);

  const load = () => {
    adminApi.getExpenses().then(setWards).catch(() => setError('Failed to load expenses'));
    adminApi.getCandidates().then(setCandidates).catch(() => {});
  };

  useEffect(load, []);

  const candidateByWard = useMemo(() => {
    const map = {};
    candidates.forEach(c => { map[c.ward] = c.candidate_name || ''; });
    return map;
  }, [candidates]);

  const stats = useMemo(() => {
    const totalSpent = wards.reduce((s, w) => s + w.total_spent, 0);
    const totalMax = wards.reduce((s, w) => s + w.legal_max, 0);
    const totalBudget = wards.reduce((s, w) => s + w.budgeted_spend, 0);
    const totalElectors = wards.reduce((s, w) => s + w.elector_count, 0);
    const daysToElection = Math.max(0, Math.ceil((ELECTION_DAY - new Date()) / 86400000));
    const totalItems = wards.reduce((s, w) => s + (w.items?.length || 0), 0);
    return { totalSpent, totalMax, totalBudget, totalElectors, daysToElection, total: wards.length, totalItems };
  }, [wards]);

  const allItems = useMemo(() => {
    return wards.flatMap(w => (w.items || []).map(i => ({ ...i, ward_name: w.ward })))
      .sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.id - a.id);
  }, [wards]);

  const saveField = async (wardId, field, value) => {
    try {
      await adminApi.updateExpense(wardId, { [field]: value });
      load();
    } catch {
      setError('Failed to save');
    }
  };

  const addItem = async () => {
    if (!newItem.description || !newItem.ward_id) return;
    try {
      await adminApi.addExpenseItem(newItem.ward_id, {
        description: newItem.description,
        amount: parseFloat(newItem.amount) || 0,
        category: newItem.category,
        date: newItem.date,
        receipt_ref: newItem.receipt_ref,
      });
      setNewItem(p => ({ ...p, description: '', amount: '', receipt_ref: '' }));
      load();
    } catch {
      setError('Failed to add item');
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await adminApi.deleteExpenseItem(itemId);
      load();
    } catch {
      setError('Failed to delete');
    }
  };

  const electionUrgency = stats.daysToElection > 30 ? 'green' : stats.daysToElection > 14 ? 'amber' : 'red';

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Election Expenses</h1>
      </div>

      {error && (
        <div className="admin-error" style={{ color: 'var(--danger)', marginBottom: 12, fontSize: '0.85rem' }}>
          {error}{' '}
          <button onClick={() => setError(null)} style={{ marginLeft: 8, textDecoration: 'underline', color: 'var(--text-muted)' }}>dismiss</button>
        </div>
      )}

      {/* Reference Panel */}
      <div className="postal-info-panel">
        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '0.9rem', color: 'var(--navy)', marginBottom: 10 }}>
          Spending Limits &amp; Reporting
        </h3>
        <div className="postal-dates-list">
          <span><strong>Formula</strong> Base ({fmt(960)}) + {fmt(0.08)} per elector per seat</span>
          <span><strong>Period</strong> From candidate selection to polling day (7 May 2026)</span>
          <span><strong>Report</strong> Election Agent must submit return within 35 days of result</span>
        </div>
        <div className="postal-warning">
          Candidates and agents are personally liable for accurate expense returns. Keep all receipts and invoices. Failure to submit is a criminal offence.
        </div>
      </div>

      {/* Stats Bar */}
      <div className="admin-stats-grid" style={{ marginBottom: 24 }}>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{fmt(stats.totalSpent)}</div>
          <div className="admin-stat-label">Total Spent</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{fmt(stats.totalMax)}</div>
          <div className="admin-stat-label">Total Legal Max</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{fmt(stats.totalBudget)}</div>
          <div className="admin-stat-label">Total Budgeted</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.totalElectors.toLocaleString()}</div>
          <div className="admin-stat-label">Total Electors</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.totalItems}</div>
          <div className="admin-stat-label">Expense Items</div>
        </div>
        <div className={`admin-stat-card candidate-deadline-card ${electionUrgency}`}>
          <div className="admin-stat-value">{stats.daysToElection} days</div>
          <div className="admin-stat-label">To Polling Day</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 0 }}>
        {[
          { key: 'summary', label: 'Summary' },
          { key: 'items', label: `Expense Items (${stats.totalItems})` },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '10px 20px',
              background: tab === t.key ? 'var(--card)' : 'var(--bg)',
              color: tab === t.key ? 'var(--navy)' : 'var(--text-muted)',
              border: `1px solid ${tab === t.key ? 'var(--border)' : 'var(--border-light)'}`,
              borderBottom: tab === t.key ? '1px solid var(--card)' : '1px solid var(--border)',
              borderRadius: '6px 6px 0 0',
              cursor: 'pointer',
              marginBottom: -1,
              position: 'relative',
              zIndex: tab === t.key ? 1 : 0,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ===== SUMMARY TAB ===== */}
      {tab === 'summary' && (
        <div className="admin-card" style={{ padding: 0, overflow: 'auto', borderTopLeftRadius: 0 }}>
          <table className="admin-table candidate-table" style={{ fontSize: '0.82rem' }}>
            <thead>
              <tr>
                <th style={{ minWidth: 120 }}>Ward Name</th>
                <th style={{ minWidth: 110 }}>Candidate</th>
                <th style={{ width: 90, textAlign: 'right' }}>Electors</th>
                <th style={{ width: 85, textAlign: 'right' }}>Base Amt</th>
                <th style={{ width: 70, textAlign: 'right' }}>Per Elec</th>
                <th style={{ width: 55, textAlign: 'center' }}>Seats</th>
                <th style={{ width: 100, textAlign: 'right' }}>Legal Max</th>
                <th style={{ width: 100, textAlign: 'right' }}>Budgeted</th>
                <th style={{ width: 90, textAlign: 'right' }}>Total Spent</th>
                <th style={{ width: 100, textAlign: 'right' }}>Avail (Max)</th>
                <th style={{ width: 100, textAlign: 'right' }}>Avail (Budget)</th>
              </tr>
            </thead>
            <tbody>
              {wards.map(w => {
                const availMax = w.legal_max - w.total_spent;
                const availBudget = w.budgeted_spend - w.total_spent;

                return (
                  <tr key={w.id}>
                    <td style={{ fontWeight: 600 }}>{w.ward}</td>
                    <td style={{ color: candidateByWard[w.ward] ? 'var(--navy)' : 'var(--text-muted)' }}>
                      {candidateByWard[w.ward] || '—'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <EditCell
                        value={w.elector_count}
                        min={0}
                        onSave={v => saveField(w.id, 'elector_count', v)}
                        style={{ textAlign: 'right' }}
                      />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <EditCell
                        value={w.base_amount}
                        step={0.01}
                        min={0}
                        onSave={v => saveField(w.id, 'base_amount', v)}
                        style={{ textAlign: 'right' }}
                      />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <EditCell
                        value={w.per_elector_rate}
                        step={0.01}
                        min={0}
                        onSave={v => saveField(w.id, 'per_elector_rate', v)}
                        style={{ textAlign: 'right' }}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <EditCell
                        value={w.seats_up}
                        min={1}
                        onSave={v => saveField(w.id, 'seats_up', v)}
                        style={{ textAlign: 'center' }}
                      />
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{fmt(w.legal_max)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <EditCell
                        value={w.budgeted_spend}
                        step={0.01}
                        min={0}
                        onSave={v => saveField(w.id, 'budgeted_spend', v)}
                        style={{ textAlign: 'right' }}
                      />
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: w.total_spent > 0 ? 'var(--navy)' : 'var(--text-muted)' }}>
                      {w.total_spent > 0 ? fmt(w.total_spent) : '—'}
                    </td>
                    <td style={{ textAlign: 'right', color: availMax < 0 ? 'var(--danger, #8B2635)' : 'var(--navy)' }}>
                      {fmt(availMax)}
                    </td>
                    <td style={{ textAlign: 'right', color: w.budgeted_spend ? (availBudget < 0 ? 'var(--danger, #8B2635)' : 'var(--text)') : 'var(--text-muted)' }}>
                      {w.budgeted_spend ? fmt(availBudget) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ fontWeight: 700, borderTop: '2px solid var(--border)' }}>
                <td colSpan={2} style={{ textAlign: 'right' }}>Totals</td>
                <td style={{ textAlign: 'right' }}>{stats.totalElectors.toLocaleString()}</td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: 'right' }}>{fmt(stats.totalMax)}</td>
                <td style={{ textAlign: 'right' }}>{fmt(stats.totalBudget)}</td>
                <td style={{ textAlign: 'right' }}>{fmt(stats.totalSpent)}</td>
                <td style={{ textAlign: 'right' }}>{fmt(stats.totalMax - stats.totalSpent)}</td>
                <td style={{ textAlign: 'right' }}>{stats.totalBudget ? fmt(stats.totalBudget - stats.totalSpent) : '—'}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* ===== EXPENSE ITEMS TAB ===== */}
      {tab === 'items' && (
        <div className="admin-card" style={{ padding: 0, overflow: 'auto', borderTopLeftRadius: 0 }}>
          {/* Add new item row */}
          <div style={{ padding: 16, borderBottom: '1px solid var(--border-light)', background: 'var(--bg)' }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: '1 1 140px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 3 }}>Ward</label>
                <select
                  className="admin-input"
                  value={newItem.ward_id}
                  onChange={e => setNewItem(p => ({ ...p, ward_id: e.target.value }))}
                  style={{ width: '100%' }}
                >
                  <option value="">Select ward...</option>
                  {wards.map(w => <option key={w.id} value={w.id}>{w.ward}</option>)}
                </select>
              </div>
              <div style={{ flex: '2 1 200px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 3 }}>Description</label>
                <input
                  className="admin-input"
                  value={newItem.description}
                  onChange={e => setNewItem(p => ({ ...p, description: e.target.value }))}
                  placeholder="e.g. 500 leaflets A5"
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ flex: '0 1 100px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 3 }}>Amount</label>
                <input
                  className="admin-input"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newItem.amount}
                  onChange={e => setNewItem(p => ({ ...p, amount: e.target.value }))}
                  placeholder="0.00"
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ flex: '0 1 110px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 3 }}>Category</label>
                <select
                  className="admin-input"
                  value={newItem.category}
                  onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))}
                  style={{ width: '100%' }}
                >
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div style={{ flex: '0 1 130px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 3 }}>Date</label>
                <input
                  className="admin-input"
                  type="date"
                  value={newItem.date}
                  onChange={e => setNewItem(p => ({ ...p, date: e.target.value }))}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ flex: '0 1 100px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 3 }}>Receipt ref</label>
                <input
                  className="admin-input"
                  value={newItem.receipt_ref}
                  onChange={e => setNewItem(p => ({ ...p, receipt_ref: e.target.value }))}
                  style={{ width: '100%' }}
                />
              </div>
              <button
                className="admin-btn admin-btn-primary"
                onClick={addItem}
                disabled={!newItem.description || !newItem.ward_id}
                style={{ whiteSpace: 'nowrap' }}
              >
                + Add
              </button>
            </div>
          </div>

          <table className="admin-table candidate-table" style={{ fontSize: '0.82rem' }}>
            <thead>
              <tr>
                <th style={{ minWidth: 100 }}>Ward</th>
                <th style={{ minWidth: 180 }}>Description</th>
                <th style={{ width: 90, textAlign: 'right' }}>Amount</th>
                <th style={{ width: 100 }}>Category</th>
                <th style={{ width: 100 }}>Date</th>
                <th style={{ width: 90 }}>Receipt</th>
                <th style={{ width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {allItems.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>
                    No expense items recorded yet. Use the form above to add one.
                  </td>
                </tr>
              ) : allItems.map(item => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 500 }}>{item.ward_name}</td>
                  <td>{item.description}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>{fmt(item.amount)}</td>
                  <td style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                    {CATEGORIES.find(c => c.value === item.category)?.label || item.category}
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{item.date || '—'}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{item.receipt_ref || '—'}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => deleteItem(item.id)}
                      style={{
                        background: 'none', border: 'none', color: 'var(--danger, #8B2635)',
                        cursor: 'pointer', fontSize: '1rem', padding: '2px 6px',
                      }}
                      title="Delete"
                    >
                      &times;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            {allItems.length > 0 && (
              <tfoot>
                <tr style={{ fontWeight: 700, borderTop: '2px solid var(--border)' }}>
                  <td>Total</td>
                  <td>{allItems.length} items</td>
                  <td style={{ textAlign: 'right' }}>{fmt(allItems.reduce((s, i) => s + i.amount, 0))}</td>
                  <td colSpan={4}></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}

      <style>{`
        .editable-cell:hover {
          background: var(--cream-light, #f8f6f0);
          outline: 1px dashed var(--border, #D8CFC0);
        }
      `}</style>
    </div>
  );
}
