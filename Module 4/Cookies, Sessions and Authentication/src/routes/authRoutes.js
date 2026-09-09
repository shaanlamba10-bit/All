const express = require('express');
const bcrypt = require('bcryptjs');
const prisma = require('../db/prisma');
const sessionStore = require('../session/sessionStore');
const requireSession = require('../middleware/requireSession');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  // TODO: validate credentials, create a server session, and set signed `sid` cookie.
  try {
    const user = await prisma.user.findUnique({ where: { email: req.body.email } });
    if (!user || !(await bcrypt.compare(req.body.password || '', user.passwordHash))) {
      return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
    }
    const sid = sessionStore.create(user.id);
    res.cookie('sid', sid, { signed: true, httpOnly: true, sameSite: 'lax', secure: process.env.COOKIE_SECURE === 'true', maxAge: 60 * 60 * 1000 });
    return res.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) { return next(error); }
});

router.get('/me', async (req, res, next) => {
  // TODO: resolve signed cookie through the server-side session store.
  try {
    const session = sessionStore.get(req.signedCookies && req.signedCookies.sid);
    if (!session) return res.status(401).json({ error: { code: 'AUTH_REQUIRED', message: 'Authentication required' } });
    const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { id: true, name: true, email: true } });
    return res.json({ user });
  } catch (error) { return next(error); }
});

router.post('/logout', async (req, res, next) => {
  // TODO: destroy server session and clear cookie using matching options.
  try {
    sessionStore.destroy(req.signedCookies && req.signedCookies.sid);
    res.clearCookie('sid', { signed: true, httpOnly: true, sameSite: 'lax', secure: process.env.COOKIE_SECURE === 'true' });
    return res.status(204).send();
  } catch (error) { return next(error); }
});

module.exports = router;
