import { Fragment, useEffect, useState, useMemo } from 'react';
import { adminApi } from '../../api/adminClient';

const BALLOT_DISPATCH = new Date('2026-04-16');

const GM_STEPS = [
  { key: 'gm_letter_prepared', label: 'Letter prepared' },
  { key: 'gm_letter_printed', label: 'Printed' },
  { key: 'gm_letter_delivered', label: 'Delivered / posted' },
];

const REMINDER_STEPS = [
  { key: 'reminder_prepared', label: 'Letter prepared' },
  { key: 'reminder_printed', label: 'Printed' },
  { key: 'reminder_delivered', label: 'Delivered / posted' },
];

function gmScore(row) {
  return GM_STEPS.reduce((n, s) => n + (row[s.key] ? 1 : 0), 0);
}

function reminderScore(row) {
  return REMINDER_STEPS.reduce((n, s) => n + (row[s.key] ? 1 : 0), 0);
}

function pillClass(score, max) {
  if (score === max) return 'complete';
  if (score > 0) return 'partial';
  return 'empty';
}

function daysToDispatch() {
  return Math.max(0, Math.ceil((BALLOT_DISPATCH - new Date()) / 86400000));
}

function dispatchUrgency(days) {
  if (days > 14) return 'green';
  if (days >= 7) return 'amber';
  return 'red';
}

