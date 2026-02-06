import { ACHIEVEMENT_LIST } from '../../utils/achievements';

export default function BadgeGrid({ earned }) {
  const earnedSet = new Set(earned || []);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 10,
    }}>
      {ACHIEVEMENT_LIST.map((a, i) => {
        const unlocked = earnedSet.has(a.id);
        return (
          <div
            key={a.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '14px 6px 10px',
              borderRadius: 14,
              background: unlocked ? 'var(--card)' : 'var(--bg)',
              boxShadow: unlocked ? 'var(--shadow-md)' : 'none',
              border: unlocked ? '1px solid var(--border-light)' : '1px solid transparent',
              opacity: unlocked ? 1 : 0.35,
              transition: 'all 0.3s',
              animation: unlocked ? `fadeInUp 0.3s ease ${i * 0.05}s both` : 'none',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Glow effect for unlocked */}
            {unlocked && (
              <div style={{
                position: 'absolute',
                top: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'var(--amber-glow)',
                filter: 'blur(8px)',
                pointerEvents: 'none',
                animation: 'glow-breathe 3s ease-in-out infinite',
              }} />
            )}
            <span style={{
              fontSize: '1.6rem',
              marginBottom: 6,
              position: 'relative',
              filter: unlocked ? 'none' : 'grayscale(1)',
            }}>
              {a.icon}
            </span>
            <span style={{
              fontSize: '0.6rem',
              fontWeight: 700,
              color: unlocked ? 'var(--text)' : 'var(--text-muted)',
              textAlign: 'center',
              lineHeight: 1.25,
              letterSpacing: '0.01em',
            }}>
              {a.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
