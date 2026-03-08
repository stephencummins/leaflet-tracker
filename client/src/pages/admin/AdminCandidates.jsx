import { Fragment, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/adminClient';

const DEADLINE = new Date('2026-04-09T16:00:00');

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
  pack_precompleted: '#8b5cf6',
  pack_printed: '#8b5cf6',
  pack_sent: '#8b5cf6',
  signed_witnessed: '#d97706',
  proposed_seconded: '#d97706',
  collected: '#2563eb',
  checked_by_scc: '#2563eb',
  submitted: '#059669',
};

function candidateStatusLabel(c) {
  const next = nextStep(c);
  if (!next) return { label: 'Complete', color: '#059669' };
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
      paperworkComplete: candidates.filter(c => paperworkScore(c) === PAPERWORK_STEPS.length).length,
      nomsSubmitted: candidates.filter(c => c.submitted).length,
      briefingsDone: candidates.filter(c => c.briefing_completed).length,
      total,
    };
  }, [candidates]);

  const sortedCandidates = useMemo(() =>
    [...candidates].sort((a, b) => paperworkScore(b) - paperworkScore(a)),
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
          <div className="admin-stat-value">{stats.paperworkComplete}/{stats.total}</div>
          <div className="admin-stat-label">Paperwork Done</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.nomsSubmitted}/{stats.total}</div>
          <div className="admin-stat-label">Noms Submitted</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.briefingsDone}/{stats.total}</div>
          <div className="admin-stat-label">Briefings Done</div>
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
              <th>Ward</th>
              <th>Candidate</th>
              <th style={{ width: 80, textAlign: 'center' }}>Paperwork</th>
              <th style={{ width: 140, textAlign: 'center' }}>Next Step</th>
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
                      <span style={{ fontWeight: 600 }}>{c.ward}</span>
                      <svg
                        className={`candidate-chevron ${isExpanded ? 'expanded' : ''}`}
                        width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </td>
                    <td>
                      <span style={{ color: c.candidate_name ? 'var(--navy)' : 'var(--text-muted)' }}>
                        {c.candidate_name || '???'}{!c.is_paper ? ' *' : ''}
                      </span>
                      {c.address && (
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                          {c.address}
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`score-pill ${pillClass(ps, PAPERWORK_STEPS.length)}`}>{ps}/{PAPERWORK_STEPS.length}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: 12,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#fff',
                        backgroundColor: sc.color,
                      }}>{sc.label}</span>
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
                      <td colSpan={5} style={{ padding: 0 }}>
                        <div className="candidate-detail">
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
