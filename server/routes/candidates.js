const { Router } = require('express');
const db = require('../db/connection');

const router = Router();

// GET /api/candidates - all candidates ordered by ward
router.get('/', (req, res) => {
  const candidates = db.prepare('SELECT * FROM candidates ORDER BY ward').all();
  res.json(candidates);
});

// PUT /api/candidates/:id - update a candidate
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {
    candidate_name, ward, is_paper, confirmed, agent, notes,
    proposer, seconder, consent_signed, nomination_submitted,
    nomination_paper, home_address_form, certificate_of_authorisation,
    emblem_request, agent_appointment, proposer_seconder_confirmed,
    assenters_count, assenters_names, on_electoral_register,
    party_authorised, email, phone, mobile, address, home_ward,
    briefing_scheduled, briefing_completed,
  } = req.body;

  const stmt = db.prepare(`
    UPDATE candidates SET
      candidate_name = ?, ward = ?, is_paper = ?, confirmed = ?, agent = ?, notes = ?,
      proposer = ?, seconder = ?, consent_signed = ?, nomination_submitted = ?,
      nomination_paper = ?, home_address_form = ?, certificate_of_authorisation = ?,
      emblem_request = ?, agent_appointment = ?, proposer_seconder_confirmed = ?,
      assenters_count = ?, assenters_names = ?, on_electoral_register = ?,
      party_authorised = ?, email = ?, phone = ?, mobile = ?, address = ?, home_ward = ?,
      briefing_scheduled = ?, briefing_completed = ?
    WHERE id = ?
  `);

  stmt.run(
    candidate_name, ward, is_paper ? 1 : 0, confirmed ? 1 : 0, agent, notes || '',
    proposer || '', seconder || '', consent_signed ? 1 : 0, nomination_submitted ? 1 : 0,
    nomination_paper ? 1 : 0, home_address_form ? 1 : 0, certificate_of_authorisation ? 1 : 0,
    emblem_request ? 1 : 0, agent_appointment ? 1 : 0, proposer_seconder_confirmed ? 1 : 0,
    assenters_count || 0, assenters_names || '', on_electoral_register ? 1 : 0,
    party_authorised ? 1 : 0, email || '', phone || '', mobile || '', address || '', home_ward || '',
    briefing_scheduled || '', briefing_completed ? 1 : 0,
    id
  );

  const updated = db.prepare('SELECT * FROM candidates WHERE id = ?').get(id);
  if (!updated) return res.status(404).json({ error: 'Candidate not found' });
  res.json(updated);
});

module.exports = router;
