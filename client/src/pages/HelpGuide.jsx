import { useState } from 'react';

const roles = [
  {
    id: 'leafleteer',
    emoji: '📬',
    title: 'Leafleteers',
    subtitle: 'Delivering leaflets door-to-door',
    sections: [
      {
        title: 'Getting Started',
        items: [
          'Enter your name on the welcome screen — your name is remembered so you only need to do this once.',
          'You can use any device — phone, tablet, or computer. Phone is best for on-the-go.',
        ],
      },
      {
        title: 'Finding Your Walk',
        items: [
          'Tap Walks in the bottom nav to see pre-planned routes.',
          'Each walk covers a set of streets in a sensible order — around 100–500 houses.',
          'If you\'ve been given a specific walk by your organiser, tap it to open the map and street list.',
        ],
      },
      {
        title: 'Marking Deliveries',
        items: [
          'As you finish each street, tap it in the walk view to mark it complete.',
          'You can also go to Zones, find the street, and tap "Mark Complete" there.',
          'If you tap a street by mistake, go to Zones → find the street → tap Undo.',
        ],
      },
      {
        title: 'Using the Map',
        items: [
          'The Map tab shows all streets on a real map of the ward.',
          'Green = complete, coloured = assigned to someone, grey = still needed.',
          'Switch to Heat Map to see where effort is most needed.',
        ],
      },
      {
        title: 'Rankings & Achievements',
        items: [
          'The Rankings tab shows the leaderboard by houses delivered.',
          'Earn badges like "Century Club" (100+ houses) and "Postie Pro" (500+).',
          'Complete every street in a zone to earn "Zone Champion"!',
        ],
      },
    ],
  },
  {
    id: 'canvasser',
    emoji: '🗣️',
    title: 'Canvassers',
    subtitle: 'Knocking doors and recording responses',
    sections: [
      {
        title: 'Getting Started',
        items: [
          'Enter your name on the welcome screen, then tap Canvass in the bottom nav.',
          'You\'ll see 9 road groups covering Leigh Ward, each assigned to a canvasser.',
          'Find your group (your organiser will tell you which one) and tap it.',
        ],
      },
      {
        title: 'On the Doorstep',
        items: [
          'Each road group contains a list of roads. Tap a road to start canvassing it.',
          'For each door, record the response: For (supportive), Against, Undecided, or Not Home.',
          'Tap the tally buttons — they update instantly. No need to save.',
        ],
      },
      {
        title: 'Casework',
        items: [
          'If a resident raises a local issue (potholes, bins, antisocial behaviour etc.), tap the casework button on that road.',
          'Note down their name, address, and the issue — this gets passed to the candidate.',
          'Casework is one of the most valuable things we can collect on the doorstep.',
        ],
      },
      {
        title: 'Progress Tracking',
        items: [
          'Each road group shows a progress bar — how many roads have been canvassed.',
          'Tally chips show the running totals: For, Against, Undecided, Not Home.',
          'Your organiser can see all groups at a glance from the Canvass overview.',
        ],
      },
    ],
  },
  {
    id: 'admin',
    emoji: '⚙️',
    title: 'Admins',
    subtitle: 'Managing the campaign from the dashboard',
    sections: [
      {
        title: 'Accessing Admin',
        items: [
          'Go to /admin or tap the gear icon in the header (requires SSO login).',
          'The admin panel lets you manage streets, volunteers, walks, candidates, and poster boards.',
        ],
      },
      {
        title: 'Managing Volunteers',
        items: [
          'Admin → Volunteers shows everyone who has registered.',
          'Tap a volunteer to see their delivery history, assigned streets, and stats.',
          'You can add notes to any volunteer (e.g. "available weekends only").',
        ],
      },
      {
        title: 'Managing Streets & Zones',
        items: [
          'Admin → Streets lets you filter, search, and bulk-manage streets.',
          'You can reassign completed streets, undo completions, or adjust house counts.',
          'Zone assignments are fixed in the database — speak to the developer to reorganise zones.',
        ],
      },
      {
        title: 'Creating Walks',
        items: [
          'Admin → Walks lets you create pre-planned delivery routes.',
          'Pick streets from the map or list, drag to reorder, and name the walk.',
          'Share the walk URL with a volunteer — they\'ll see the route on a map with street-by-street progress.',
        ],
      },
      {
        title: 'Canvass Groups',
        items: [
          'Canvass groups are managed in the database — each group has a number, name, assignee, and week.',
          'Canvass tallies and casework notes flow in from canvassers in real time.',
          'Use the Canvass overview to monitor progress across all 9 groups.',
          'For a detailed guide to the canvassing admin columns and casework handling, see the Canvassing Admin Help page at /canvassing-help.html.',
        ],
      },
      {
        title: 'Candidates & Poster Boards',
        items: [
          'Admin → Candidates tracks candidates across all 17 wards.',
          'Admin → Poster Boards maps poster board locations for the campaign.',
        ],
      },
    ],
  },
];

export default function HelpGuide() {
  const [activeRole, setActiveRole] = useState(null);

  if (activeRole) {
    const role = roles.find(r => r.id === activeRole);
    return (
      <div className="page">
        <button
          onClick={() => setActiveRole(null)}
          style={{
            background: 'none',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            fontFamily: "'Libre Baskerville', Georgia, serif",
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          ← Back to Guide
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 20,
        }}>
          <span style={{ fontSize: '1.8rem' }}>{role.emoji}</span>
          <div>
            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.4rem',
              color: 'var(--navy)',
              margin: 0,
            }}>{role.title}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '2px 0 0' }}>
              {role.subtitle}
            </p>
          </div>
        </div>

        {role.sections.map((section, i) => (
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
                    lineHeight: 1.6,
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

  return (
    <div className="page">
      <h1 className="page-title">How to Use</h1>

      <div className="card" style={{ padding: '16px 18px', marginBottom: 20 }}>
        <p style={{
          fontSize: '0.88rem',
          lineHeight: 1.7,
          color: 'var(--text-secondary)',
          margin: 0,
        }}>
          This app tracks leaflet deliveries and canvassing across Leigh Ward
          for the Southend Liberal Democrats. Pick your role below to see how
          to get started.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {roles.map((role, i) => (
          <button
            key={role.id}
            onClick={() => setActiveRole(role.id)}
            className="card"
            style={{
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              textAlign: 'left',
              width: '100%',
              cursor: 'pointer',
              transition: 'all 0.2s',
              animation: `fadeInUp 0.3s ease ${i * 0.08}s both`,
              border: '2px solid var(--border-light)',
            }}
          >
            <span style={{
              fontSize: '2rem',
              flexShrink: 0,
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--navy)',
              borderRadius: 12,
            }}>
              {role.emoji}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--navy)',
                marginBottom: 2,
              }}>
                {role.title}
              </div>
              <div style={{
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.4,
              }}>
                {role.subtitle}
              </div>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>›</span>
          </button>
        ))}
      </div>

      <div className="card" style={{
        padding: '14px 18px',
        marginTop: 20,
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
