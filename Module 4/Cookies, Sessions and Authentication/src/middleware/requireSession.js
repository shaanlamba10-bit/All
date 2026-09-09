const sessionStore = require('../session/sessionStore');

module.exports = function requireSession(req, res, next) {
  const session = sessionStore.get(req.signedCookies && req.signedCookies.sid);
  if (!session) {
    return res.status(401).json({ error: { code: 'AUTH_REQUIRED', message: 'Authentication required' } });
  }
  req.userId = session.userId;
  req.session = session;
  next();
};
