import { Fragment, useEffect, useState, useMemo } from 'react';
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

function spendClass(pct) {
  if (pct >= 90) return 'red';
  if (pct >= 70) return 'amber';
  return 'green';
}

export default function AdminExpenses() {
  const [wards, setWards] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [newItem, setNewItem] = useState({ description: '', amount: '', category: 'printing', date: '', receipt_ref: '' });
  const [saving, setSaving] = useState(false);
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
    const wardsWithElectors = wards.filter(w => w.elector_count > 0).length;
    const totalElectors = wards.reduce((s, w) => s + w.elector_count, 0);
    const daysToElection = Math.max(0, Math.ceil((ELECTION_DAY - new Date()) / 86400000));
    return { totalSpent, totalMax, totalBudget, wardsWithElectors, totalElectors, daysToElection, total: wards.length };
  }, [wards]);

  const toggleExpand = (w) => {
    if (expandedId === w.id) {
      setExpandedId(null);
      setEditData(null);
    } else {
      setExpandedId(w.id);
      setEditData({ ...w });
      setNewItem({ description: '', amount: '', category: 'printing', date: '', receipt_ref: '' });
    }
  };

  const saveWard = async () => {
    if (!editData) return;
    setSaving(true);
    try {
      await adminApi.updateExpense(editData.id, {
        elector_count: editData.elector_count,
        base_amount: editData.base_amount,
        per_elector_rate: editData.per_elector_rate,
        seats_up: editData.seats_up,
        budgeted_spend: editData.budgeted_spend,
        notes: editData.notes,
      });
      load();
    } catch {
      setError('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const addItem = async () => {
    if (!newItem.description || !expandedId) return;
    try {
      await adminApi.addExpenseItem(expandedId, {
        ...newItem,
        amount: parseFloat(newItem.amount) || 0,
      });
      setNewItem({ description: '', amount: '', category: 'printing', date: '', receipt_ref: '' });
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
          <span><strong>Singled-out spending on behalf of candidates counts towards their limit</strong></span>
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
          <div className="admin-stat-value">{stats.wardsWithElectors}/{stats.total}</div>
          <div className="admin-stat-label">Elector Counts Set</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.totalElectors.toLocaleString()}</div>
          <div className="admin-stat-label">Total Electors</div>
        </div>
        <div className={`admin-stat-card candidate-deadline-card ${electionUrgency}`}>
          <div className="admin-stat-value">{stats.daysToElection} days</div>
          <div className="admin-stat-label">To Polling Day</div>
        </div>
      </div>

      {/* Ward Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table candidate-table">
          <thead>
            <tr>
              <th>Ward</th>
              <th>Candidate</th>
              <th style={{ width: 90, textAlign: 'right' }}>Electors</th>
              <th style={{ width: 100, textAlign: 'right' }}>Legal Max</th>
              <th style={{ width: 90, textAlign: 'right' }}>Spent</th>
              <th style={{ width: 100, textAlign: 'right' }}>Budget</th>
              <th style={{ width: 80, textAlign: 'center' }}>Used</th>
            </tr>
          </thead>
          <tbody>
            {wards.map(w => {
              const pct = spendPct(w.total_spent, w.legal_max);
              const cls = spendClass(pct);
              const isExpanded = expandedId === w.id;

              return (
                <Fragment key={w.id}>
                  <tr
                    className={`candidate-row ${isExpanded ? 'expanded' : ''}`}
                    onClick={() => toggleExpand(w)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <span style={{ fontWeight: 600 }}>{w.ward}</span>
                      <svg
                        className={`candidate-chevron ${isExpanded ? 'expanded' : ''}`}
                        width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: candidateByWard[w.ward] ? 'var(--navy)' : 'var(--text-muted)' }}>
                        {candidateByWard[w.ward] || '—'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: w.elector_count ? 600 : 400, color: w.elector_count ? 'var(--navy)' : 'var(--text-muted)' }}>
                        {w.elector_count ? w.elector_count.toLocaleString() : '—'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontSize: '0.85rem' }}>{fmt(w.legal_max)}</td>
                    <td style={{ textAlign: 'right', fontSize: '0.85rem', fontWeight: w.total_spent ? 600 : 400 }}>
                      {w.total_spent ? fmt(w.total_spent) : '—'}
                    </td>
                    <td style={{ textAlign: 'right', fontSize: '0.85rem' }}>
                      {w.budgeted_spend ? fmt(w.budgeted_spend) : '—'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`score-pill ${cls === 'green' ? 'empty' : cls === 'amber' ? 'partial' : 'complete'}`}>
                        {pct}%
                      </span>
                    </td>
                  </tr>

                  {/* Expanded Detail Row */}
                  {isExpanded && editData && (
                    <tr className="candidate-detail-row">
                      <td colSpan={7} style={{ padding: 0 }}>
                        <div className="candidate-detail">
                          <div className="candidate-detail-grid">
                            {/* Left Column: Ward Settings */}
                            <div>
                              <div className="candidate-detail-section" style={{ marginBottom: 16 }}>
                                <h4 className="candidate-detail-title">Ward Settings</h4>
                                <div className="candidate-field">
                                  <label className="candidate-field-label">Number of electors</label>
                                  <input
                                    className="admin-input"
                                    type="number"
                                    min="0"
                                    value={editData.elector_count || ''}
                                    onChange={e => setEditData(p => ({ ...p, elector_count: parseInt(e.target.value) || 0 }))}
                                  />
                                </div>
                                <div className="candidate-field">
                                  <label className="candidate-field-label">Seats up for election</label>
                                  <input
                                    className="admin-input"
                                    type="number"
                                    min="1"
                                    value={editData.seats_up || 1}
                                    onChange={e => setEditData(p => ({ ...p, seats_up: parseInt(e.target.value) || 1 }))}
                                  />
                                </div>
                                <div className="candidate-field">
                                  <label className="candidate-field-label">Budgeted spend</label>
                                  <input
                                    className="admin-input"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={editData.budgeted_spend || ''}
                                    onChange={e => setEditData(p => ({ ...p, budgeted_spend: parseFloat(e.target.value) || 0 }))}
                                  />
                                </div>
                                <div className="candidate-field">
                                  <label className="candidate-field-label">Notes</label>
                                  <textarea
                                    className="admin-input"
                                    rows={3}
                                    value={editData.notes || ''}
                                    onChange={e => setEditData(p => ({ ...p, notes: e.target.value }))}
                                  />
                                </div>
                              </div>

                              {/* Summary */}
                              <div className="candidate-detail-section">
                                <h4 className="candidate-detail-title">Summary</h4>
                                <div style={{ fontSize: '0.85rem', lineHeight: 2 }}>
                                  <div>Legal max: <strong>{fmt((editData.base_amount + editData.elector_count * editData.per_elector_rate) * editData.seats_up)}</strong></div>
                                  <div>Total spent: <strong>{fmt(w.total_spent)}</strong></div>
                                  <div>Available: <strong>{fmt(((editData.base_amount + editData.elector_count * editData.per_elector_rate) * editData.seats_up) - w.total_spent)}</strong></div>
                                  {editData.budgeted_spend > 0 && (
                                    <div>Budget remaining: <strong>{fmt(editData.budgeted_spend - w.total_spent)}</strong></div>
                                  )}
                                </div>
                              </div>

                              <div className="candidate-detail-actions" style={{ marginTop: 16 }}>
                                <button className="admin-btn admin-btn-primary" onClick={saveWard} disabled={saving}>
                                  {saving ? 'Saving...' : 'Save Settings'}
                                </button>
                              </div>
                            </div>

                            {/* Right Column: Expense Items */}
                            <div>
                              <div className="candidate-detail-section">
                                <h4 className="candidate-detail-title">Expense Items ({w.items?.length || 0})</h4>

                                {/* Add new item */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16, padding: 12, background: 'var(--bg)', borderRadius: 6 }}>
                                  <div style={{ display: 'flex', gap: 8 }}>
                                    <input
                                      className="admin-input"
                                      placeholder="Description"
                                      value={newItem.description}
                                      onChange={e => setNewItem(p => ({ ...p, description: e.target.value }))}
                                      style={{ flex: 2 }}
                                    />
                                    <input
                                      className="admin-input"
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      placeholder="Amount"
                                      value={newItem.amount}
                                      onChange={e => setNewItem(p => ({ ...p, amount: e.target.value }))}
                                      style={{ flex: 1 }}
                                    />
                                  </div>
                                  <div style={{ display: 'flex', gap: 8 }}>
                                    <select
                                      className="admin-input"
                                      value={newItem.category}
                                      onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))}
                                      style={{ flex: 1 }}
                                    >
                                      {CATEGORIES.map(c => (
                                        <option key={c.value} value={c.value}>{c.label}</option>
                                      ))}
                                    </select>
                                    <input
                                      className="admin-input"
                                      type="date"
                                      value={newItem.date}
                                      onChange={e => setNewItem(p => ({ ...p, date: e.target.value }))}
                                      style={{ flex: 1 }}
                                    />
                                    <input
                                      className="admin-input"
                                      placeholder="Receipt ref"
                                      value={newItem.receipt_ref}
                                      onChange={e => setNewItem(p => ({ ...p, receipt_ref: e.target.value }))}
                                      style={{ flex: 1 }}
                                    />
                                  </div>
                                  <button
                                    className="admin-btn admin-btn-primary"
                                    onClick={addItem}
                                    disabled={!newItem.description}
                                    style={{ alignSelf: 'flex-start' }}
                                  >
                                    + Add Expense
                                  </button>
                                </div>

                                {/* Items list */}
                                {(w.items || []).length === 0 ? (
                                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>No expenses recorded yet.</p>
                                ) : (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {w.items.map(item => (
                                      <div key={item.id} style={{
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        padding: '8px 10px', background: 'var(--card)', border: '1px solid var(--border-light)', borderRadius: 6, fontSize: '0.82rem'
                                      }}>
                                        <span style={{ flex: 2, fontWeight: 500 }}>{item.description}</span>
                                        <span style={{ flex: 0.7, textAlign: 'right', fontWeight: 600 }}>{fmt(item.amount)}</span>
                                        <span style={{ flex: 0.8, color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                                          {CATEGORIES.find(c => c.value === item.category)?.label || item.category}
                                        </span>
                                        <span style={{ flex: 0.8, color: 'var(--text-muted)' }}>{item.date || '—'}</span>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
                                          style={{
                                            background: 'none', border: 'none', color: 'var(--danger, #8B2635)',
                                            cursor: 'pointer', fontSize: '0.9rem', padding: '2px 6px'
                                          }}
                                          title="Delete"
                                        >
                                          &times;
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>

          {/* Totals row */}
          <tfoot>
            <tr style={{ fontWeight: 700, borderTop: '2px solid var(--border)' }}>
              <td colSpan={2} style={{ textAlign: 'right' }}>Totals</td>
              <td style={{ textAlign: 'right' }}>{stats.totalElectors.toLocaleString()}</td>
              <td style={{ textAlign: 'right' }}>{fmt(stats.totalMax)}</td>
              <td style={{ textAlign: 'right' }}>{fmt(stats.totalSpent)}</td>
              <td style={{ textAlign: 'right' }}>{fmt(stats.totalBudget)}</td>
              <td style={{ textAlign: 'center' }}>
                <span className={`score-pill ${spendClass(spendPct(stats.totalSpent, stats.totalMax)) === 'green' ? 'empty' : 'partial'}`}>
                  {spendPct(stats.totalSpent, stats.totalMax)}%
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
