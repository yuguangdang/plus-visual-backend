const express = require('express');
const router = express.Router();
const { sendSSEMessage } = require('../services/sseService');
const { getIntention } = require('../services/bedrockService');
const { INTENTION_TO_AGENT } = require('../config/intentions');

// Helper function to check if user should receive SSE events
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

// Receive notification from Plus AI system
router.post('/chat-notification', async (req, res) => {
  try {
    // Track total timing
    const startTime = Date.now();

    // Log raw request body to debug
    console.log('Raw chat-notification body:', JSON.stringify(req.body));

    // New payload structure: array of conversation messages
    const messages = req.body;
    
    // Clean messages: remove conversationId, messageId, lastModified, but keep guide field
    const cleanMessages = messages.map(msg => ({
      content: msg.content,
      type: msg.type,
      userId: msg.userId,
      guide: msg.guide // Preserve guide field for proper agent filtering
    }));
    
    // Get the latest user message as the primary message
    const userMessages = cleanMessages.filter(msg => msg.type === 'user');
    const latestUserMessage = userMessages[userMessages.length - 1];
    
    if (!latestUserMessage) {
      return res.status(400).json({ error: 'No user message found in conversation' });
    }
    
    const message = latestUserMessage.content;
    const userId = latestUserMessage.userId;
    const guide = latestUserMessage.guide; // Extract guide field
    const timestamp = new Date().toISOString();

    console.log('Received chat notification:', {
      message,
      userId,
      guide,
      timestamp,
      totalMessages: cleanMessages.length
    });

    // 1. Immediately notify dashboard to start animation (if user is allowed)
    if (isUserAllowed(userId)) {
      await sendSSEMessage({
        type: 'chat_started',
        data: { message, userId, guide, timestamp }
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

    // 4. Wait 4 seconds for thinking phase before sending intention
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
            userId,
            guide
          }
        });
      } else {
        console.log(`SSE not sent for intention_extracted - userId ${userId} not in allowed list`);
      }
    }, delayMs); // 4-second thinking phase delay
    
    res.json({ success: true, intention, agents, message, userId, guide });
  } catch (error) {
    console.error('Error processing chat notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to send SSE message with retries for critical messages
async function sendSSEMessageWithRetry(message, maxRetries = 3) {
  const delays = [500, 1000, 1500]; // Retry delays in ms

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      await sendSSEMessage(message);

      if (attempt > 0) {
        console.log(`Successfully sent ${message.type} on retry attempt ${attempt}`);
      }
      return true;
    } catch (error) {
      console.error(`Failed to send ${message.type} on attempt ${attempt}:`, error);

      if (attempt < maxRetries) {
        const delay = delays[attempt] || 1500;
        console.log(`Retrying ${message.type} in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  console.error(`Failed to send ${message.type} after ${maxRetries} retries`);
  return false;
}

// Receive completion notification from Plus AI system
router.post('/chat-complete', async (req, res) => {
  try {
    // Log raw request body to debug
    console.log('Raw request body:', JSON.stringify(req.body));

    // Extract userId and guide from request body
    const { userId, guide } = req.body;
    const timestamp = new Date().toISOString();

    console.log('Received chat completion notification:', { userId, guide, timestamp });

    // Notify dashboard to stop animation (if user is allowed)
    // Use retry logic for this critical message
    if (isUserAllowed(userId)) {
      const message = {
        type: 'chat_completed',
        data: { userId, guide, timestamp }
      };

      // Send with retries to ensure delivery
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
