export default function AdminAgentsHelp() {
  const sections = [
    {
      title: "Where do I get nomination papers?",
      items: [
        <>Download the full nomination pack (PDF) from the Electoral Commission: <a href="https://www.electoralcommission.org.uk/sites/default/files/2026-01/Nomination%20pack%20incl%20election%20agent%20notification%20form%20LGE_0.pdf" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>Nomination pack download</a></>,
        "You can also collect a paper copy from Southend Council Electoral Services on 01702 215010.",
        "You can use the Electoral Commission forms even if the council produces their own versions.",
      ],
    },
    {
      title: "What's in the nomination pack?",
      items: [
        "Nomination form — the main form with the candidate's name, ward, and subscriber signatures.",
        "Home address form — declares whether your home address appears on the ballot paper.",
        "Consent to nomination — signed by the candidate confirming eligibility.",
        "Election Agent notification form — appoint your agent (Stephen Cummins for all Southend LibDem candidates).",
        "Certificate of authorisation — confirms the party has authorised you to use the party name and emblem.",
      ],
    },
    {
      title: "How many signatures do I need?",
      items: [
        "You need 2 subscribers — electors registered to vote in your ward.",
        "One is the proposer, one is the seconder.",
        "They sign the nomination form with their name and electoral number (found on the electoral register).",
        "Ask your Election Agent if you need help finding registered electors in your ward.",
      ],
    },
    {
      title: "What is the deadline?",
      items: [
        "Nominations close Thursday 9 April 2026 at 4pm.",
        "Do NOT leave it to the last day — submit early.",
        "Forms must be hand-delivered to the Returning Officer. Posting is not accepted.",
        "Book an informal check with the Elections Office a few days before the deadline — they will review your forms and flag any errors before the formal submission.",
      ],
    },
    {
      title: "Common mistakes to avoid",
      items: [
        "Not using black ink — all forms must be completed in black ink.",
        "Illegible handwriting — print clearly, especially names and addresses.",
        "Wrong ward name — double-check the exact official ward name.",
        "Missing signatures — make sure both you and your subscribers have signed every required field.",
        "Subscriber not registered in the ward — both must be on the electoral register for that specific ward.",
        "Forgetting the consent to nomination form — it's a separate form the candidate must sign.",
      ],
    },
    {
      title: "Who is my Election Agent?",
      items: [
        "For all Southend Liberal Democrat candidates, Stephen Cummins is acting as Election Agent.",
        "Contact: 07388 129800 or stephencummins@gmail.com.",
        "Stephen handles the Election Agent notification form — you don't need to worry about that one.",
        "If you have questions about any of the forms, contact Stephen before submitting.",
      ],
    },
    {
      title: "Certificate of authorisation",
      items: [
        "To stand as a Liberal Democrat candidate (with the party name and emblem on the ballot), you need a certificate of authorisation from the party.",
        "This is arranged through the local party — contact Stephen or Sam Bax.",
        "Without this certificate, you can still stand but only as an independent or with \"Liberal Democrat\" in your description if separately authorised.",
      ],
    },
    {
      title: "LibDem resources",
      items: [
        <>ALDC Nomination Forms Toolkit — step-by-step guide to every form: <a href="https://www.aldc.org/nomination-forms-toolkit/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>aldc.org/nomination-forms-toolkit</a></>,
        <>Everything You Need for May 2026: <a href="https://www.aldc.org/everything-you-need-for-may-2026/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>aldc.org/everything-you-need-for-may-2026</a></>,
        <>Local Election Agent Toolkit: <a href="https://www.aldc.org/local-election-agent-toolkit/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>aldc.org/local-election-agent-toolkit</a></>,
        <>Electoral Commission full guidance: <a href="https://www.electoralcommission.org.uk/guidance-candidates-and-agents-local-government-elections-england" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>electoralcommission.org.uk</a></>,
        <>Southend Elections 2026 info: <a href="https://www.southend.gov.uk/elections-registering-vote/elections-2026" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>southend.gov.uk/elections-2026</a></>,
      ],
    },
  ];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Agents Help</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>
          Everything you need to know about nomination papers for the May 2026 local elections.{' '}
          <a
            href="https://www.electoralcommission.org.uk/guidance-candidates-and-agents-local-government-elections-england/nominations"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}
          >
            Full Electoral Commission nominations guidance →
          </a>
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 760 }}>
        {sections.map((section, i) => (
          <div key={i} className="admin-card" style={{ padding: '20px 24px' }}>
            <h2 style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '1.05rem',
              color: 'var(--text)',
              marginBottom: 12,
              paddingBottom: 10,
              borderBottom: '1px solid var(--border-light)',
            }}>
              {section.title}
            </h2>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {section.items.map((item, j) => (
                <li key={j} style={{ display: 'flex', gap: 10, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <span style={{ color: 'var(--cyan)', flexShrink: 0, marginTop: 2 }}>›</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
