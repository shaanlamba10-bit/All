'use strict';
// routes/payments.js

const router = require('express').Router();
const { charges, idempotency, nextChargeId } = require('../store');

router.post('/', (req, res) => {
  const key = req.headers['idempotency-key'];

  if (typeof key !== 'string' || !key.trim()) {
    return res.status(400).json({
      error: {
        code: 'IDEMPOTENCY_KEY_REQUIRED',
        message: 'Idempotency-Key header is required'
      }
    });
  }

  const previous = idempotency.get(key);
  if (previous) {
    return res.status(previous.status).json(previous.body);
  }

  const amount = req.body && req.body.amount;
  const body = {
    id: nextChargeId(),
    amount,
    status: 'charged'
  };

  charges.push(body);
  idempotency.set(key, { status: 201, body });

  return res.status(201).json(body);
});

module.exports = router;
