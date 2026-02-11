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

  // Check Cloudflare Access header
  const email = req.headers['cf-access-authenticated-user-email'];
  if (email && ADMIN_EMAILS.includes(email.toLowerCase())) {
    req.adminEmail = email.toLowerCase();
    return next();
  }

  return res.status(403).json({ error: 'Forbidden' });
}

module.exports = adminAuth;
