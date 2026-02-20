const AWS = require('aws-sdk');
const { DEMO_INTENTIONS, INTENTION_DESCRIPTIONS } = require('../config/intentions');

// Configure AWS Bedrock
const bedrock = new AWS.BedrockRuntime({
  region: process.env.AWS_REGION || 'ap-southeast-2',
  ...(process.env.AWS_PROFILE && { profile: process.env.AWS_PROFILE })
});

// We ALWAYS use LLM for intention extraction for better accuracy and context understanding
// No keyword matching is used (aligned with UK showcase pattern)

async function getIntention(message, conversationMessages = []) {
  try {
    // Handle undefined or invalid messages
    if (!message || typeof message !== 'string') {
      console.log('Invalid or missing message, using general_inquiry');
      return DEMO_INTENTIONS.GENERAL_INQUIRY;
    }

    // Build conversation context from the last 5 messages
    let contextString = '';
    if (conversationMessages && conversationMessages.length > 0) {
      contextString = 'Conversation history:\n';
      conversationMessages.slice(-5).forEach(msg => {
        const role = msg.type === 'user' ? 'user' : 'assistant';
        contextString += `${role}: ${msg.content}\n`;
      });
      contextString += '\n';
    }

    // Create enum values for the intention field
    const intentionValues = Object.values(DEMO_INTENTIONS);

    // Define the schema for structured output using tool use
    const intentionSchema = {
      type: "object",
      properties: {
        intention: {
          type: "string",
          enum: intentionValues,
          description: "The classified intention from the predefined list"
        },
        confidence: {
          type: "number",
          description: "Confidence score between 0 and 1",
          minimum: 0,
          maximum: 1
        }
      },
      required: ["intention"]
    };

    // Tool configuration to force structured output
    const toolConfig = {
      tools: [{
        toolSpec: {
          name: "classify_intention",
          description: "Classify the user message into one of the predefined intentions",
          inputSchema: { json: intentionSchema }
        }
      }],
      toolChoice: { tool: { name: "classify_intention" } }
    };

    // Build intention list with descriptions
    const intentionList = intentionValues.map(intention =>
      `- ${intention}: ${INTENTION_DESCRIPTIONS[intention] || 'No description'}`
    ).join('\n');

    const userPrompt = `${contextString}Based on the conversation context, classify this user message into the most appropriate intention category:

User message: "${message}"

Available intentions:
${intentionList}

Select the single most appropriate intention.`;

    // Track AWS processing time
    const startTime = Date.now();

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
      toolConfig: toolConfig,
      inferenceConfig: {
        temperature: 0.0,  // Greedy decoding for deterministic output
        maxTokens: 200
      }
    };

    const response = await bedrock.converse(params).promise();

    // Log AWS processing time
    const awsTime = Date.now() - startTime;
    console.log(`AWS Bedrock processing time: ${awsTime}ms`);

    // Extract the tool use response from Converse API
    const content = response.output?.message?.content;
    const toolUseBlock = content?.find(block => block.toolUse);

    if (toolUseBlock && toolUseBlock.toolUse) {
      const structuredData = toolUseBlock.toolUse.input;

      const extractedIntention = structuredData.intention;
      const confidence = structuredData.confidence || 1.0;

      // Validate the intention is in our enum
      if (intentionValues.includes(extractedIntention)) {
        console.log(`Intention extracted: ${extractedIntention} (confidence: ${confidence.toFixed(2)})`);
        return extractedIntention;
      }
    }

    // Fallback if tool use fails
    console.log('Tool use failed or no valid response, using general_inquiry');
    return DEMO_INTENTIONS.GENERAL_INQUIRY;

  } catch (error) {
    console.error('Error getting intention from Claude Haiku 4.5 via Bedrock:', error);
    return DEMO_INTENTIONS.GENERAL_INQUIRY;
  }
}

module.exports = { getIntention, DEMO_INTENTIONS };
