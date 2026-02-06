import { useEffect } from 'react';
import useTrackerStore from '../../stores/useTrackerStore';

export default function CelebrationOverlay() {
  const pending = useTrackerStore(s => s.pendingCelebrations);
  const clear = useTrackerStore(s => s.clearCelebration);

  const current = pending[0];

  useEffect(() => {
    if (!current) return;
    const timer = setTimeout(clear, 4000);
    return () => clearTimeout(timer);
  }, [current, clear]);

  if (!current) return null;

  return (
    <div
      onClick={clear}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        background: 'rgba(9,28,40,0.5)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        animation: 'fadeInUp 0.2s ease',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 24,
          padding: '40px 32px 32px',
          textAlign: 'center',
          maxWidth: 320,
          width: '90%',
          boxShadow: '0 24px 80px rgba(15,43,60,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
          animation: 'pop 0.5s cubic-bezier(0.25,0.46,0.45,0.94)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top glow */}
        <div style={{
          position: 'absolute',
          top: -20,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 120,
          height: 60,
          borderRadius: '50%',
          background: 'var(--amber-glow)',
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }} />

        <div style={{
          fontSize: '3.5rem',
          marginBottom: 14,
          animation: 'float 2s ease-in-out infinite',
          position: 'relative',
        }}>
          {current.icon || '🎉'}
        </div>
        <h3 style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: '1.4rem',
          fontWeight: 800,
          color: 'var(--navy)',
          marginBottom: 8,
          letterSpacing: '-0.03em',
        }}>
          {current.name}
        </h3>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          lineHeight: 1.5,
          fontWeight: 500,
        }}>
          {current.description}
        </p>
        <div style={{
          marginTop: 20,
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}>
          Tap to dismiss
        </div>
      </div>
    </div>
  );
}
