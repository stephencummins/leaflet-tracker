import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useTrackerStore from '../stores/useTrackerStore';

const STATUS_COLORS = {
  not_started: '#9ca3af',
  in_progress: '#f59e0b',
  done: '#10b981',
};

const STATUS_LABELS = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  done: 'Done',
};

function RoadsTab({ roads, onStatusChange }) {
  return (
    <div>
      {roads.map(road => (
        <div key={road.id} style={{
          background: 'white',
          borderRadius: 10,
          borderLeft: `4px solid ${STATUS_COLORS[road.status]}`,
          padding: '12px 14px',
          marginBottom: 10,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: 'var(--navy)', fontWeight: 600, fontSize: '0.9rem' }}>{road.name}</div>
              <div style={{ fontSize: '0.72rem', color: STATUS_COLORS[road.status], marginTop: 2, fontWeight: 500 }}>
                {STATUS_LABELS[road.status]}
                {road.canvassed_by_name ? ` · ${road.canvassed_by_name}` : ''}
              </div>
              {(road.support > 0 || road.against > 0 || road.undecided > 0 || road.not_home > 0) && (
                <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                  {road.support > 0 && <span style={{ fontSize: '0.68rem', color: '#059669', background: '#10b98115', padding: '1px 6px', borderRadius: 8 }}>For: {road.support}</span>}
                  {road.against > 0 && <span style={{ fontSize: '0.68rem', color: '#dc2626', background: '#ef444415', padding: '1px 6px', borderRadius: 8 }}>Against: {road.against}</span>}
                  {road.undecided > 0 && <span style={{ fontSize: '0.68rem', color: '#d97706', background: '#f59e0b15', padding: '1px 6px', borderRadius: 8 }}>?: {road.undecided}</span>}
                  {road.not_home > 0 && <span style={{ fontSize: '0.68rem', color: '#6B5D4F', background: 'rgba(0,0,0,0.05)', padding: '1px 6px', borderRadius: 8 }}>NH: {road.not_home}</span>}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 6, flexDirection: 'column', alignItems: 'flex-end' }}>
              {road.status === 'not_started' && (
                <button onClick={() => onStatusChange(road.id, 'in_progress')} style={{
                  padding: '6px 12px', borderRadius: 8, border: '1px solid #f59e0b',
                  background: 'transparent', color: '#f59e0b', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600,
                }}>Start</button>
              )}
              {road.status === 'in_progress' && (
                <>
                  <button onClick={() => onStatusChange(road.id, 'done')} style={{
                    padding: '6px 12px', borderRadius: 8, border: 'none',
                    background: '#10b981', color: 'white', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600,
                  }}>Done</button>
                  <button onClick={() => onStatusChange(road.id, 'not_started')} style={{
                    padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(27,67,50,0.2)',
                    background: 'transparent', color: '#6B5D4F', fontSize: '0.7rem', cursor: 'pointer',
                  }}>Undo</button>
                </>
              )}
              {road.status === 'done' && (
                <button onClick={() => onStatusChange(road.id, 'in_progress')} style={{
                  padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(27,67,50,0.2)',
                  background: 'transparent', color: '#6B5D4F', fontSize: '0.7rem', cursor: 'pointer',
                }}>Undo</button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TalliesTab({ roads, onSaveTally }) {
  const [tallies, setTallies] = useState({});

  useEffect(() => {
    const initial = {};
    roads.forEach(r => {
      initial[r.id] = {
        support: r.support || 0,
        against: r.against || 0,
        undecided: r.undecided || 0,
        not_home: r.not_home || 0,
      };
    });
    setTallies(initial);
  }, [roads]);

  const update = (roadId, field, delta) => {
    setTallies(prev => ({
      ...prev,
      [roadId]: {
        ...prev[roadId],
        [field]: Math.max(0, (prev[roadId]?.[field] || 0) + delta),
      },
    }));
  };

  const Counter = ({ roadId, field, label, color }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
      <span style={{ fontSize: '0.78rem', color, minWidth: 70, fontWeight: 500 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={() => update(roadId, field, -1)} style={{
          width: 28, height: 28, borderRadius: '50%', border: '1px solid rgba(27,67,50,0.2)',
          background: 'transparent', color: 'var(--navy)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1,
        }}>−</button>
        <span style={{ color: 'var(--navy)', fontWeight: 700, minWidth: 24, textAlign: 'center', fontSize: '0.9rem' }}>
          {tallies[roadId]?.[field] || 0}
        </span>
        <button onClick={() => update(roadId, field, 1)} style={{
          width: 28, height: 28, borderRadius: '50%', border: '1px solid rgba(27,67,50,0.2)',
          background: 'rgba(27,67,50,0.05)', color: 'var(--navy)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1,
        }}>+</button>
      </div>
    </div>
  );

  return (
    <div>
      {roads.map(road => (
        <div key={road.id} style={{
          background: 'white',
          borderRadius: 10,
          padding: '12px 14px',
          marginBottom: 12,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <div style={{ color: 'var(--navy)', fontWeight: 600, marginBottom: 10, fontSize: '0.9rem' }}>{road.name}</div>
          <Counter roadId={road.id} field="support" label="Support" color="#059669" />
          <Counter roadId={road.id} field="against" label="Against" color="#dc2626" />
          <Counter roadId={road.id} field="undecided" label="Undecided" color="#d97706" />
          <Counter roadId={road.id} field="not_home" label="Not Home" color="#6B5D4F" />
          <button
            onClick={() => onSaveTally(road.id, tallies[road.id])}
            style={{
              marginTop: 8, width: '100%', padding: '8px', borderRadius: 8,
              border: 'none', background: 'var(--navy)', color: '#F5F0E6',
              fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
            }}
          >
            Save Tallies
          </button>
        </div>
      ))}
    </div>
  );
}

function CaseworkTab({ roads, casework, onAddCasework }) {
  const [form, setForm] = useState({ road_id: '', resident_name: '', address: '', contact: '', issue: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.road_id || !form.issue.trim()) return;
    setSaving(true);
    await onAddCasework(form.road_id, {
      resident_name: form.resident_name,
      address: form.address,
      contact: form.contact,
      issue: form.issue,
    });
    setForm({ road_id: '', resident_name: '', address: '', contact: '', issue: '' });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: 8,
    border: '1px solid rgba(27,67,50,0.15)', background: 'white',
    color: 'var(--navy)', fontSize: '0.85rem', boxSizing: 'border-box',
    fontFamily: 'inherit', outline: 'none',
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: 10, padding: 14, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ color: 'var(--navy)', fontWeight: 600, marginBottom: 12, fontSize: '0.9rem' }}>Log Casework</div>

        <select
          value={form.road_id}
          onChange={e => setForm(f => ({ ...f, road_id: e.target.value }))}
          required
          style={{ ...inputStyle, marginBottom: 8 }}
        >
          <option value="">Select road...</option>
          {roads.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>

        <input
          type="text"
          placeholder="Resident name (optional)"
          value={form.resident_name}
          onChange={e => setForm(f => ({ ...f, resident_name: e.target.value }))}
          style={{ ...inputStyle, marginBottom: 8 }}
        />
        <input
          type="text"
          placeholder="Address (optional)"
          value={form.address}
          onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
          style={{ ...inputStyle, marginBottom: 8 }}
        />
        <input
          type="text"
          placeholder="Contact number (optional)"
          value={form.contact}
          onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
          style={{ ...inputStyle, marginBottom: 8 }}
        />
        <textarea
          placeholder="Issue / note (required)"
          value={form.issue}
          onChange={e => setForm(f => ({ ...f, issue: e.target.value }))}
          required
          rows={3}
          style={{ ...inputStyle, marginBottom: 10, resize: 'vertical' }}
        />

        <button type="submit" disabled={saving} style={{
          width: '100%', padding: '10px', borderRadius: 8, border: 'none',
          background: saved ? '#10b981' : 'var(--navy)', color: '#F5F0E6',
          fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
          transition: 'background 0.3s',
        }}>
          {saved ? '✓ Saved' : saving ? 'Saving...' : 'Log Issue'}
        </button>
      </form>

      {casework.length > 0 && (
        <div>
          <div style={{ color: '#6B5D4F', fontSize: '0.75rem', marginBottom: 8 }}>
            {casework.length} case{casework.length !== 1 ? 's' : ''} logged
          </div>
          {casework.map(c => (
            <div key={c.id} style={{
              background: 'white',
              borderRadius: 8, padding: '10px 12px', marginBottom: 8,
              borderLeft: '3px solid var(--cyan)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}>
              <div style={{ fontSize: '0.72rem', color: '#6B5D4F', marginBottom: 4 }}>
                {c.road_name} · {c.volunteer_name} · {new Date(c.created_at).toLocaleDateString()}
              </div>
              {c.resident_name && <div style={{ color: 'var(--navy)', fontSize: '0.82rem', fontWeight: 600 }}>{c.resident_name}</div>}
              {c.address && <div style={{ color: '#4A3F32', fontSize: '0.78rem' }}>{c.address}</div>}
              {c.contact && <div style={{ color: '#4A3F32', fontSize: '0.78rem' }}>{c.contact}</div>}
              <div style={{ color: 'var(--navy)', fontSize: '0.82rem', marginTop: 4 }}>{c.issue}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CanvassGroupView() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { activeCanvassGroup, loadCanvassGroup, updateRoadStatus, updateRoadTally, addCasework } = useTrackerStore();
  const [tab, setTab] = useState('roads');
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    loadCanvassGroup(groupId);
  }, [groupId]);

  if (!activeCanvassGroup || String(activeCanvassGroup.id) !== String(groupId)) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#6B5D4F' }}>
        Loading...
      </div>
    );
  }

  const group = activeCanvassGroup;
  const done = group.roads?.filter(r => r.status === 'done').length || 0;
  const total = group.roads?.length || 0;

  const handleStatusChange = async (roadId, status) => {
    setSaving(roadId);
    await updateRoadStatus(roadId, status);
    setSaving(null);
  };

  const handleSaveTally = async (roadId, data) => {
    setSaving(roadId);
    await updateRoadTally(roadId, data);
    setSaving(null);
  };

  const handleAddCasework = async (roadId, data) => {
    await addCasework(roadId, data);
  };

  const tabs = [
    { id: 'roads', label: 'Roads' },
    { id: 'tallies', label: 'Tallies' },
    { id: 'casework', label: `Casework${group.casework?.length ? ` (${group.casework.length})` : ''}` },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 'calc(var(--nav-height) + 24px)' }}>
      <div style={{
        background: 'var(--navy)',
        borderBottom: '2px solid var(--cyan)',
        padding: '16px 16px 0',
      }}>
        <button
          onClick={() => navigate('/canvass')}
          style={{
            background: 'none', border: 'none', color: 'var(--cyan)', cursor: 'pointer',
            fontSize: '0.8rem', padding: 0, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          ‹ All Groups
        </button>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{
            background: 'var(--cyan)', color: 'var(--navy)', fontWeight: 700,
            fontSize: '0.7rem', padding: '2px 8px', borderRadius: 10,
            fontFamily: "'Playfair Display', Georgia, serif",
          }}>G{group.number}</span>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '1.2rem', color: '#F5F0E6', margin: 0,
          }}>{group.name}</h1>
        </div>
        <div style={{ color: 'rgba(245,240,230,0.5)', fontSize: '0.75rem', margin: '4px 0 10px' }}>
          {group.assignee} · Week {group.week} · {done}/{total} done
        </div>

        <div style={{ display: 'flex', gap: 0 }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '8px 16px',
                background: 'none', border: 'none',
                borderBottom: tab === t.id ? '3px solid var(--cyan)' : '3px solid transparent',
                color: tab === t.id ? 'var(--cyan)' : 'rgba(245,240,230,0.5)',
                cursor: 'pointer', fontSize: '0.82rem', fontWeight: tab === t.id ? 700 : 400,
                transition: 'all 0.2s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {tab === 'roads' && (
          <RoadsTab
            roads={group.roads || []}
            onStatusChange={handleStatusChange}
          />
        )}
        {tab === 'tallies' && (
          <TalliesTab
            roads={group.roads || []}
            onSaveTally={handleSaveTally}
          />
        )}
        {tab === 'casework' && (
          <CaseworkTab
            roads={group.roads || []}
            casework={group.casework || []}
            onAddCasework={handleAddCasework}
          />
        )}
      </div>
    </div>
  );
}
