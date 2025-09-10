const express = require('express');
const router = express.Router();
const { sendSSEMessage } = require('../services/sseService');
const { getIntention } = require('../services/bedrockService');
const { INTENTION_TO_AGENT } = require('../config/intentions');

// Receive notification from Plus AI system
router.post('/chat-notification', async (req, res) => {
  try {
    const { message, userId, timestamp } = req.body;
    
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
