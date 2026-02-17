/**
 * Intention Classification Test Suite
 *
 * Tests that the AWS Bedrock Claude Haiku LLM correctly classifies
 * the presenter's spreadsheet prompts into expected intentions.
 *
 * Based on: UK Showcase Prompts(LG) - with Vis Mapping.csv
 *
 * Usage: node tests/test-intentions.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { getIntention } = require('../services/bedrockService');
const { INTENTION_TO_AGENT } = require('../config/intentions');
const fs = require('fs');
const path = require('path');

// Test cases based on the UK Showcase Presenter Spreadsheet
const TEST_CASES = [
  // ============================================
  // Scenario A - Property Inquiry (Guest)
  // ============================================
  {
    id: 'A.1',
    scenario: 'Property Inquiry',
    prompt: 'I am looking to buy to 35 Westwood Dr, can you tell me what it is like to live in River City',
    expectedIntention: 'property_inquiry',
    expectedAgents: ['knowledge', 'spatial', 'webagent'],
    context: [] // First message, no context
  },
  {
    id: 'A.2',
    scenario: 'Property Inquiry',
    prompt: 'Yes Flood risk and Council Tax',
    expectedIntention: 'property_details',
    expectedAgents: ['knowledge', 'spatial', 'webagent'],
    context: [
      { type: 'user', content: 'I am looking to buy to 35 Westwood Dr, can you tell me what it is like to live in River City' },
      { type: 'assistant', content: 'River City is a wonderful place to live! It offers excellent schools, beautiful parks, and a strong sense of community. The area has good transport links and various local amenities. Would you like more specific information about the property, such as flood risk, council tax bands, or nearby schools?' }
    ]
  },

  // ============================================
  // Scenario B - Waste Disposal / Bulky Waste (Registered)
  // ============================================
  {
    id: 'B.2',
    scenario: 'Waste Disposal',
    prompt: 'how can I dispose of this chair',
    expectedIntention: 'waste_disposal_inquiry',
    expectedAgents: ['knowledge', 'ecm'],
    context: [] // User uploads photo and asks
  },
  {
    id: 'B.3',
    scenario: 'Bulky Waste Booking',
    prompt: 'Yes, its just the chair and can we book for 3 March 26',
    expectedIntention: 'bulky_waste_booking',
    expectedAgents: ['request', 'bincollections'],
    context: [
      { type: 'user', content: 'how can I dispose of this chair' },
      { type: 'assistant', content: 'Based on the image, this appears to be a piece of furniture that qualifies as bulky waste. We offer free bulky waste collection for residents. Would you like me to book a collection for you? I just need to know how many items you have and your preferred collection date.' }
    ]
  },
  {
    id: 'B.4',
    scenario: 'Bulky Waste Booking',
    prompt: 'Yes',
    expectedIntention: 'bulky_waste_booking',
    expectedAgents: ['request', 'bincollections'],
    context: [
      { type: 'user', content: 'how can I dispose of this chair' },
      { type: 'assistant', content: 'Based on the image, this appears to be bulky waste. We offer free collection.' },
      { type: 'user', content: 'Yes, its just the chair and can we book for 3 March 26' },
      { type: 'assistant', content: 'I have prepared a bulky waste collection booking for 3 March 2026 for 1 chair at your registered address. Please confirm to complete the booking.' }
    ]
  },

  // ============================================
  // Scenario C - Council Tax / Hardship (Registered)
  // ============================================
  {
    id: 'C.1',
    scenario: 'Hardship Inquiry',
    prompt: 'Tell me about temporary hardship allowance',
    expectedIntention: 'hardship_inquiry',
    expectedAgents: ['knowledge', 'webagent'],
    context: [] // User clicks on recommendation
  },
  {
    id: 'C.2',
    scenario: 'Hardship Application',
    prompt: 'Yes apply',
    expectedIntention: 'hardship_application',
    expectedAgents: ['request', 'taxtransactions'],
    context: [
      { type: 'user', content: 'Tell me about temporary hardship allowance' },
      { type: 'assistant', content: 'The Temporary Hardship Allowance is a council support program for residents experiencing financial difficulty due to unexpected circumstances such as illness, job loss, or reduced working hours. If approved, you may receive a reduction in your council tax payments for a period of up to 6 months. Would you like to apply for this allowance?' }
    ]
  },
  {
    id: 'C.3',
    scenario: 'Document Submission',
    prompt: 'I am a casual worker and have hurt my leg and can only work half shifts',
    expectedIntention: 'document_submission',
    expectedAgents: ['ecm', 'request'],
    context: [
      { type: 'user', content: 'Tell me about temporary hardship allowance' },
      { type: 'assistant', content: 'The Temporary Hardship Allowance provides support for residents experiencing financial difficulty.' },
      { type: 'user', content: 'Yes apply' },
      { type: 'assistant', content: 'To process your hardship application, please describe your current circumstances and attach any supporting documents such as a medical certificate or letter from your employer.' }
    ]
  },
  {
    id: 'C.4',
    scenario: 'Request Confirmation',
    prompt: 'Yes confirmed',
    expectedIntention: 'request_confirmation',
    expectedAgents: ['request'],
    context: [
      { type: 'user', content: 'Yes apply' },
      { type: 'assistant', content: 'Please describe your circumstances and attach supporting documents.' },
      { type: 'user', content: 'I am a casual worker and have hurt my leg and can only work half shifts' },
      { type: 'assistant', content: 'Thank you for providing those details. I have prepared your hardship application with the following information:\n- Reason: Reduced work hours due to leg injury\n- Employment: Casual worker\n- Supporting document: Medical certificate attached\n\nPlease confirm to submit your application.' }
    ]
  },
  {
    id: 'C.6',
    scenario: 'Council Tax View',
    prompt: 'Show me my council tax balance',
    expectedIntention: 'council_tax_view',
    expectedAgents: ['taxtransactions'],
    context: [] // User clicks on council tax overdue in Focus
  },
  {
    id: 'C.7',
    scenario: 'Payment Redirect',
    prompt: 'Pay now',
    expectedIntention: 'payment_redirect',
    expectedAgents: ['taxtransactions'],
    context: [
      { type: 'user', content: 'Show me my council tax balance' },
      { type: 'assistant', content: 'Your current council tax balance shows:\n- Total due: £1,850.00\n- Paid to date: £1,400.00\n- Outstanding: £450.00 (overdue)\n- Next payment due: 1st March 2026\n\nWould you like to pay now or set up a payment plan?' }
    ]
  },

  // ============================================
  // Scenario D - Infrastructure Report / Pothole (Guest)
  // ============================================
  {
    id: 'D.1',
    scenario: 'Infrastructure Report',
    prompt: 'fix this pothole at 92 Well St it will damage bike tyres',
    expectedIntention: 'infrastructure_report',
    expectedAgents: ['knowledge', 'ecm', 'request'],
    context: [] // User uploads photo
  },
  {
    id: 'D.2',
    scenario: 'Request Details',
    prompt: 'It is hazardous for bikes and would seriously damage tyres',
    expectedIntention: 'request_details',
    expectedAgents: ['request'],
    context: [
      { type: 'user', content: 'fix this pothole at 92 Well St it will damage bike tyres' },
      { type: 'assistant', content: 'Thank you for reporting this pothole at 92 Well St. I can see from the photo that it appears to be a significant road defect. To help us prioritize the repair, could you provide any additional details about the hazard level or any incidents you are aware of?' }
    ]
  },
  {
    id: 'D.3',
    scenario: 'Request with Attachment',
    prompt: 'Yes',
    expectedIntention: 'request_with_attachment',
    expectedAgents: ['request', 'ecm'],
    context: [
      { type: 'user', content: 'fix this pothole at 92 Well St it will damage bike tyres' },
      { type: 'assistant', content: 'Thank you for reporting this pothole. Could you provide additional details?' },
      { type: 'user', content: 'It is hazardous for bikes and would seriously damage tyres' },
      { type: 'assistant', content: 'Thank you for the additional information. I have prepared your infrastructure report with the following details:\n- Location: 92 Well St\n- Issue: Pothole\n- Hazard: Risk to cyclists, potential tyre damage\n- Evidence: Photo attached\n\nPlease confirm to submit your report.' }
    ]
  }
];

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m'
};

function formatArrayComparison(expected, actual) {
  const expectedSorted = [...expected].sort();
  const actualSorted = [...actual].sort();
  return {
    match: JSON.stringify(expectedSorted) === JSON.stringify(actualSorted),
    expected: expectedSorted.join(', '),
    actual: actualSorted.join(', ')
  };
}

async function runTests() {
  console.log(`\n${colors.bright}${colors.cyan}Intention Classification Test Suite${colors.reset}`);
  console.log(`${'='.repeat(70)}`);
  console.log(`${colors.dim}Testing AWS Bedrock Claude Haiku intention classification${colors.reset}`);
  console.log(`${colors.dim}Based on UK Showcase Presenter Spreadsheet${colors.reset}\n`);

  let passed = 0;
  let failed = 0;
  const results = [];
  let currentScenario = '';

  for (const testCase of TEST_CASES) {
    // Print scenario header when it changes
    if (testCase.scenario !== currentScenario) {
      currentScenario = testCase.scenario;
      console.log(`\n${colors.bright}Scenario: ${currentScenario}${colors.reset}`);
      console.log(`${'-'.repeat(50)}`);
    }

    const truncatedPrompt = testCase.prompt.length > 45
      ? testCase.prompt.substring(0, 45) + '...'
      : testCase.prompt;

    console.log(`\n${colors.cyan}Test ${testCase.id}:${colors.reset} "${truncatedPrompt}"`);

    try {
      // Call the actual LLM
      const startTime = Date.now();
      const intention = await getIntention(testCase.prompt, testCase.context);
      const latency = Date.now() - startTime;

      const agents = INTENTION_TO_AGENT[intention] || [];

      // Check intention match
      const intentionMatch = intention === testCase.expectedIntention;

      // Check agents match (order doesn't matter)
      const agentComparison = formatArrayComparison(testCase.expectedAgents, agents);

      const success = intentionMatch && agentComparison.match;

      if (success) {
        console.log(`   ${colors.green}PASS${colors.reset} (${latency}ms)`);
        console.log(`   ${colors.dim}Intention: ${intention}${colors.reset}`);
        console.log(`   ${colors.dim}Agents: [${agentComparison.actual}]${colors.reset}`);
        passed++;
      } else {
        console.log(`   ${colors.red}FAIL${colors.reset} (${latency}ms)`);
        if (!intentionMatch) {
          console.log(`   ${colors.yellow}Intention:${colors.reset}`);
          console.log(`      Expected: ${colors.green}${testCase.expectedIntention}${colors.reset}`);
          console.log(`      Got:      ${colors.red}${intention}${colors.reset}`);
        } else {
          console.log(`   ${colors.dim}Intention: ${intention} (correct)${colors.reset}`);
        }
        if (!agentComparison.match) {
          console.log(`   ${colors.yellow}Agents:${colors.reset}`);
          console.log(`      Expected: ${colors.green}[${agentComparison.expected}]${colors.reset}`);
          console.log(`      Got:      ${colors.red}[${agentComparison.actual}]${colors.reset}`);
        } else {
          console.log(`   ${colors.dim}Agents: [${agentComparison.actual}] (correct)${colors.reset}`);
        }
        failed++;
      }

      results.push({
        id: testCase.id,
        scenario: testCase.scenario,
        prompt: testCase.prompt,
        contextLength: testCase.context.length,
        expected: {
          intention: testCase.expectedIntention,
          agents: testCase.expectedAgents
        },
        actual: { intention, agents },
        latencyMs: latency,
        success
      });

      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 300));

    } catch (error) {
      console.log(`   ${colors.red}ERROR: ${error.message}${colors.reset}`);
      failed++;
      results.push({
        id: testCase.id,
        scenario: testCase.scenario,
        prompt: testCase.prompt,
        expected: {
          intention: testCase.expectedIntention,
          agents: testCase.expectedAgents
        },
        actual: { error: error.message },
        success: false
      });
    }
  }

  // Summary
  const passRate = ((passed / TEST_CASES.length) * 100).toFixed(1);
  const avgLatency = results
    .filter(r => r.latencyMs)
    .reduce((sum, r) => sum + r.latencyMs, 0) / results.filter(r => r.latencyMs).length;

  console.log(`\n${'='.repeat(70)}`);
  console.log(`${colors.bright}SUMMARY${colors.reset}`);
  console.log(`${'='.repeat(70)}`);
  console.log(`   Total Tests:     ${TEST_CASES.length}`);
  console.log(`   Passed:          ${colors.green}${passed}${colors.reset}`);
  console.log(`   Failed:          ${failed > 0 ? colors.red : ''}${failed}${colors.reset}`);
  console.log(`   Pass Rate:       ${passRate >= 80 ? colors.green : colors.yellow}${passRate}%${colors.reset}`);
  console.log(`   Avg Latency:     ${avgLatency.toFixed(0)}ms`);

  // Write results to JSON
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputPath = path.join(__dirname, `test-results-${timestamp}.json`);

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: TEST_CASES.length,
      passed,
      failed,
      passRate: `${passRate}%`,
      avgLatencyMs: Math.round(avgLatency)
    },
    results
  };

  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
  console.log(`\n${colors.dim}Results saved to: ${path.basename(outputPath)}${colors.reset}`);

  // Print failed tests for quick reference
  if (failed > 0) {
    console.log(`\n${colors.yellow}Failed Tests:${colors.reset}`);
    results
      .filter(r => !r.success)
      .forEach(r => {
        console.log(`   - ${r.id}: Expected "${r.expected.intention}", got "${r.actual.intention || r.actual.error}"`);
      });
  }

  console.log('');

  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  console.error(`${colors.red}Test suite failed:${colors.reset}`, error);
  process.exit(1);
});
