const express = require('express');
const router = express.Router();
const { sendSSEMessage } = require('../services/sseService');
const { getIntention } = require('../services/bedrockService');
const { INTENTION_TO_AGENT } = require('../config/intentions');

// Check if user is allowed to trigger SSE events (based on ALLOWED_USERS env var)
function isUserAllowed(userId) {
  const allowedUsers = process.env.ALLOWED_USERS;

  // If no filter is set, allow all users
  if (!allowedUsers || allowedUsers.trim() === '') {
    return true;
  }

  // Parse comma-separated list and check if user is included
  const userList = allowedUsers.split(',').map(u => u.trim());
  return userList.includes(userId);
}

// Send SSE message with retry logic for critical messages
async function sendSSEMessageWithRetry(message, maxRetries = 3) {
  const delays = [500, 1000, 1500];

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      await sendSSEMessage(message);
      return true;
    } catch (error) {
      if (attempt < maxRetries) {
        console.log(`SSE send failed (attempt ${attempt + 1}), retrying in ${delays[attempt]}ms...`);
        await new Promise(r => setTimeout(r, delays[attempt]));
      } else {
        console.error('SSE message failed after all retries:', error);
      }
    }
  }
  return false;
}

// Receive notification from Plus AI system
// Plus AI sends an array of ChatMessage objects: [{content, conversationId, messageId, type, userId, ...}]
router.post('/chat-notification', async (req, res) => {
  try {
    // Track total timing
    const startTime = Date.now();

    // Log raw request body to debug
    console.log('Raw chat-notification body:', JSON.stringify(req.body));

    // Handle both array format (from Plus AI) and object format (legacy/direct calls)
    const messages = Array.isArray(req.body) ? req.body : [req.body];

    // Clean messages: remove conversationId, messageId, lastModified
    const cleanMessages = messages.map(msg => ({
      content: msg.content,
      type: msg.type,
      userId: msg.userId
    }));

    // Find the latest user message
    const userMessages = cleanMessages.filter(msg => msg.type === 'user');
    const latestUserMessage = userMessages[userMessages.length - 1];

    if (!latestUserMessage) {
      return res.status(400).json({ error: 'No user message found in conversation' });
    }

    const message = latestUserMessage.content;
    const userId = latestUserMessage.userId;
    const timestamp = new Date().toISOString();

    console.log('Received chat notification:', {
      message,
      userId,
      timestamp,
      totalMessages: cleanMessages.length
    });

    // 1. Immediately notify dashboard to start animation (if user allowed)
    if (isUserAllowed(userId)) {
      await sendSSEMessage({
        type: 'chat_started',
        data: { message, userId, timestamp }
      });
    } else {
      console.log(`SSE not sent for chat_started - userId ${userId} not in allowed list`);
    }

    // 2. Get intention from AWS Bedrock using entire conversation
    const awsStartTime = Date.now();
    const intention = await getIntention(message, cleanMessages);
    const awsTime = Date.now() - awsStartTime;

    // 3. Get the agents that will be activated for this intention
    const agents = INTENTION_TO_AGENT[intention] || ['orchestrator'];

    // 4. Wait 4 seconds for thinking phase before sending intention (if user allowed)
    const delayMs = 4000;
    setTimeout(async () => {
      const totalTime = Date.now() - startTime;
      console.log(`Total time from chat start to intention sent: ${totalTime}ms (AWS: ${awsTime}ms + Delay: ${delayMs}ms)`);

      if (isUserAllowed(userId)) {
        await sendSSEMessage({
          type: 'intention_extracted',
          data: {
            intention,
            agents,
            message,
            userId
          }
        });
      } else {
        console.log(`SSE not sent for intention_extracted - userId ${userId} not in allowed list`);
      }
    }, delayMs); // 4-second thinking phase delay

    res.json({ success: true, intention, agents, message, userId });
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

    // Notify dashboard to stop animation (with retry for reliability, if user allowed)
    if (isUserAllowed(userId)) {
      const message = {
        type: 'chat_completed',
        data: { userId, timestamp, response }
      };
      await sendSSEMessageWithRetry(message, 3);
    } else {
      console.log(`SSE not sent for chat_completed - userId ${userId} not in allowed list`);
    }

    res.json({ success: true, message: 'Chat completion noted' });
  } catch (error) {
    console.error('Error processing chat completion:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
