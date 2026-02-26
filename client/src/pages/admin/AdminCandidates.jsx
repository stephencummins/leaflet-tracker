import { Fragment, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/adminClient';

const DEADLINE = new Date('2025-04-09T16:00:00');

const PACK_FIELDS = [
  { key: 'pack_nomination_papers', label: 'Nomination papers' },
  { key: 'pack_guidance_notes', label: 'Guidance notes' },
  { key: 'pack_expenses_forms', label: 'Expenses forms' },
  { key: 'pack_code_of_conduct', label: 'Code of conduct' },
  { key: 'pack_voter_id_briefing', label: 'Voter ID briefing' },
  { key: 'pack_canvassing_rules', label: 'Canvassing rules' },
];

function packScore(c) {
  return PACK_FIELDS.reduce((n, f) => n + (c[f.key] ? 1 : 0), 0);
}

function nomScore(c) {
  let n = 0;
  if (c.proposer) n++;
  if (c.seconder) n++;
  if (c.assenters_count >= 8) n++;
  if (c.consent_signed) n++;
  if (c.on_electoral_register) n++;
  if (c.party_authorised) n++;
  return n;
}

function candidateStatus(c) {
  if (c.nomination_submitted) return 'submitted';
  const ns = nomScore(c);
  const ps = packScore(c);
  if (ns === 6 && ps === 6) return 'ready';
  if (ns > 0 || ps > 0) return 'in_progress';
  return 'not_started';
}

const STATUS_CONFIG = {
  submitted: { label: 'Submitted', cls: 'submitted' },
  ready: { label: 'Ready', cls: 'ready' },
  in_progress: { label: 'In Progress', cls: 'in-progress' },
  not_started: { label: 'Not Started', cls: 'not-started' },
};

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
      packsComplete: candidates.filter(c => packScore(c) === 6).length,
      nomsSubmitted: candidates.filter(c => c.nomination_submitted).length,
      briefingsDone: candidates.filter(c => c.briefing_completed).length,
      total,
    };
  }, [candidates]);

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
      </div>

      {error && <div className="admin-error" style={{ color: 'var(--danger)', marginBottom: 12, fontSize: '0.85rem' }}>{error} <button onClick={() => setError(null)} style={{ marginLeft: 8, textDecoration: 'underline', color: 'var(--text-muted)' }}>dismiss</button></div>}

      {/* Stats Bar */}
      <div className="admin-stats-grid" style={{ marginBottom: 24 }}>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.confirmed}/{stats.total}</div>
          <div className="admin-stat-label">Confirmed</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.packsComplete}/{stats.total}</div>
          <div className="admin-stat-label">Packs Complete</div>
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
              <th style={{ width: 70, textAlign: 'center' }}>Pack</th>
              <th style={{ width: 70, textAlign: 'center' }}>Nom</th>
              <th style={{ width: 100, textAlign: 'center' }}>Status</th>
              <th style={{ width: 80, textAlign: 'center' }}>Confirmed</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map(c => {
              const ps = packScore(c);
              const ns = nomScore(c);
              const status = candidateStatus(c);
              const sc = STATUS_CONFIG[status];
              const isExpanded = expandedId === c.id;

              return (
                <Fragment key={c.id}>
                  <tr
                    className={`candidate-row ${isExpanded ? 'expanded' : ''}`}
                    onClick={() => toggleExpand(c)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td><span style={{ fontWeight: 600 }}>{c.ward}</span></td>
                    <td>
                      <span style={{ color: c.candidate_name ? 'var(--navy)' : 'var(--text-muted)' }}>
                        {c.candidate_name || '???'}{!c.is_paper ? ' *' : ''}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`score-pill ${pillClass(ps, 6)}`}>{ps}/6</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`score-pill ${pillClass(ns, 6)}`}>{ns}/6</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`candidate-status ${sc.cls}`}>{sc.label}</span>
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
                          <div className="candidate-detail-grid">
                            {/* Pack Contents */}
                            <div className="candidate-detail-section">
                              <h4 className="candidate-detail-title">Pack Contents</h4>
                              <div className="candidate-checklist">
                                {PACK_FIELDS.map(f => (
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

                            {/* Nomination Details */}
                            <div className="candidate-detail-section">
                              <h4 className="candidate-detail-title">Nomination Details</h4>
                              <div className="candidate-field">
                                <label className="candidate-field-label">Proposer</label>
                                <input className="admin-input" value={editData.proposer || ''} onChange={e => updateField('proposer', e.target.value)} />
                              </div>
                              <div className="candidate-field">
                                <label className="candidate-field-label">Seconder</label>
                                <input className="admin-input" value={editData.seconder || ''} onChange={e => updateField('seconder', e.target.value)} />
                              </div>
                              <div className="candidate-field">
                                <label className="candidate-field-label">Assenters ({editData.assenters_count || 0}/8)</label>
                                <input className="admin-input" type="number" min="0" max="8" value={editData.assenters_count || 0} onChange={e => updateField('assenters_count', parseInt(e.target.value) || 0)} />
                              </div>
                              <div className="candidate-field">
                                <label className="candidate-field-label">Assenter names</label>
                                <input className="admin-input" value={editData.assenters_names || ''} placeholder="Comma-separated" onChange={e => updateField('assenters_names', e.target.value)} />
                              </div>
                              <div className="candidate-checklist" style={{ marginTop: 8 }}>
                                <label className="candidate-check-item">
                                  <input type="checkbox" checked={!!editData.consent_signed} onChange={e => { updateField('consent_signed', e.target.checked ? 1 : 0); instantSave(editData.id, { consent_signed: e.target.checked ? 1 : 0 }); }} />
                                  <span>Consent signed</span>
                                </label>
                                <label className="candidate-check-item">
                                  <input type="checkbox" checked={!!editData.on_electoral_register} onChange={e => { updateField('on_electoral_register', e.target.checked ? 1 : 0); instantSave(editData.id, { on_electoral_register: e.target.checked ? 1 : 0 }); }} />
                                  <span>On electoral register</span>
                                </label>
                                <label className="candidate-check-item">
                                  <input type="checkbox" checked={!!editData.party_authorised} onChange={e => { updateField('party_authorised', e.target.checked ? 1 : 0); instantSave(editData.id, { party_authorised: e.target.checked ? 1 : 0 }); }} />
                                  <span>Party authorised</span>
                                </label>
                                <label className="candidate-check-item">
                                  <input type="checkbox" checked={!!editData.nomination_submitted} onChange={e => { updateField('nomination_submitted', e.target.checked ? 1 : 0); instantSave(editData.id, { nomination_submitted: e.target.checked ? 1 : 0 }); }} />
                                  <span>Nomination submitted</span>
                                </label>
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
                              {saving ? 'Saving…' : 'Save'}
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
