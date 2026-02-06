export default function StatsRow({ stats }) {
  if (!stats) return null;

  const items = [
    { label: 'Streets', value: stats.ward.completed_streets, total: stats.ward.total_streets, icon: '🛣️' },
    { label: 'Houses', value: stats.ward.completed_houses, total: stats.ward.total_houses, icon: '🏠' },
    { label: 'Volunteers', value: stats.topVolunteers.length, total: null, icon: '👥' },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 10,
      animation: 'fadeInUp 0.4s ease 0.1s both',
    }}>
      {items.map(item => (
        <div key={item.label} className="card" style={{
          textAlign: 'center',
          padding: '14px 8px 12px',
        }}>
          <div style={{ fontSize: '1rem', marginBottom: 4 }}>{item.icon}</div>
          <div style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: '1.2rem',
            fontWeight: 800,
            color: 'var(--navy)',
            letterSpacing: '-0.02em',
          }}>
            {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
          </div>
          {item.total !== null && (
            <div style={{
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              fontWeight: 500,
            }}>
              of {item.total.toLocaleString()}
            </div>
          )}
          <div style={{
            fontSize: '0.68rem',
            color: 'var(--text-secondary)',
            fontWeight: 600,
            marginTop: 2,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
