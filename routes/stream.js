const express = require('express');
const router = express.Router();
const { setupSSEConnection } = require('../services/sseService');

// SSE endpoint for dashboard
router.get('/', setupSSEConnection);

module.exports = router;
