/**
 * Student Guide Intention Classification Test Suite
 *
 * Tests that the AWS Bedrock Claude Haiku LLM correctly classifies
 * the presenter's spreadsheet prompts into expected intentions.
 *
 * Based on: UK Showcase Prompts(STU).csv
 *
 * Usage: node tests/test-student-intentions.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { getIntention } = require('../services/bedrockService');
const { INTENTION_TO_AGENT } = require('../config/intentions');
const fs = require('fs');
const path = require('path');

// Test cases based on the UK Showcase Student Guide Spreadsheet
const TEST_CASES = [
  // ============================================
  // Scenario A - Onboarding Tasks (Logged-in Student)
  // ============================================
  {
    id: 'A.1',
    scenario: 'Onboarding Tasks',
    prompt: 'Create onboarding tasks',
    expectedIntention: 'student_onboarding_tasks',
    expectedAgents: ['StudentManagement', 'LMS', 'Tasks'],
    context: [] // First message, no context
  },
  {
    id: 'A.2',
    scenario: 'Onboarding Tasks',
    prompt: 'I also want to get a job so add a task for that but the other tasks look good',
    expectedIntention: 'student_onboarding_confirm',
    expectedAgents: ['Tasks'],
    context: [
      { type: 'user', content: 'Create onboarding tasks' },
      { type: 'assistant', content: 'I have created onboarding tasks for you including: 1. Review course materials 2. Complete enrollment forms 3. Set up student portal 4. Meet with academic advisor. Would you like to modify these tasks?' }
    ]
  },

  // ============================================
  // Scenario B - Assessment Extension (Logged-in Student)
  // ============================================
  {
    id: 'B.1',
    scenario: 'Assessment Extension',
    prompt: 'Help. I\'m not going to finish my assignment on time.',
    expectedIntention: 'student_assessment_extension',
    expectedAgents: ['StudentManagement', 'LMS', 'Knowledge', 'Tasks'],
    context: [] // First message
  },
  {
    id: 'B.2',
    scenario: 'Assessment Extension',
    prompt: 'Yes, the Marketing 101 assignment',
    expectedIntention: 'student_assessment_extension',
    expectedAgents: ['StudentManagement', 'LMS', 'Knowledge', 'Tasks'],
    context: [
      { type: 'user', content: 'Help. I\'m not going to finish my assignment on time.' },
      { type: 'assistant', content: 'I can see you have several upcoming assessments. Which one do you need help with? 1. Marketing 101 - Due March 5 2. Statistics - Due March 10 3. Economics Essay - Due March 15' }
    ]
  },
  {
    id: 'B.3',
    scenario: 'Extension Reason',
    prompt: 'I was busy with work',
    expectedIntention: 'student_extension_reason',
    expectedAgents: ['StudentManagement', 'LMS', 'Knowledge', 'Tasks'],
    context: [
      { type: 'user', content: 'Help. I\'m not going to finish my assignment on time.' },
      { type: 'assistant', content: 'Which assignment do you need help with?' },
      { type: 'user', content: 'Marketing 101' },
      { type: 'assistant', content: 'I found the extension policy for Marketing 101. To apply for an extension, I need to know the reason for your request. What circumstances have prevented you from completing this assignment?' }
    ]
  },
  {
    id: 'B.4',
    scenario: 'Extension Duration',
    prompt: '5 working days',
    expectedIntention: 'student_extension_duration',
    expectedAgents: ['StudentManagement', 'LMS', 'Knowledge', 'Tasks'],
    context: [
      { type: 'user', content: 'Help. I\'m not going to finish my assignment on time.' },
      { type: 'assistant', content: 'Which assignment?' },
      { type: 'user', content: 'Marketing 101' },
      { type: 'assistant', content: 'What is the reason for your extension request?' },
      { type: 'user', content: 'I was busy with work' },
      { type: 'assistant', content: 'Thank you. As well as the reason for the extension, I need to know how long you would like the extension to be.' }
    ]
  },

  // ============================================
  // Scenario C - Exam Time Planning (Logged-in Student)
  // ============================================
  {
    id: 'C.1',
    scenario: 'Exam Planning',
    prompt: 'Create a revision plan for upcoming exams',
    expectedIntention: 'student_exam_planner',
    expectedAgents: ['StudentManagement', 'LMS', 'CourseLoop', 'StudyPlanner'],
    context: [] // First message
  },
  {
    id: 'C.2',
    scenario: 'Study Preferences',
    prompt: 'I don\'t need help to study physics and the topics suggested look great',
    expectedIntention: 'student_study_preferences',
    expectedAgents: ['CourseLoop', 'StudyPlanner'],
    context: [
      { type: 'user', content: 'Create a revision plan for upcoming exams' },
      { type: 'assistant', content: 'Based on your upcoming exams, I have identified the following subjects: Physics, Mathematics, and Chemistry. I suggest focusing on these key topics for each. Would you like to adjust which subjects to include?' }
    ]
  },
  {
    id: 'C.3',
    scenario: 'Study Preferences',
    prompt: 'Monday to Friday, 9-11am, 60min Sessions',
    expectedIntention: 'student_study_preferences',
    expectedAgents: ['CourseLoop', 'StudyPlanner'],
    context: [
      { type: 'user', content: 'Create a revision plan for upcoming exams' },
      { type: 'assistant', content: 'I have your subjects ready.' },
      { type: 'user', content: 'I don\'t need help to study physics' },
      { type: 'assistant', content: 'Great! I have noted that. Now, how would you like to schedule your study sessions? Please tell me your preferred days, times, and session duration.' }
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
  console.log(`\n${colors.bright}${colors.cyan}Student Guide Intention Classification Test Suite${colors.reset}`);
  console.log(`${'='.repeat(70)}`);
  console.log(`${colors.dim}Testing AWS Bedrock Claude Haiku intention classification${colors.reset}`);
  console.log(`${colors.dim}Based on UK Showcase Prompts(STU).csv${colors.reset}\n`);

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

    const truncatedPrompt = testCase.prompt.length > 50
      ? testCase.prompt.substring(0, 50) + '...'
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
  const outputPath = path.join(__dirname, `student-test-results-${timestamp}.json`);

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
