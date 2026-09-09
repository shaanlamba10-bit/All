// TODO: implement create/get/destroy around an in-memory Map.
// Store opaque session id -> { userId, expiresAt }, never credentials.
// Remove expired sessions during reads.
const crypto = require('crypto');
const sessions = new Map();
const DEFAULT_TTL_MS = 60 * 60 * 1000;

function create(userId, ttlMs = DEFAULT_TTL_MS) {
	const id = crypto.randomBytes(32).toString('hex');
	sessions.set(id, { userId, expiresAt: Date.now() + ttlMs });
	return id;
}

function get(id) {
	const session = sessions.get(id);
	if (!session) return null;
	if (session.expiresAt <= Date.now()) {
		sessions.delete(id);
		return null;
	}
	return session;
}

function destroy(id) {
	sessions.delete(id);
}

module.exports = { create, get, destroy };