export default function AdminPostalVotes() {
  const [rows, setRows] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminApi.getPostalVotes().then(setRows).catch(() => setError('Failed to load postal vote data'));
    adminApi.getCandidates().then(setCandidates).catch(() => {});
  }, []);

  const candidateByWard = useMemo(() => {
    const map = {};
    candidates.forEach(c => { map[c.ward] = c.candidate_name || ''; });
    return map;
  }, [candidates]);

  const stats = useMemo(() => ({
    hasVoterList: rows.filter(r => r.has_voter_list).length,
    gmSent: rows.filter(r => gmScore(r) === GM_STEPS.length).length,
    reminderSent: rows.filter(r => reminderScore(r) === REMINDER_STEPS.length).length,
    doorknockDone: rows.filter(r => r.doorknock_done).length,
    totalVoters: rows.reduce((sum, r) => sum + (r.voter_count || 0), 0),
    total: rows.length,
  }), [rows]);

  const days = daysToDispatch();
  const urgency = dispatchUrgency(days);

  const instantSave = async (id, patch) => {
    try {
      const updated = await adminApi.updatePostalVote(id, patch);
      setRows(prev => prev.map(r => r.id === id ? updated : r));
      if (expandedId === id && editData) {
        setEditData(prev => ({ ...prev, ...updated }));
      }
    } catch {
      setError('Failed to save');
    }
  };

  const toggleExpand = (r) => {
    if (expandedId === r.id) {
      setExpandedId(null);
      setEditData(null);
    } else {
      setExpandedId(r.id);
      setEditData({ ...r });
    }
  };

  const saveEdit = async () => {
    if (!editData) return;
    setSaving(true);
    try {
      const updated = await adminApi.updatePostalVote(editData.id, editData);
      setRows(prev => prev.map(r => r.id === editData.id ? updated : r));
      setExpandedId(null);
      setEditData(null);
    } catch {
      setError('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setExpandedId(null);
    setEditData(null);
  };

  const updateField = (key, value) => {
    setEditData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Postal Vote Outreach</h1>
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
          Key Dates &amp; Information
        </h3>
        <div className="postal-dates-list">
          <span><strong>9 Apr</strong> Nominations close (4pm)</span>
          <span><strong>16-18 Apr</strong> Postal ballots dispatched (1st batch)</span>
          <span><strong>21 Apr</strong> PV application deadline (5pm)</span>
          <span><strong>27-29 Apr</strong> Late postal ballots dispatched (2nd batch)</span>
          <span><strong>7 May</strong> Polling Day</span>
        </div>
        <div className="postal-warning">
          Campaigners MUST NOT handle postal voting documents (Elections Act 2022 — up to 2 years imprisonment). Voters may only hand in 5 postal votes at a polling station.
        </div>
        <div className="postal-note">
          Long-term postal votes applied before 31 Oct 2023 expired 31 Jan 2026 — some voters may need to reapply. No freepost for local elections — candidates pay for printing + delivery.
        </div>
      </div>

      {/* Stats Bar */}
      <div className="admin-stats-grid" style={{ marginBottom: 24 }}>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.hasVoterList}/{stats.total}</div>
          <div className="admin-stat-label">Has Voter List</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.gmSent}/{stats.total}</div>
          <div className="admin-stat-label">GM Letter Sent</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.reminderSent}/{stats.total}</div>
          <div className="admin-stat-label">Reminder Sent</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.doorknockDone}/{stats.total}</div>
          <div className="admin-stat-label">Doorknock Done</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.totalVoters.toLocaleString()}</div>
          <div className="admin-stat-label">Total Postal Voters</div>
        </div>
        <div className={`admin-stat-card candidate-deadline-card ${urgency}`}>
          <div className="admin-stat-value">{days} days</div>
          <div className="admin-stat-label">To Ballot Dispatch</div>
        </div>
      </div>

      {/* Ward Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table candidate-table">
          <thead>
            <tr>
              <th>Ward</th>
              <th>Candidate</th>
              <th style={{ width: 90, textAlign: 'center' }}>Postal Voters</th>
              <th style={{ width: 90, textAlign: 'center' }}>GM Letter</th>
              <th style={{ width: 90, textAlign: 'center' }}>Reminder</th>
              <th style={{ width: 80, textAlign: 'center' }}>Doorknock</th>
              <th style={{ width: 60, textAlign: 'center' }}>List</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => {
              const gm = gmScore(r);
              const rem = reminderScore(r);
              const isExpanded = expandedId === r.id;

              return (
                <Fragment key={r.id}>
                  <tr
                    className={`candidate-row ${isExpanded ? 'expanded' : ''}`}
                    onClick={() => toggleExpand(r)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <span style={{ fontWeight: 600 }}>{r.ward}</span>
                      <svg
                        className={`candidate-chevron ${isExpanded ? 'expanded' : ''}`}
                        width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: candidateByWard[r.ward] ? 'var(--navy)' : 'var(--text-muted)' }}>
                        {candidateByWard[r.ward] || '—'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: r.voter_count ? 600 : 400, color: r.voter_count ? 'var(--navy)' : 'var(--text-muted)' }}>
                        {r.voter_count || '—'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`score-pill ${pillClass(gm, GM_STEPS.length)}`}>{gm}/{GM_STEPS.length}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`score-pill ${pillClass(rem, REMINDER_STEPS.length)}`}>{rem}/{REMINDER_STEPS.length}</span>
                    </td>
                    <td style={{ textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={!!r.doorknock_done}
                        onChange={e => instantSave(r.id, { doorknock_done: e.target.checked ? 1 : 0 })}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={!!r.has_voter_list}
                        onChange={e => instantSave(r.id, { has_voter_list: e.target.checked ? 1 : 0 })}
                      />
                    </td>
                  </tr>

                  {/* Expanded Detail Row */}
                  {isExpanded && editData && (
                    <tr className="candidate-detail-row">
                      <td colSpan={7} style={{ padding: 0 }}>
                        <div className="candidate-detail">
                          <div className="candidate-detail-grid">
                            {/* Left Column: Letter Checklists */}
                            <div>
                              {/* GM Letter */}
                              <div className="candidate-detail-section" style={{ marginBottom: 16 }}>
                                <h4 className="candidate-detail-title">"Good Morning" Letter</h4>
                                <div className="candidate-checklist">
                                  {GM_STEPS.map(s => (
                                    <label key={s.key} className="candidate-check-item">
                                      <input
                                        type="checkbox"
                                        checked={!!editData[s.key]}
                                        onChange={e => {
                                          const val = e.target.checked ? 1 : 0;
                                          updateField(s.key, val);
                                          instantSave(editData.id, { [s.key]: val });
                                        }}
                                      />
                                      <span>{s.label}</span>
                                    </label>
                                  ))}
                                </div>
                                <div className="candidate-field" style={{ marginTop: 10 }}>
                                  <label className="candidate-field-label">Delivery date</label>
                                  <input className="admin-input" type="date" value={editData.gm_letter_date || ''} onChange={e => updateField('gm_letter_date', e.target.value)} />
                                </div>
                              </div>

                              {/* Reminder Letter */}
                              <div className="candidate-detail-section" style={{ marginBottom: 16 }}>
                                <h4 className="candidate-detail-title">Reminder Letter</h4>
                                <div className="candidate-checklist">
                                  {REMINDER_STEPS.map(s => (
                                    <label key={s.key} className="candidate-check-item">
                                      <input
                                        type="checkbox"
                                        checked={!!editData[s.key]}
                                        onChange={e => {
                                          const val = e.target.checked ? 1 : 0;
                                          updateField(s.key, val);
                                          instantSave(editData.id, { [s.key]: val });
                                        }}
                                      />
                                      <span>{s.label}</span>
                                    </label>
                                  ))}
                                </div>
                                <div className="candidate-field" style={{ marginTop: 10 }}>
                                  <label className="candidate-field-label">Delivery date</label>
                                  <input className="admin-input" type="date" value={editData.reminder_date || ''} onChange={e => updateField('reminder_date', e.target.value)} />
                                </div>
                              </div>

                              {/* Door-knocking */}
                              <div className="candidate-detail-section">
                                <h4 className="candidate-detail-title">Door-knocking</h4>
                                <div className="candidate-checklist">
                                  <label className="candidate-check-item">
                                    <input
                                      type="checkbox"
                                      checked={!!editData.doorknock_done}
                                      onChange={e => {
                                        const val = e.target.checked ? 1 : 0;
                                        updateField('doorknock_done', val);
                                        instantSave(editData.id, { doorknock_done: val });
                                      }}
                                    />
                                    <span>Door-knocking completed</span>
                                  </label>
                                </div>
                                <div className="candidate-field" style={{ marginTop: 10 }}>
                                  <label className="candidate-field-label">Date</label>
                                  <input className="admin-input" type="date" value={editData.doorknock_date || ''} onChange={e => updateField('doorknock_date', e.target.value)} />
                                </div>
                              </div>
                            </div>

                            {/* Right Column: Ward Info */}
                            <div>
                              <div className="candidate-detail-section">
                                <h4 className="candidate-detail-title">Ward Info</h4>
                                <div className="candidate-field">
                                  <label className="candidate-field-label">Postal voter count</label>
                                  <input
                                    className="admin-input"
                                    type="number"
                                    min="0"
                                    value={editData.voter_count || ''}
                                    onChange={e => updateField('voter_count', parseInt(e.target.value) || 0)}
                                  />
                                </div>
                                <div className="candidate-field">
                                  <label className="candidate-field-label">Ballot dispatch date</label>
                                  <input className="admin-input" type="date" value={editData.ballot_dispatch_date || ''} onChange={e => updateField('ballot_dispatch_date', e.target.value)} />
                                </div>
                                <div className="candidate-field">
                                  <label className="candidate-field-label">Notes</label>
                                  <textarea
                                    className="admin-input"
                                    rows={4}
                                    value={editData.notes || ''}
                                    onChange={e => updateField('notes', e.target.value)}
                                  />
                                </div>
                                <div className="candidate-checklist" style={{ marginTop: 8 }}>
                                  <label className="candidate-check-item">
                                    <input
                                      type="checkbox"
                                      checked={!!editData.has_voter_list}
                                      onChange={e => {
                                        const val = e.target.checked ? 1 : 0;
                                        updateField('has_voter_list', val);
                                        instantSave(editData.id, { has_voter_list: val });
                                      }}
                                    />
                                    <span>Has voter list from Granville</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Save / Cancel */}
                          <div className="candidate-detail-actions">
                            <button className="admin-btn admin-btn-primary" onClick={saveEdit} disabled={saving}>
                              {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button className="admin-btn" onClick={cancelEdit}>Cancel</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
