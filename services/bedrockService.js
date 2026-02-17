const AWS = require('aws-sdk');
const { DEMO_INTENTIONS, INTENTION_KEYWORDS } = require('../config/intentions');

// Configure AWS Bedrock
const bedrock = new AWS.BedrockRuntime({
  region: process.env.AWS_REGION || 'ap-southeast-2',
  ...(process.env.AWS_PROFILE && { profile: process.env.AWS_PROFILE })
});

// Helper function to match intention based on keywords
function matchIntentionByKeywords(message) {
  if (!message || typeof message !== 'string') {
    return null;
  }

  const lowerMessage = message.toLowerCase();

  for (const [intention, keywords] of Object.entries(INTENTION_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        console.log(`Matched intention ${intention} by keyword: ${keyword}`);
        return intention;
      }
    }
  }

  return null;
}

async function getIntention(message) {
  try {
    // Handle undefined or invalid messages
    if (!message || typeof message !== 'string') {
      console.log('Invalid or missing message, using general_inquiry');
      return DEMO_INTENTIONS.GENERAL_INQUIRY;
    }

    // First try keyword matching for demo scenarios
    const keywordMatch = matchIntentionByKeywords(message);
    if (keywordMatch) {
      return keywordMatch;
    }

    // If no keyword match, use AI to classify
    const intentionValues = Object.values(DEMO_INTENTIONS);
    const intentionsList = intentionValues.join(', ');

    const userPrompt = `Classify this user message into ONE of these specific intentions:
    ${intentionsList}

    User message: "${message}"

    Return ONLY the intention name from the list above, nothing else.`;

    // Use Claude Haiku 4.5 AU inference profile with Converse API
    const modelId = 'au.anthropic.claude-haiku-4-5-20251001-v1:0';
    console.log(`Using Bedrock model: ${modelId} in region: ${process.env.AWS_REGION || 'ap-southeast-2'}`);

    const params = {
      modelId: modelId,
      messages: [
        {
          role: 'user',
          content: [{ text: userPrompt }]
        }
      ],
      inferenceConfig: {
        temperature: 0.1,
        maxTokens: 50
      }
    };

    console.log('Calling AWS Bedrock Claude Haiku 4.5...');
    const response = await bedrock.converse(params).promise();

    // Extract text from Converse API response
    const content = response.output?.message?.content;
    const textBlock = content?.find(block => block.text);
    const aiResponse = textBlock?.text?.trim().toLowerCase() || '';

    console.log('AI Response:', aiResponse);

    // Validate the response is in our enum
    const validIntention = intentionValues.find(
      intention => aiResponse.includes(intention)
    );

    if (validIntention) {
      console.log('Extracted intention:', validIntention);
      return validIntention;
    }

    // Default fallback
    console.log('No valid intention found, using general_inquiry');
    return DEMO_INTENTIONS.GENERAL_INQUIRY;

  } catch (error) {
    console.error('Error getting intention from Claude Haiku 4.5 via Bedrock:', error);
    return DEMO_INTENTIONS.GENERAL_INQUIRY;
  }
}

module.exports = { getIntention, DEMO_INTENTIONS };
