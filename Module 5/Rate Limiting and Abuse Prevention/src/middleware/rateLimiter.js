'use strict';
// middleware/rateLimiter.js

const rateLimit = require('express-rate-limit');

// In a multi-instance deployment, configure rate-limit-redis as the store for
// this limiter so every app instance shares the same counters and reset times.
// The default in-memory store is local to one process; behind a load balancer,
// requests can land on different instances and each would allow its own five
// attempts, making the effective limit much higher than intended.
module.exports = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});
