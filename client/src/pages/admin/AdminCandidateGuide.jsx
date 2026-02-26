export default function AdminCandidateGuide() {
  const sections = [
    {
      title: "Can I stand as a candidate?",
      items: [
        "You must be 18 or over on the day of the election.",
        "You must be a British, Irish, Commonwealth, or EU citizen.",
        "You must meet at least one of these: be registered to vote in the ward; have lived, worked, or owned property there for the 12 months before nomination day.",
        "You cannot stand if you work for the council you want to join, are bankrupt, have been convicted of a corrupt or illegal practice, or are serving a prison sentence of 3 months or more.",
      ],
    },
    {
      title: "How do I get nominated?",
      items: [
        "You need a nomination form signed by 2 people registered to vote in your ward — a proposer and a seconder.",
        "You also need a home address form and a consent to nomination form — both signed by you.",
        "All forms must be delivered to the Returning Officer by 4pm on the nomination deadline. Posting them is not accepted.",
        "Ask the council's elections team for the exact deadline date and where to submit.",
      ],
    },
    {
      title: "Do I need an Election Agent?",
      items: [
        "Every candidate must have an Election Agent. If you don't appoint one, you automatically become your own agent.",
        "The Agent is legally responsible for making sure spending is within the limit and reported correctly after the election.",
        "For Southend Liberal Democrat candidates, Stephen Cummins is acting as Election Agent. Contact him on 07388 129800 or stephencummins@gmail.com.",
        "Tell the Returning Officer who your agent is on your nomination papers.",
      ],
    },
    {
      title: "How much can I spend on my campaign?",
      items: [
        "For most local council wards in England, the limit is £740 plus 6p for every elector registered in the ward.",
        "For county council divisions the rate is 9p per elector instead.",
        "Only spending authorised by your Election Agent counts towards the limit.",
        "The spending period starts when you formally become a candidate (after the nomination deadline) and ends on polling day.",
        "Keep receipts for everything — you'll need them for your expenses return.",
      ],
    },
    {
      title: "What counts as campaign spending?",
      items: [
        "Printed materials: leaflets, posters, letters, and banners.",
        "Advertising: online ads, social media boosts, local press.",
        "Events: committee rooms, public meetings, canvassing refreshments.",
        "Staff or contractors paid to work on your campaign.",
        "Volunteer time and donated goods/services are generally not counted, but donations of money toward those costs are.",
      ],
    },
    {
      title: "What is an imprint and do I need one?",
      items: [
        "An imprint is a line of text that must appear on all printed campaign material — leaflets, posters, letters, and flyers.",
        "It must include: the name and address of the printer, and the name and address of the promoter (usually the candidate or agent).",
        "Our standard imprint is: \"Promoted by Paul Boulton on behalf of Stephen Cummins (Liberal Democrats), both at 379 Victoria Avenue, Southend-on-Sea, SS2 6NJ. Printed by Solopress, 9 Stock Road, Southend-on-Sea, SS2 5QF.\"",
        "There is no imprint requirement for most online content, but check the Electoral Commission guidance for the latest rules on digital imprints.",
        "Leaving off the imprint is a criminal offence.",
      ],
    },
    {
      title: "Can I accept donations?",
      items: [
        "You can only accept donations from \"permissible\" sources — broadly: UK-registered individuals, companies, trade unions, and political parties.",
        "You cannot accept cash donations of more than £50 without identifying the donor.",
        "Any single donation over £50 must be reported to the Returning Officer after the election.",
        "If you receive a donation from an impermissible source you must return it within 30 days.",
      ],
    },
    {
      title: "What do I need to do after the election?",
      items: [
        "Within 35 days of the result, your Election Agent must submit an expenses return to the Returning Officer.",
        "The return must list all spending and donations received during the campaign.",
        "Attach receipts for every payment over £20.",
        "The return is a public document — anyone can inspect it.",
        "Failing to submit on time or submitting a false return is a criminal offence.",
      ],
    },
    {
      title: "What is Voter ID?",
      items: [
        "Since May 2023, voters in England must show photo ID at the polling station.",
        "Accepted ID includes: passport, driving licence, Blue Badge, some concessionary travel cards, and more.",
        "Voters without ID can apply for a free Voter Authority Certificate from their council.",
        "As a candidate, brief your volunteers so they can help residents who ask about this.",
      ],
    },
  ];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Candidate Guide</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: 4 }}>
          Plain-English answers to common questions about standing as a local council candidate in England.{" "}
          <a
            href="https://www.electoralcommission.org.uk/guidance-candidates-and-agents-local-government-elections-england"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--text-muted)", textDecoration: "underline" }}
          >
            Full Electoral Commission guidance →
          </a>
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 760 }}>
        {sections.map((section, i) => (
          <div key={i} className="admin-card" style={{ padding: "20px 24px" }}>
            <h2 style={{
              fontFamily: "Playfair Display, Georgia, serif",
              fontSize: "1.05rem",
              color: "var(--text)",
              marginBottom: 12,
              paddingBottom: 10,
              borderBottom: "1px solid var(--border-light)",
            }}>
              {section.title}
            </h2>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {section.items.map((item, j) => (
                <li key={j} style={{ display: "flex", gap: 10, fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  <span style={{ color: "var(--cyan)", flexShrink: 0, marginTop: 2 }}>›</span>
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
