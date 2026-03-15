import { Fragment, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/adminClient';

const DEADLINE = new Date('2026-04-09T16:00:00');

// Proposers who have confirmed they'll sign (ward → array of { name, lastName })
const CONFIRMED_PROPOSERS = {
  'Belfairs': [{ name: 'Phil Jenkins', lastName: 'Jenkins' }, { name: 'Jean de Tourtoulon', lastName: 'Tourtoulon' }],
  'Blenheim Park': [{ name: 'Ron Carroll', lastName: 'Carroll' }, { name: 'Edward Regan', lastName: 'Regan' }],
  'Prittlewell': [{ name: 'Libby Shaer', lastName: 'Shaer' }],
  'St Laurence': [{ name: 'David Dedman', lastName: 'Dedman' }],
  'West Leigh': [{ name: 'Linda Howard', lastName: 'Howard' }],
  'West Shoebury': [{ name: 'Jo Hughes', lastName: 'Hughes' }, { name: 'Tim Hughes', lastName: 'Hughes' }],
};

const PAPERWORK_STEPS = [
  { key: 'pack_precompleted', label: 'Pre-completed' },
  { key: 'pack_printed', label: 'Printed' },
  { key: 'pack_sent', label: 'Sent' },
  { key: 'signed_witnessed', label: 'Signed and Witnessed' },
  { key: 'proposed_seconded', label: 'Proposed and Seconded' },
  { key: 'collected', label: 'Collected' },
  { key: 'checked_by_scc', label: 'Checked by SCC' },
  { key: 'submitted', label: 'Submitted' },
];

function paperworkScore(c) {
  return PAPERWORK_STEPS.reduce((n, f) => n + (c[f.key] ? 1 : 0), 0);
}

function nextStep(c) {
  for (const step of PAPERWORK_STEPS) {
    if (!c[step.key]) return step;
  }
  return null;
}

const STEP_COLORS = {
  pack_precompleted: '#7A6F60',
  pack_printed: '#7A6F60',
  pack_sent: '#7A6F60',
  signed_witnessed: '#8B2635',
  proposed_seconded: '#8B2635',
  collected: '#D4A03C',
  checked_by_scc: '#D4A03C',
  submitted: '#1B4332',
};

function candidateStatusLabel(c) {
  const next = nextStep(c);
  if (!next) return { label: 'Complete', color: '#1B4332' };
  return { label: next.label, color: STEP_COLORS[next.key] };
}

function pillClass(score, max) {
  if (score === max) return 'complete';
  if (score > 0) return 'partial';
  return 'empty';
}

function daysToDeadline() {
  const now = new Date();
  const diff = DEADLINE - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function deadlineUrgency(days) {
  if (days > 14) return 'green';
  if (days >= 7) return 'amber';
  return 'red';
}

export default function AdminCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminApi.getCandidates().then(setCandidates).catch(() => setError('Failed to load candidates'));
  }, []);

  const stats = useMemo(() => {
    const total = candidates.length;
    return {
      confirmed: candidates.filter(c => c.confirmed).length,
      paperworkComplete: candidates.filter(c => c.collected || c.checked_by_scc || c.submitted).length,
      packsSent: candidates.filter(c => c.pack_precompleted).length,
      briefingsDone: candidates.filter(c => c.briefing_completed || c.briefing_na).length,
      total,
    };
  }, [candidates]);

  const sortedCandidates = useMemo(() =>
    [...candidates].sort((a, b) => {
      const aEmpty = !a.candidate_name || a.candidate_name === '???';
      const bEmpty = !b.candidate_name || b.candidate_name === '???';
      if (aEmpty !== bEmpty) return aEmpty ? 1 : -1;
      return paperworkScore(b) - paperworkScore(a);
    }),
  [candidates]);

  const days = daysToDeadline();
  const urgency = deadlineUrgency(days);

  // Instant-save a single field (for checkboxes)
  const instantSave = async (id, patch) => {
    try {
      const updated = await adminApi.updateCandidate(id, patch);
      setCandidates(prev => prev.map(c => c.id === id ? updated : c));
      // Also update editData if this row is expanded
      if (expandedId === id && editData) {
        setEditData(prev => ({ ...prev, ...updated }));
      }
    } catch {
      setError('Failed to save');
    }
  };

  const toggleExpand = (c) => {
    if (expandedId === c.id) {
      setExpandedId(null);
      setEditData(null);
    } else {
      setExpandedId(c.id);
      setEditData({ ...c });
    }
  };

  const saveEdit = async () => {
    if (!editData) return;
    setSaving(true);
    try {
      const updated = await adminApi.updateCandidate(editData.id, editData);
      setCandidates(prev => prev.map(c => c.id === editData.id ? updated : c));
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

  const hasNonPaper = candidates.some(c => !c.is_paper);

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Candidates</h1>
        <a
          href="https://www.electoralcommission.org.uk/guidance-candidates-and-agents-local-government-elections-england"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: "0.8rem", color: "var(--text-muted)", textDecoration: "underline" }}
        >
          Electoral Commission guidance for candidates
        </a>
        <Link
          to="/admin/candidate-guide"
          style={{ fontSize: "0.8rem", color: "var(--text-muted)", textDecoration: "underline", marginLeft: 12 }}
        >
          Candidate guide (plain English)
        </Link>
        <a
          href="/nomination-pdfs/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: "0.8rem", color: "var(--cyan)", textDecoration: "underline", marginLeft: 12, fontWeight: 600 }}
        >
          Nomination Packs (PDF)
        </a>
        <Link
          to="/admin/proposers"
          style={{ fontSize: "0.8rem", color: "var(--cyan)", textDecoration: "underline", marginLeft: 12, fontWeight: 600 }}
        >
          Proposers &amp; Seconders
        </Link>
      </div>

      {error && <div className="admin-error" style={{ color: 'var(--danger)', marginBottom: 12, fontSize: '0.85rem' }}>{error} <button onClick={() => setError(null)} style={{ marginLeft: 8, textDecoration: 'underline', color: 'var(--text-muted)' }}>dismiss</button></div>}

      {/* Stats Bar */}
      <div className="admin-stats-grid" style={{ marginBottom: 24 }}>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.confirmed}/{stats.total}</div>
          <div className="admin-stat-label">Confirmed</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.packsSent}/{stats.total}</div>
          <div className="admin-stat-label">Nom Pack Sent</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.briefingsDone}/{stats.total}</div>
          <div className="admin-stat-label">Briefings Done</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.paperworkComplete}/{stats.total}</div>
          <div className="admin-stat-label">Paperwork Done</div>
        </div>
        <div className={`admin-stat-card candidate-deadline-card ${urgency}`}>
          <div className="admin-stat-value">{days} days</div>
          <div className="admin-stat-label">To Deadline</div>
        </div>
      </div>

      {/* Compact Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table candidate-table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Ward</th>
              <th style={{ width: 80, textAlign: 'center' }}>Paperwork</th>
              <th style={{ width: 180, textAlign: 'center' }}>Next Step</th>
              <th style={{ width: 160, textAlign: 'center' }}>Briefing</th>
              <th style={{ width: 80, textAlign: 'center' }}>Confirmed</th>
            </tr>
          </thead>
          <tbody>
            {sortedCandidates.map(c => {
              const ps = paperworkScore(c);
              const sc = candidateStatusLabel(c);
              const isExpanded = expandedId === c.id;

              return (
                <Fragment key={c.id}>
                  <tr
                    className={`candidate-row ${isExpanded ? 'expanded' : ''}`}
                    onClick={() => toggleExpand(c)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <svg
                          className={`candidate-chevron ${isExpanded ? 'expanded' : ''}`}
                          width="14" height="14" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                          style={{ flexShrink: 0 }}
                        >
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                        <span style={{ fontWeight: 700, color: c.candidate_name ? 'var(--navy)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          {c.candidate_name || '???'}{!c.is_paper ? ' *' : ''}
                        </span>
                      </div>
                    </td>
                    <td>
                      <Link
                        to={`/admin/map?ward=${encodeURIComponent(c.ward)}`}
                        style={{ fontWeight: 600, color: 'var(--navy)', textDecoration: 'none' }}
                        onClick={e => e.stopPropagation()}
                      >
                        {c.ward}
                      </Link>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                        <div style={{
                          width: 60, height: 8, borderRadius: 4,
                          background: 'var(--border, #e0d8cc)',
                          overflow: 'hidden',
                        }}>
                          <div style={{
                            width: `${(ps / PAPERWORK_STEPS.length) * 100}%`,
                            height: '100%',
                            borderRadius: 4,
                            background: ps === PAPERWORK_STEPS.length ? '#1B4332' : ps >= 5 ? '#D4A03C' : '#8B2635',
                            transition: 'width 0.3s ease',
                          }} />
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, minWidth: 24 }}>{ps}/{PAPERWORK_STEPS.length}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 10px',
                        borderRadius: 12,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#fff',
                        backgroundColor: sc.color,
                        whiteSpace: 'nowrap',
                      }}>{sc.label}</span>
                    </td>
                    <td style={{ textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                      {c.briefing_na ? (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>N/A</span>
                      ) : c.briefing_scheduled ? (
                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--navy)' }}>
                          {c.briefing_scheduled.split('-').reverse().join('/')}
                        </span>
                      ) : (
                        <input
                          type="date"
                          value=""
                          onChange={e => instantSave(c.id, { briefing_scheduled: e.target.value })}
                          style={{ fontSize: '0.75rem', padding: '2px 4px', border: '1px solid var(--border)', borderRadius: 4, background: 'var(--card)', color: 'var(--text-muted)', width: 110 }}
                        />
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={!!c.confirmed}
                        onChange={e => instantSave(c.id, { confirmed: e.target.checked ? 1 : 0 })}
                      />
                    </td>
                  </tr>

                  {/* Expanded Detail Row */}
                  {isExpanded && editData && (
                    <tr className="candidate-detail-row">
                      <td colSpan={6} style={{ padding: 0 }}>
                        <div className="candidate-detail">
                          {c.address && (
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid var(--border, #e0d8cc)' }}>
                              {c.address}
                            </div>
                          )}
                          <div className="candidate-detail-grid">
                            {/* Nomination Checklist */}
                            <div className="candidate-detail-section">
                              <h4 className="candidate-detail-title">Nomination Checklist</h4>
                              <div className="candidate-checklist">
                                {PAPERWORK_STEPS.map(f => (
                                  <label key={f.key} className="candidate-check-item">
                                    <input
                                      type="checkbox"
                                      checked={!!editData[f.key]}
                                      onChange={e => {
                                        const val = e.target.checked ? 1 : 0;
                                        updateField(f.key, val);
                                        instantSave(editData.id, { [f.key]: val });
                                      }}
                                    />
                                    <span>{f.label}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            {/* Contact & Briefing */}
                            <div className="candidate-detail-section">
                              <h4 className="candidate-detail-title">Contact &amp; Briefing</h4>
                              <div className="candidate-field">
                                <label className="candidate-field-label">Email</label>
                                <input className="admin-input" type="email" value={editData.email || ''} onChange={e => updateField('email', e.target.value)} />
                              </div>
                              <div className="candidate-field">
                                <label className="candidate-field-label">Phone</label>
                                <input className="admin-input" type="tel" value={editData.phone || ''} onChange={e => updateField('phone', e.target.value)} />
                              </div>
                              <div className="candidate-field">
                                <label className="candidate-field-label">Briefing scheduled</label>
                                <input className="admin-input" type="date" value={editData.briefing_scheduled || ''} onChange={e => updateField('briefing_scheduled', e.target.value)} />
                              </div>
                              <div className="candidate-checklist" style={{ marginTop: 8 }}>
                                <label className="candidate-check-item">
                                  <input type="checkbox" checked={!!editData.briefing_completed} onChange={e => { updateField('briefing_completed', e.target.checked ? 1 : 0); instantSave(editData.id, { briefing_completed: e.target.checked ? 1 : 0 }); }} />
                                  <span>Briefing completed</span>
                                </label>
                                <label className="candidate-check-item">
                                  <input type="checkbox" checked={!!editData.briefing_na} onChange={e => { updateField('briefing_na', e.target.checked ? 1 : 0); instantSave(editData.id, { briefing_na: e.target.checked ? 1 : 0 }); }} />
                                  <span>N/A</span>
                                </label>
                              </div>
                            </div>

                            {/* Candidate Info */}
                            <div className="candidate-detail-section">
                              <h4 className="candidate-detail-title">Candidate Info</h4>
                              <div className="candidate-field">
                                <label className="candidate-field-label">Name</label>
                                <input className="admin-input" value={editData.candidate_name || ''} onChange={e => updateField('candidate_name', e.target.value)} />
                              </div>
                              <div className="candidate-field">
                                <label className="candidate-field-label">Agent</label>
                                <input className="admin-input" value={editData.agent || ''} onChange={e => updateField('agent', e.target.value)} />
                              </div>
                              <div className="candidate-field">
                                <label className="candidate-field-label">Address</label>
                                <input className="admin-input" value={editData.address || ''} onChange={e => updateField('address', e.target.value)} />
                              </div>
                              <div className="candidate-field">
                                <label className="candidate-field-label">Notes</label>
                                <input className="admin-input" value={editData.notes || ''} onChange={e => updateField('notes', e.target.value)} />
                              </div>
                              <div className="candidate-checklist" style={{ marginTop: 8 }}>
                                <label className="candidate-check-item">
                                  <input type="checkbox" checked={!editData.is_paper} onChange={e => updateField('is_paper', e.target.checked ? 0 : 1)} />
                                  <span>Real candidate</span>
                                </label>
                                <label className="candidate-check-item">
                                  <input type="checkbox" checked={!!editData.confirmed} onChange={e => updateField('confirmed', e.target.checked ? 1 : 0)} />
                                  <span>Confirmed</span>
                                </label>
                              </div>
                            </div>
                          </div>

                          {/* Confirmed Proposers */}
                          {CONFIRMED_PROPOSERS[c.ward] && (
                            <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border, #e0d8cc)' }}>
                              <h4 className="candidate-detail-title" style={{ marginBottom: 6 }}>Confirmed Proposers</h4>
                              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {CONFIRMED_PROPOSERS[c.ward].map((p, i) => (
                                  <Link
                                    key={i}
                                    to={`/admin/proposers?search=${encodeURIComponent(p.lastName)}`}
                                    onClick={e => e.stopPropagation()}
                                    style={{
                                      display: 'inline-block',
                                      padding: '3px 10px',
                                      borderRadius: 12,
                                      fontSize: '0.78rem',
                                      fontWeight: 600,
                                      color: '#fff',
                                      backgroundColor: '#1B4332',
                                      textDecoration: 'none',
                                    }}
                                  >
                                    {p.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}

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
        {hasNonPaper && (
          <p style={{ margin: '12px 14px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            * Not a paper candidate
          </p>
        )}
      </div>
    </div>
  );
}
