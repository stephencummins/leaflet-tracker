const ADMIN_EMAILS = [
  'stephencummins@gmail.com',
];

function adminAuth(req, res, next) {
  // Bypass auth on localhost for local dev
  const host = req.hostname || req.headers.host || '';
  if (host === 'localhost' || host === '127.0.0.1' || host.startsWith('localhost:')) {
    req.adminEmail = 'dev@localhost';
    return next();
  }

  const email = req.headers['cf-access-authenticated-user-email'];
  if (!email || !ADMIN_EMAILS.includes(email.toLowerCase())) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  req.adminEmail = email.toLowerCase();
  next();
}

module.exports = adminAuth;
