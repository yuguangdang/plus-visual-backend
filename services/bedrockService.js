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
    const intentionsList = Object.values(DEMO_INTENTIONS).join(', ');
    const prompt = `Classify this user message into ONE of these specific intentions:
    ${intentionsList}
    
    User message: "${message}"
    
    Return ONLY the intention name from the list above, nothing else.`;
    
    const params = {
      modelId: 'amazon.titan-text-express-v1',
      contentType: 'application/json',
      body: JSON.stringify({
        inputText: prompt,
        textGenerationConfig: {
          maxTokenCount: 50,
          temperature: 0.1
        }
      })
    };
    
    console.log('Calling AWS Bedrock Titan Text Express...');
    const response = await bedrock.invokeModel(params).promise();
    const result = JSON.parse(response.body.toString());
    
    const aiResponse = result.results[0].outputText.trim().toLowerCase();
    console.log('AI Response:', aiResponse);
    
    // Validate the response is in our enum
    const validIntention = Object.values(DEMO_INTENTIONS).find(
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
    console.error('Error getting intention from Bedrock:', error);
    return DEMO_INTENTIONS.GENERAL_INQUIRY;
  }
}

module.exports = { getIntention, DEMO_INTENTIONS };
