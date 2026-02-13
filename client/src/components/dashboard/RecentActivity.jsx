export default function RecentActivity({ recent }) {
  if (!recent || recent.length === 0) {
    return (
      <div className="card" style={{
        textAlign: 'center',
        padding: '32px 24px',
        color: 'var(--text-muted)',
        fontStyle: 'italic',
      }}>
        No deliveries yet — be the first!
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {recent.slice(0, 8).map((item, i) => {
        const time = formatTime(item.delivered_at);
        return (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              borderBottom: i < Math.min(recent.length, 8) - 1 ? '1px solid var(--border-light)' : 'none',
              animation: `slideIn 0.25s ease ${i * 0.04}s both`,
              transition: 'background 0.15s',
            }}
          >
            <div style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: item.zone_color,
              flexShrink: 0,
              boxShadow: `0 0 6px ${item.zone_color}40`,
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: 'var(--text)',
              }}>
                {item.street_name}
              </div>
              <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {item.volunteer_name} · {item.house_count} houses
              </div>
            </div>
            <div style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              flexShrink: 0,
              fontWeight: 500,
            }}>
              {time}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString("en-GB");
}
