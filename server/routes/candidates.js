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
    pack_nomination_papers, pack_guidance_notes, pack_expenses_forms,
    pack_code_of_conduct, pack_voter_id_briefing, pack_canvassing_rules,
    assenters_count, assenters_names, on_electoral_register,
    party_authorised, email, phone, mobile, address, home_ward,
    briefing_scheduled, briefing_completed,
  } = req.body;

  const stmt = db.prepare(`
    UPDATE candidates SET
      candidate_name = ?, ward = ?, is_paper = ?, confirmed = ?, agent = ?, notes = ?,
      proposer = ?, seconder = ?, consent_signed = ?, nomination_submitted = ?,
      pack_nomination_papers = ?, pack_guidance_notes = ?, pack_expenses_forms = ?,
      pack_code_of_conduct = ?, pack_voter_id_briefing = ?, pack_canvassing_rules = ?,
      assenters_count = ?, assenters_names = ?, on_electoral_register = ?,
      party_authorised = ?, email = ?, phone = ?, mobile = ?, address = ?, home_ward = ?,
      briefing_scheduled = ?, briefing_completed = ?
    WHERE id = ?
  `);

  stmt.run(
    candidate_name, ward, is_paper ? 1 : 0, confirmed ? 1 : 0, agent, notes || '',
    proposer || '', seconder || '', consent_signed ? 1 : 0, nomination_submitted ? 1 : 0,
    pack_nomination_papers ? 1 : 0, pack_guidance_notes ? 1 : 0, pack_expenses_forms ? 1 : 0,
    pack_code_of_conduct ? 1 : 0, pack_voter_id_briefing ? 1 : 0, pack_canvassing_rules ? 1 : 0,
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
