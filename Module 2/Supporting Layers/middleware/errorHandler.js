/**
 * Central error handler — STARTER.
 *
 * PROBLEMS:
 *   - AppError is DEFINED again here (also defined in services/articlesService.js).
 *     After you create utils/AppError.js, delete both copies and import the shared one.
 *   - process.env.NODE_ENV is read directly here. It should come from config.nodeEnv.
 */

const AppError = require('../utils/AppError');

// INLINE process.env read — should move to config/index.js (config.nodeEnv)
const NODE_ENV = require('../config').nodeEnv;

module.exports = function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const body = { error: err.message || 'Internal Server Error' };

  // Only leak stack traces outside production.
  if (NODE_ENV !== 'production' && err.stack) {
    body.stack = err.stack;
  }

  res.status(status).json(body);
};

// Exported so other files currently import AppError from here too (messy).
module.exports.AppError = AppError;
