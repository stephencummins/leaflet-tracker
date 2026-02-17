export default function HelpGuide() {
  const sections = [
    {
      title: 'Getting Started',
      items: [
        'Enter your name on the welcome screen to join the campaign',
        'Your name is remembered so you only need to do this once',
        'You can use any device — phone, tablet, or computer',
      ],
    },
    {
      title: 'Dashboard',
      items: [
        'See overall ward progress — how many houses have been delivered to',
        'View each zone\'s completion percentage at a glance',
        'Recent activity shows the latest deliveries across all volunteers',
      ],
    },
    {
      title: 'Zones',
      items: [
        'The ward is divided into 8 zones (WJZ through WSZ)',
        'Tap a zone to see all its streets and their status',
        'Each street shows the house count and who delivered it',
      ],
    },
    {
      title: 'Marking Deliveries',
      items: [
        'Open a zone and find your street',
        'Tap "Assign to me" to claim an unassigned street',
        'Once you\'ve finished delivering, tap "Mark Complete"',
        'If you make a mistake, you can undo a completion',
      ],
    },
    {
      title: 'Map',
      items: [
        'See all streets plotted on a real map of Leigh-on-Sea',
        'Green markers = complete, coloured = assigned, grey = unassigned',
        'Tap any marker for street details',
        'Switch to Heat Map view to see where effort is still needed',
      ],
    },
    {
      title: 'Walks',
      items: [
        'Walks are pre-planned routes covering around 100–500 houses',
        'Tap Walks in the bottom nav to browse available routes',
        'Filter by house count to find a walk that suits your time',
        'Tap a walk to open its map — each street appears as a dot',
        'Tap a street dot or its name in the list to mark it delivered',
        'When all streets are done you\'ll get a completion celebration!',
        'If you tapped a street by mistake, go to Zones, find the street, and tap Undo',
      ],
    },
    {
      title: 'Rankings',
      items: [
        'The leaderboard ranks volunteers by total houses delivered',
        'Earn achievements like "Century Club" (100+ houses) and "Postie Pro" (500+)',
        'Complete an entire zone to earn "Zone Champion"',
      ],
    },
  ];

  return (
    <div className="page">
      <h1 className="page-title">How to Use</h1>

      <div className="card" style={{ padding: '16px 18px', marginBottom: 16 }}>
        <p style={{
          fontSize: '0.88rem',
          lineHeight: 1.7,
          color: 'var(--text-secondary)',
        }}>
          This app tracks leaflet deliveries across the West Leigh &amp; Leigh ward.
          Every street and house count is recorded so we know exactly where
          we've been and where still needs covering.
        </p>
      </div>

      {sections.map((section, i) => (
        <div key={i} style={{ marginBottom: 16, animation: `fadeInUp 0.3s ease ${i * 0.05}s both` }}>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--navy)',
            marginBottom: 8,
            letterSpacing: '0.02em',
          }}>
            {section.title}
          </h2>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {section.items.map((item, j) => (
              <div
                key={j}
                style={{
                  padding: '12px 16px',
                  fontSize: '0.82rem',
                  lineHeight: 1.5,
                  color: 'var(--text-secondary)',
                  borderBottom: j < section.items.length - 1 ? '1px solid var(--border-light)' : 'none',
                  display: 'flex',
                  gap: 10,
                }}
              >
                <span style={{
                  color: 'var(--cyan)',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  flexShrink: 0,
                  marginTop: 1,
                }}>
                  {j + 1}.
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="card" style={{
        padding: '14px 18px',
        marginTop: 8,
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        fontStyle: 'italic',
      }}>
        Questions? Speak to your zone coordinator or campaign organiser.
      </div>
    </div>
  );
}
