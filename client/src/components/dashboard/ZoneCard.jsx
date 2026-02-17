import { useNavigate } from 'react-router-dom';

export default function ZoneCard({ zone }) {
  const navigate = useNavigate();
  const pct = zone.total_houses > 0
    ? Math.round((zone.completed_houses / zone.total_houses) * 100)
    : 0;
  const isDone = pct === 100;

  return (
    <button
      onClick={() => navigate(`/zones/${zone.id}`)}
      className="card"
      style={{
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        borderLeft: `5px solid ${isDone ? 'var(--success)' : zone.color}`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {/* Subtle zone color wash */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 120,
        height: '100%',
        background: `linear-gradient(90deg, transparent, ${zone.color}08)`,
        pointerEvents: 'none',
      }} />

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        position: 'relative',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 800,
            fontSize: '1.05rem',
            color: 'var(--navy)',
            letterSpacing: '-0.02em',
          }}>
            {zone.id === 'WOZ' ? 'WOZ/WAZ' : zone.id}
          </span>
        </div>
        <div style={{
          fontSize: '0.82rem',
          fontWeight: 700,
          color: isDone ? 'var(--success)' : zone.color,
          background: isDone ? 'var(--success-bg)' : `${zone.color}12`,
          padding: '3px 10px',
          borderRadius: 20,
        }}>
          {pct}%
        </div>
      </div>

      <div className="progress-bar" style={{ marginBottom: 10, height: 6 }}>
        <div
          className="progress-bar-fill"
          style={{
            width: `${pct}%`,
            background: isDone
              ? 'var(--success)'
              : `linear-gradient(90deg, ${zone.color}, ${zone.color}CC)`,
          }}
        />
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
        fontWeight: 500,
        position: 'relative',
      }}>
        <span>{zone.completed_streets}/{zone.total_streets} streets</span>
        <span>{zone.completed_houses.toLocaleString()}/{zone.total_houses.toLocaleString()} houses</span>
      </div>
    </button>
  );
}
