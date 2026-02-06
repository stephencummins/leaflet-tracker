export default function WardProgressRing({ completed, total }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const size = 200;
  const stroke = 16;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '24px 0 16px',
      animation: 'fadeInUp 0.5s ease both',
    }}>
      <div style={{
        position: 'relative',
        width: size,
        height: size,
        filter: 'drop-shadow(0 4px 20px rgba(90,180,201,0.2))',
      }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth={stroke}
            opacity={0.6}
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--cyan)" />
              <stop offset="50%" stopColor="var(--cyan-light)" />
              <stop offset="100%" stopColor="var(--amber)" />
            </linearGradient>
          </defs>
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#progressGrad)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.25,0.46,0.45,0.94)' }}
          />
        </svg>
        {/* Center content */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: '3rem',
            fontWeight: 800,
            color: 'var(--navy)',
            lineHeight: 1,
            letterSpacing: '-0.04em',
          }}>
            {pct}
            <span style={{ fontSize: '1.5rem', fontWeight: 700, opacity: 0.6 }}>%</span>
          </span>
          <span style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            fontWeight: 600,
            marginTop: 2,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            of ward
          </span>
        </div>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 6,
        marginTop: 14,
        fontSize: '0.9rem',
      }}>
        <span style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontWeight: 800,
          fontSize: '1.15rem',
          color: 'var(--navy)',
        }}>
          {completed.toLocaleString()}
        </span>
        <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
          / {total.toLocaleString()} houses
        </span>
      </div>
    </div>
  );
}
