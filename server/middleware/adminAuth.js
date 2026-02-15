const { ssoAuth } = require('@s8n/auth/middleware');

// SSO auth with CF Access fallback — replaces old CF-only auth
module.exports = ssoAuth();
