const MEDALS = ['🥇', '🥈', '🥉'];
const MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

export default function RankingTable({ volunteers }) {
  if (!volunteers || volunteers.length === 0) {
    return (
      <div className="card" style={{
        textAlign: 'center',
        padding: '40px 24px',
        color: 'var(--text-muted)',
        fontStyle: 'italic',
      }}>
        No deliveries yet. Be the first on the board!
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {volunteers.map((v, i) => (
        <div
          key={v.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '16px 18px',
            borderBottom: i < volunteers.length - 1 ? '1px solid var(--border-light)' : 'none',
            background: i === 0
              ? 'linear-gradient(90deg, rgba(255,215,0,0.08) 0%, transparent 80%)'
              : i < 3
                ? `linear-gradient(90deg, ${MEDAL_COLORS[i]}08 0%, transparent 60%)`
                : 'transparent',
            animation: `fadeInUp 0.3s ease ${i * 0.06}s both`,
          }}
        >
          {/* Rank */}
          <div style={{
            width: 32,
            height: 32,
            borderRadius: i < 3 ? '50%' : 8,
            background: i < 3 ? `${MEDAL_COLORS[i]}18` : 'var(--bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: i < 3 ? '1.1rem' : '0.8rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            flexShrink: 0,
          }}>
            {i < 3 ? MEDALS[i] : i + 1}
          </div>

          {/* Name + details */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontWeight: 700,
              fontSize: '0.92rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: 'var(--text)',
            }}>
              {v.name}
            </div>
            <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {v.streets_delivered} streets · {v.zones_delivered} zone{v.zones_delivered !== 1 ? 's' : ''}
            </div>
            {v.notes && (
              <div style={{
                fontSize: '0.68rem',
                color: 'var(--amber)',
                fontStyle: 'italic',
                marginTop: 3,
                lineHeight: 1.3,
              }}>
                *{v.notes}
              </div>
            )}
          </div>

          {/* Score */}
          <div style={{
            textAlign: 'right',
            flexShrink: 0,
          }}>
            <div style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 800,
              fontSize: '1.1rem',
              color: 'var(--navy)',
              letterSpacing: '-0.02em',
            }}>
              {v.houses_delivered.toLocaleString()}
            </div>
            <div style={{
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              houses
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
