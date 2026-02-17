const express = require('express');
const router = express.Router();
const { sendSSEMessage } = require('../services/sseService');
const { getIntention } = require('../services/bedrockService');
const { INTENTION_TO_AGENT } = require('../config/intentions');

// Receive notification from Plus AI system
// Plus AI sends an array of ChatMessage objects: [{content, conversationId, messageId, type, userId, ...}]
router.post('/chat-notification', async (req, res) => {
  try {
    // Handle both array format (from Plus AI) and object format (legacy/direct calls)
    const messages = Array.isArray(req.body) ? req.body : [req.body];

    // Find the latest user message
    const userMessage = [...messages].reverse().find(msg => msg.type === 'user');

    // Extract message content and userId
    const message = userMessage?.content || req.body.message;
    const userId = userMessage?.userId || req.body.userId;
    const timestamp = userMessage?.lastModified || req.body.timestamp;

    console.log('Received chat notification:', { message, userId, timestamp });

    // 1. Immediately notify dashboard to start animation
    await sendSSEMessage({
      type: 'chat_started',
      data: { message, userId, timestamp }
    });

    // 2. Get intention from AWS Bedrock
    const intention = await getIntention(message);

    // 3. Get the agents that will be activated for this intention
    const agents = INTENTION_TO_AGENT[intention] || ['orchestrator'];

    // 4. Send intention and agents to dashboard for continued animation
    await sendSSEMessage({
      type: 'intention_extracted',
      data: {
        intention,
        agents,
        message,
        userId
      }
    });

    res.json({ success: true, intention, agents });
  } catch (error) {
    console.error('Error processing chat notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Receive completion notification from Plus AI system
router.post('/chat-complete', async (req, res) => {
  try {
    const { userId, timestamp, response } = req.body;
    
    console.log('Received chat completion:', { userId, timestamp, response });
    
    // Notify dashboard to stop animation
    await sendSSEMessage({
      type: 'chat_completed',
      data: { userId, timestamp, response }
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error processing chat completion:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
