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
          'You\'ll see road groups for your ward, each assigned to a canvasser.',
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
        title: 'Understanding the Tallies',
        items: [
          'Support (green) — resident said they support LibDems.',
          'Against (red) — resident said they will not vote LibDem.',
          'Undecided (amber) — resident was unsure or open to persuasion.',
          'Not Home (grey) — nobody answered. May be worth revisiting.',
        ],
      },
      {
        title: 'Casework',
        items: [
          'If a resident raises a local issue (potholes, bins, antisocial behaviour etc.), tap the casework button on that road.',
          'Note down their name, address, contact details, and the issue — this gets passed to the candidate.',
          'Casework is one of the most valuable things we can collect on the doorstep.',
          'Casework issues should be followed up and may be logged in Casewerk for full tracking.',
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
    id: 'candidate',
    emoji: '🗳️',
    title: 'Candidates',
    subtitle: 'Standing for election in your ward',
    sections: [
      {
        title: 'Can I Stand?',
        items: [
          'You must be 18 or over on the day of the election.',
          'You must be a British, Irish, Commonwealth, or EU citizen.',
          'You must meet at least one of these: be registered to vote in the ward; have lived, worked, or owned property there for the 12 months before nomination day.',
          'You cannot stand if you work for the council, are bankrupt, have been convicted of a corrupt or illegal practice, or are serving a prison sentence of 3+ months.',
        ],
      },
      {
        title: 'Getting Nominated',
        items: [
          'You need a nomination form signed by a proposer and seconder, plus 8 assenters — all registered to vote in your ward (10 people total).',
          'You also need a home address form and a consent to nomination form — both signed by you.',
          'Your consent to nomination must be witnessed — there are no restrictions on who can be the witness, so your proposer, seconder, or election agent can all witness it.',
          'All forms must be hand-delivered to the Returning Officer by 4pm on the nomination deadline. Posting is not accepted.',
          'Ask the council\'s elections team for the exact deadline date and submission location.',
        ],
      },
      {
        title: 'Spending Limits',
        items: [
          'For most local council wards in England, the limit is £740 plus 6p per registered elector.',
          'For county council divisions the rate is 9p per elector instead.',
          'Only spending authorised by your Election Agent counts towards the limit.',
          'The spending period runs from when you formally become a candidate (after nominations close) until polling day.',
          'Keep receipts for everything — you\'ll need them for your expenses return.',
        ],
      },
      {
        title: 'What Counts as Spending?',
        items: [
          'Printed materials: leaflets, posters, letters, and banners.',
          'Advertising: online ads, social media boosts, local press.',
          'Events: committee rooms, public meetings, canvassing refreshments.',
          'Staff or contractors paid to work on your campaign.',
          'Volunteer time and donated goods/services are generally not counted, but donations of money toward those costs are.',
        ],
      },
      {
        title: 'Imprints',
        items: [
          'An imprint must appear on all printed campaign material — leaflets, posters, letters, and flyers.',
          'It must include: the name and address of the printer, and the name and address of the promoter (usually the candidate or agent).',
          'Example: "Promoted by Jane Smith on behalf of the Liberal Democrats, both at 12 High Street, Southend-on-Sea SS1 1AA. Printed by ABC Print Co, 5 Mill Road, London EC1 1BB."',
          'Check Electoral Commission guidance for the latest rules on digital imprints.',
          'Leaving off the imprint is a criminal offence.',
        ],
      },
      {
        title: 'Donations',
        items: [
          'You can only accept donations from "permissible" sources — broadly: UK-registered individuals, companies, trade unions, and political parties.',
          'You cannot accept anonymous cash donations over £50.',
          'Any single donation over £50 must be reported to the Returning Officer after the election.',
          'If you receive a donation from an impermissible source you must return it within 30 days.',
        ],
      },
      {
        title: 'Voter ID',
        items: [
          'Since May 2023, voters in England must show photo ID at the polling station.',
          'Accepted ID includes: passport, driving licence, Blue Badge, and some concessionary travel cards.',
          'Voters without ID can apply for a free Voter Authority Certificate from their council.',
          'Brief your volunteers so they can help residents who ask about this on the doorstep.',
        ],
      },
      {
        title: 'After the Election',
        items: [
          'Within 35 days of the result, your Election Agent must submit an expenses return to the Returning Officer.',
          'The return must list all spending and donations received during the campaign.',
          'Attach receipts for every payment over £20.',
          'The return is a public document — anyone can inspect it.',
          'Failing to submit on time or submitting a false return is a criminal offence.',
        ],
      },
    ],
  },
  {
    id: 'agent',
    emoji: '📋',
    title: 'Election Agents',
    subtitle: 'Legal responsibility for candidate campaigns',
    sections: [
      {
        title: 'What Does an Agent Do?',
        items: [
          'Every candidate must have an Election Agent. If one isn\'t appointed, the candidate automatically becomes their own agent.',
          'The Agent is legally responsible for ensuring all spending stays within the limit and is reported correctly.',
          'You can be an agent for one or more candidates — there\'s no formal qualification needed.',
          'Tell the Returning Officer who your agent is on the nomination papers.',
        ],
      },
      {
        title: 'During the Campaign',
        items: [
          'Authorise all campaign spending — only spending you approve counts towards the limit.',
          'Keep a running log of all expenditure with receipts.',
          'Track all donations received and check they come from permissible sources.',
          'Make sure all printed material carries a correct imprint.',
        ],
      },
      {
        title: 'Expenses Return',
        items: [
          'Within 35 days of the result, you must submit an expenses return to the Returning Officer.',
          'The return lists all spending and donations for each candidate you represent.',
          'Attach receipts for every payment over £20.',
          'The return is a public document and failing to submit is a criminal offence.',
        ],
      },
      {
        title: 'Tracking in Roadie',
        items: [
          'Admin → Candidates shows all 17 wards with candidate details, agent assignments, and nomination status.',
          'Track nomination readiness: proposer, seconder, assenters, consent signed, and submission status.',
          'Monitor pack distribution: nomination papers, guidance notes, expenses forms, code of conduct, voter ID briefing, and canvassing rules.',
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
          'The admin panel lets you manage streets, volunteers, walks, candidates, canvassing, and poster boards.',
        ],
      },
      {
        title: 'Managing Volunteers',
        items: [
          'Admin → Volunteers shows everyone who has registered.',
          'Tap a volunteer to see their delivery history, assigned streets, and stats.',
          'You can add notes and phone numbers to any volunteer.',
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
        title: 'Canvassing Admin',
        items: [
          'Admin → Canvassing shows a real-time summary of all door-knocking activity.',
          'Summary stats at the top: Support, Against, Undecided, Not Home, Total doors, and Roads Done.',
          'The group table shows: group number, name, assignee, target week, roads done, and tallies (For / Against / ? / NH).',
          'Canvass tallies and casework notes flow in from canvassers in real time.',
        ],
      },
      {
        title: 'Canvassing Casework',
        items: [
          'When a canvasser logs a casework issue, it appears in the Casework section of the canvassing admin.',
          'Each entry shows: the group and road, which volunteer logged it, resident name/address, contact details, and the issue.',
          'To delete a casework entry, click Delete and confirm — this is permanent.',
          'Follow up casework issues and consider logging them in Casewerk for full tracking.',
        ],
      },
      {
        title: 'Candidates',
        items: [
          'Admin → Candidates tracks candidates across all 17 Southend wards.',
          'Track nomination readiness: proposer, seconder, assenters, consent, and submission status.',
          'Monitor pack contents: nomination papers, guidance notes, expenses forms, code of conduct, voter ID briefing, and canvassing rules.',
          'Record contact details, home ward, briefing status, and electoral register confirmation.',
          'See the Candidates section of this guide for what candidates need to know.',
        ],
      },
      {
        title: 'Poster Boards',
        items: [
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

        {role.id === 'candidate' && (
          <div className="card" style={{
            padding: '14px 18px',
            marginTop: 8,
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            borderLeft: '3px solid var(--cyan)',
          }}>
            For full official guidance, see the{' '}
            <a
              href="https://www.electoralcommission.org.uk/guidance-candidates-and-agents-local-government-elections-england"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--cyan)' }}
            >
              Electoral Commission guidance for candidates and agents →
            </a>
          </div>
        )}

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
      <h1 className="page-title">Roadie Guide</h1>

      <div className="card" style={{ padding: '16px 18px', marginBottom: 20 }}>
        <p style={{
          fontSize: '0.88rem',
          lineHeight: 1.7,
          color: 'var(--text-secondary)',
          margin: 0,
        }}>
          Roadie is the Southend Liberal Democrats campaign tool —
          covering leaflet delivery, door-to-door canvassing, candidate tracking,
          and election agent coordination across all wards. Pick your role below.
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
