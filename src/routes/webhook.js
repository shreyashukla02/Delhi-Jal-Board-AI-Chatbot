const express = require('express');
const router = express.Router();
const { verifyWebhook, handleWebhook } = require('../controllers/webhookController');

// GET /webhook - Webhook verification
router.get('/', verifyWebhook);

// POST /webhook - Receive WhatsApp messages
router.post('/', handleWebhook);

module.exports = router;
