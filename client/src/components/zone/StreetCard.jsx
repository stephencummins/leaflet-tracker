import { useState } from 'react';
import useTrackerStore from '../../stores/useTrackerStore';

export default function StreetCard({ street, zoneColor, onComplete }) {
  const [loading, setLoading] = useState(false);
  const volunteer = useTrackerStore(s => s.volunteer);
  const assignStreet = useTrackerStore(s => s.assignStreet);
  const unassignStreet = useTrackerStore(s => s.unassignStreet);
  const uncompleteStreet = useTrackerStore(s => s.uncompleteStreet);

  const isAssignedToMe = street.assigned_volunteer_id === volunteer?.id;
  const isAssigned = !!street.assigned_volunteer_id;
  const isComplete = !!street.is_complete;

  const handleAssign = async () => {
    setLoading(true);
    try { await assignStreet(street.id); } finally { setLoading(false); }
  };

  const handleUnassign = async () => {
    setLoading(true);
    try { await unassignStreet(street.id); } finally { setLoading(false); }
  };

  const handleComplete = async () => {
    setLoading(true);
    try { await onComplete(street.id); } finally { setLoading(false); }
  };

  const handleUncomplete = async () => {
    setLoading(true);
    try { await uncompleteStreet(street.id); } finally { setLoading(false); }
  };

  return (
    <div
      className="card"
      style={{
        borderLeft: `5px solid ${isComplete ? 'var(--success)' : zoneColor}`,
        opacity: isComplete ? 0.7 : 1,
        transition: 'all 0.25s cubic-bezier(0.25,0.46,0.45,0.94)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Complete state background wash */}
      {isComplete && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, var(--success-bg) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
      )}

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 10,
        position: 'relative',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontWeight: 600,
            fontSize: '0.9rem',
            marginBottom: 5,
            display: 'flex',
            alignItems: 'center',
            gap: 7,
          }}>
            {isComplete && (
              <span style={{
                color: 'white',
                background: 'var(--success)',
                width: 18,
                height: 18,
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.65rem',
                fontWeight: 800,
                flexShrink: 0,
              }}>
                ✓
              </span>
            )}
            <span style={{
              textDecoration: isComplete ? 'line-through' : 'none',
              color: isComplete ? 'var(--text-muted)' : 'var(--text)',
              textDecorationColor: 'var(--text-muted)',
            }}>
              {street.name}
            </span>
          </div>
          <div style={{
            fontSize: '0.76rem',
            color: 'var(--text-muted)',
            fontWeight: 500,
            paddingLeft: isComplete ? 25 : 0,
          }}>
            {street.house_count} houses
            {isAssigned && !isComplete && (
              <> · <span style={{
                color: zoneColor,
                fontWeight: 600,
                background: `${zoneColor}10`,
                padding: '1px 6px',
                borderRadius: 4,
                fontSize: '0.72rem',
              }}>
                {isAssignedToMe ? 'You' : street.assigned_volunteer_name}
              </span></>
            )}
            {isComplete && street.completed_by_name && (
              <> · {street.completed_by_name}</>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
          {!isComplete && (
            <>
              {!isAssigned ? (
                <ActionButton
                  onClick={handleAssign}
                  loading={loading}
                  variant="secondary"
                >
                  Claim
                </ActionButton>
              ) : isAssignedToMe ? (
                <ActionButton
                  onClick={handleUnassign}
                  loading={loading}
                  variant="ghost"
                >
                  Drop
                </ActionButton>
              ) : null}
              <ActionButton
                onClick={handleComplete}
                loading={loading}
                variant="primary"
              >
                Done
              </ActionButton>
            </>
          )}
          {isComplete && (
            <ActionButton
              onClick={handleUncomplete}
              loading={loading}
              variant="ghost"
            >
              Undo
            </ActionButton>
          )}
        </div>
      </div>
    </div>
  );
}

function ActionButton({ children, onClick, loading, variant }) {
  const styles = {
    primary: {
      background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)',
      color: 'white',
      boxShadow: '0 2px 8px rgba(15,43,60,0.2)',
    },
    secondary: {
      background: 'var(--bg)',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-muted)',
      fontSize: '0.72rem',
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        padding: '7px 14px',
        borderRadius: 10,
        fontSize: '0.78rem',
        fontWeight: 600,
        minHeight: 34,
        transition: 'all 0.2s',
        opacity: loading ? 0.5 : 1,
        ...styles[variant],
      }}
    >
      {children}
    </button>
  );
}
