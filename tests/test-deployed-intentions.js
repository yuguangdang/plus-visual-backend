/**
 * Combined Deployed Intention Classification Test Suite
 *
 * Tests BOTH Resident Guide and Student Guide intentions against
 * the deployed UK App Runner endpoint to verify production behavior.
 *
 * Usage: node tests/test-deployed-intentions.js
 */

const fs = require('fs');
const path = require('path');

// Deployed UK Showcase App Runner endpoint
const DEPLOYED_URL = 'https://w2dpn8shpq.ap-southeast-2.awsapprunner.com';

// ============================================
// RESIDENT GUIDE TEST CASES (14 tests)
// Based on: UK Showcase Prompts(LG).csv
// ============================================
const RESIDENT_TEST_CASES = [
  // Scenario A - Property Inquiry (Guest)
  {
    id: 'R-A.1',
    guide: 'resident',
    scenario: 'Property Inquiry',
    prompt: 'I am looking to buy to 35 Westwood Dr, can you tell me what it is like to live in River City',
    expectedIntention: 'property_inquiry',
    expectedAgents: ['knowledge', 'spatial', 'webagent'],
    context: []
  },
  {
    id: 'R-A.2',
    guide: 'resident',
    scenario: 'Property Inquiry',
    prompt: 'Yes Flood risk and Council Tax',
    expectedIntention: 'property_details',
    expectedAgents: ['knowledge', 'spatial', 'webagent'],
    context: [
      { type: 'user', content: 'I am looking to buy to 35 Westwood Dr, can you tell me what it is like to live in River City' },
      { type: 'assistant', content: 'River City is a wonderful place to live! Would you like more specific information about the property, such as flood risk, council tax bands, or nearby schools?' }
    ]
  },

  // Scenario B - Waste Disposal / Bulky Waste (Registered)
  {
    id: 'R-B.2',
    guide: 'resident',
    scenario: 'Waste Disposal',
    prompt: 'how can I dispose of this chair',
    expectedIntention: 'waste_disposal_inquiry',
    expectedAgents: ['knowledge', 'ecm'],
    context: []
  },
  {
    id: 'R-B.3',
    guide: 'resident',
    scenario: 'Bulky Waste Booking',
    prompt: 'Yes, its just the chair and can we book for 3 March 26',
    expectedIntention: 'bulky_waste_booking',
    expectedAgents: ['request', 'bincollections'],
    context: [
      { type: 'user', content: 'how can I dispose of this chair' },
      { type: 'assistant', content: 'This appears to be bulky waste. We offer free bulky waste collection. Would you like me to book a collection?' }
    ]
  },
  {
    id: 'R-B.4',
    guide: 'resident',
    scenario: 'Bulky Waste Booking',
    prompt: 'Yes',
    expectedIntention: 'bulky_waste_booking',
    expectedAgents: ['request', 'bincollections'],
    context: [
      { type: 'user', content: 'how can I dispose of this chair' },
      { type: 'assistant', content: 'This appears to be bulky waste.' },
      { type: 'user', content: 'Yes, its just the chair and can we book for 3 March 26' },
      { type: 'assistant', content: 'I have prepared a bulky waste collection booking for 3 March 2026. Please confirm to complete the booking.' }
    ]
  },

  // Scenario C - Council Tax / Hardship (Registered)
  {
    id: 'R-C.1',
    guide: 'resident',
    scenario: 'Hardship Inquiry',
    prompt: 'Tell me about temporary hardship allowance',
    expectedIntention: 'hardship_inquiry',
    expectedAgents: ['knowledge', 'webagent'],
    context: []
  },
  {
    id: 'R-C.2',
    guide: 'resident',
    scenario: 'Hardship Application',
    prompt: 'Yes apply',
    expectedIntention: 'hardship_application',
    expectedAgents: ['request', 'taxtransactions'],
    context: [
      { type: 'user', content: 'Tell me about temporary hardship allowance' },
      { type: 'assistant', content: 'The Temporary Hardship Allowance is a council support program. Would you like to apply?' }
    ]
  },
  {
    id: 'R-C.3',
    guide: 'resident',
    scenario: 'Document Submission',
    prompt: 'I am a casual worker and have hurt my leg and can only work half shifts',
    expectedIntention: 'document_submission',
    expectedAgents: ['ecm', 'request'],
    context: [
      { type: 'user', content: 'Tell me about temporary hardship allowance' },
      { type: 'assistant', content: 'The Temporary Hardship Allowance provides support for residents experiencing financial difficulty.' },
      { type: 'user', content: 'Yes apply' },
      { type: 'assistant', content: 'To process your hardship application, please describe your circumstances and attach any supporting documents.' }
    ]
  },
  {
    id: 'R-C.4',
    guide: 'resident',
    scenario: 'Request Confirmation',
    prompt: 'Yes confirmed',
    expectedIntention: 'request_confirmation',
    expectedAgents: ['request'],
    context: [
      { type: 'user', content: 'Yes apply' },
      { type: 'assistant', content: 'Please describe your circumstances.' },
      { type: 'user', content: 'I am a casual worker and have hurt my leg' },
      { type: 'assistant', content: 'I have prepared your hardship application. Please confirm to submit.' }
    ]
  },
  {
    id: 'R-C.6',
    guide: 'resident',
    scenario: 'Council Tax View',
    prompt: 'Show me my council tax balance',
    expectedIntention: 'council_tax_view',
    expectedAgents: ['taxtransactions'],
    context: []
  },
  {
    id: 'R-C.7',
    guide: 'resident',
    scenario: 'Payment Redirect',
    prompt: 'Pay now',
    expectedIntention: 'payment_redirect',
    expectedAgents: ['taxtransactions'],
    context: [
      { type: 'user', content: 'Show me my council tax balance' },
      { type: 'assistant', content: 'Your council tax balance shows £450 outstanding. Would you like to pay now?' }
    ]
  },

  // Scenario D - Infrastructure Report / Pothole (Guest)
  {
    id: 'R-D.1',
    guide: 'resident',
    scenario: 'Infrastructure Report',
    prompt: 'fix this pothole at 92 Well St it will damage bike tyres',
    expectedIntention: 'infrastructure_report',
    expectedAgents: ['knowledge', 'ecm', 'request'],
    context: []
  },
  {
    id: 'R-D.2',
    guide: 'resident',
    scenario: 'Request Details',
    prompt: 'It is hazardous for bikes and would seriously damage tyres',
    expectedIntention: 'request_details',
    expectedAgents: ['request'],
    context: [
      { type: 'user', content: 'fix this pothole at 92 Well St it will damage bike tyres' },
      { type: 'assistant', content: 'Thank you for reporting this pothole. Could you provide additional details about the hazard level?' }
    ]
  },
  {
    id: 'R-D.3',
    guide: 'resident',
    scenario: 'Request with Attachment',
    prompt: 'Yes',
    expectedIntention: 'request_with_attachment',
    expectedAgents: ['request', 'ecm'],
    context: [
      { type: 'user', content: 'fix this pothole at 92 Well St' },
      { type: 'assistant', content: 'Could you provide additional details?' },
      { type: 'user', content: 'It is hazardous for bikes' },
      { type: 'assistant', content: 'I have prepared your infrastructure report with photo attached. Please confirm to submit.' }
    ]
  }
];

// ============================================
// STUDENT GUIDE TEST CASES (9 tests)
// Based on: UK Showcase Prompts(STU).csv
// ============================================
const STUDENT_TEST_CASES = [
  // Scenario A - Onboarding Tasks
  {
    id: 'S-A.1',
    guide: 'student',
    scenario: 'Onboarding Tasks',
    prompt: 'Create onboarding tasks',
    expectedIntention: 'student_onboarding_tasks',
    expectedAgents: ['StudentManagement', 'LMS', 'Tasks'],
    context: []
  },
  {
    id: 'S-A.2',
    guide: 'student',
    scenario: 'Onboarding Tasks',
    prompt: 'I also want to get a job so add a task for that but the other tasks look good',
    expectedIntention: 'student_onboarding_confirm',
    expectedAgents: ['Tasks'],
    context: [
      { type: 'user', content: 'Create onboarding tasks' },
      { type: 'assistant', content: 'I have created onboarding tasks including: Review course materials, Complete enrollment forms. Would you like to modify these?' }
    ]
  },

  // Scenario B - Assessment Extension
  {
    id: 'S-B.1',
    guide: 'student',
    scenario: 'Assessment Extension',
    prompt: 'Help. I\'m not going to finish my assignment on time.',
    expectedIntention: 'student_assessment_extension',
    expectedAgents: ['StudentManagement', 'LMS', 'Knowledge', 'Tasks'],
    context: []
  },
  {
    id: 'S-B.2',
    guide: 'student',
    scenario: 'Assessment Extension',
    prompt: 'Yes, the Marketing 101 assignment',
    expectedIntention: 'student_assessment_extension',
    expectedAgents: ['StudentManagement', 'LMS', 'Knowledge', 'Tasks'],
    context: [
      { type: 'user', content: 'Help. I\'m not going to finish my assignment on time.' },
      { type: 'assistant', content: 'Which assignment do you need help with? Marketing 101, Statistics, or Economics?' }
    ]
  },
  {
    id: 'S-B.3',
    guide: 'student',
    scenario: 'Extension Reason',
    prompt: 'I was busy with work',
    expectedIntention: 'student_extension_reason',
    expectedAgents: ['StudentManagement', 'LMS', 'Knowledge', 'Tasks'],
    context: [
      { type: 'user', content: 'Help. I\'m not going to finish my assignment on time.' },
      { type: 'assistant', content: 'Which assignment?' },
      { type: 'user', content: 'Marketing 101' },
      { type: 'assistant', content: 'What is the reason for your extension request?' }
    ]
  },
  {
    id: 'S-B.4',
    guide: 'student',
    scenario: 'Extension Duration',
    prompt: '5 working days',
    expectedIntention: 'student_extension_duration',
    expectedAgents: ['StudentManagement', 'LMS', 'Knowledge', 'Tasks'],
    context: [
      { type: 'user', content: 'Help. I\'m not going to finish my assignment on time.' },
      { type: 'assistant', content: 'Which assignment?' },
      { type: 'user', content: 'Marketing 101' },
      { type: 'assistant', content: 'What is the reason?' },
      { type: 'user', content: 'I was busy with work' },
      { type: 'assistant', content: 'How long would you like the extension to be?' }
    ]
  },

  // Scenario C - Exam Planning
  {
    id: 'S-C.1',
    guide: 'student',
    scenario: 'Exam Planning',
    prompt: 'Create a revision plan for upcoming exams',
    expectedIntention: 'student_exam_planner',
    expectedAgents: ['StudentManagement', 'LMS', 'CourseLoop', 'StudyPlanner'],
    context: []
  },
  {
    id: 'S-C.2',
    guide: 'student',
    scenario: 'Study Preferences',
    prompt: 'I don\'t need help to study physics and the topics suggested look great',
    expectedIntention: 'student_study_preferences',
    expectedAgents: ['CourseLoop', 'StudyPlanner'],
    context: [
      { type: 'user', content: 'Create a revision plan for upcoming exams' },
      { type: 'assistant', content: 'I have identified Physics, Mathematics, and Chemistry. Would you like to adjust which subjects to include?' }
    ]
  },
  {
    id: 'S-C.3',
    guide: 'student',
    scenario: 'Study Preferences',
    prompt: 'Monday to Friday, 9-11am, 60min Sessions',
    expectedIntention: 'student_study_preferences',
    expectedAgents: ['CourseLoop', 'StudyPlanner'],
    context: [
      { type: 'user', content: 'Create a revision plan for upcoming exams' },
      { type: 'assistant', content: 'I have your subjects ready.' },
      { type: 'user', content: 'I don\'t need help to study physics' },
      { type: 'assistant', content: 'Please tell me your preferred days, times, and session duration.' }
    ]
  }
];

// Combine all test cases
const ALL_TEST_CASES = [...RESIDENT_TEST_CASES, ...STUDENT_TEST_CASES];

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
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

async function callDeployedEndpoint(prompt, context, guide) {
  // Build the messages array format expected by the API
  // Context messages first, then the latest user message
  const messages = [
    ...context.map(msg => ({
      type: msg.type,
      content: msg.content,
      userId: 'test-deployed-user',
      guide: guide
    })),
    // Add the current user message
    {
      type: 'user',
      content: prompt,
      userId: 'test-deployed-user',
      guide: guide
    }
  ];

  const response = await fetch(`${DEPLOYED_URL}/api/chat-notification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messages)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
  }

  return response.json();
}

async function runTests() {
  console.log(`\n${colors.bright}${colors.cyan}Combined Deployed Intention Test Suite${colors.reset}`);
  console.log(`${'='.repeat(70)}`);
  console.log(`${colors.dim}Testing against: ${DEPLOYED_URL}${colors.reset}`);
  console.log(`${colors.dim}Total tests: ${ALL_TEST_CASES.length} (Resident: ${RESIDENT_TEST_CASES.length}, Student: ${STUDENT_TEST_CASES.length})${colors.reset}\n`);

  let passed = 0;
  let failed = 0;
  const results = [];
  let currentGuide = '';
  let currentScenario = '';

  for (const testCase of ALL_TEST_CASES) {
    // Print guide header when it changes
    if (testCase.guide !== currentGuide) {
      currentGuide = testCase.guide;
      const guideLabel = currentGuide === 'resident' ? 'RESIDENT GUIDE' : 'STUDENT GUIDE';
      const guideColor = currentGuide === 'resident' ? colors.cyan : colors.magenta;
      console.log(`\n${colors.bright}${guideColor}═══ ${guideLabel} ═══${colors.reset}`);
      currentScenario = ''; // Reset scenario for new guide
    }

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
      const startTime = Date.now();
      const { intention, agents } = await callDeployedEndpoint(
        testCase.prompt,
        testCase.context,
        testCase.guide
      );
      const latency = Date.now() - startTime;

      // Check intention match
      const intentionMatch = intention === testCase.expectedIntention;

      // Check agents match (order doesn't matter)
      const agentComparison = formatArrayComparison(testCase.expectedAgents, agents || []);

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
        guide: testCase.guide,
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
        guide: testCase.guide,
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
  const totalTests = ALL_TEST_CASES.length;
  const passRate = ((passed / totalTests) * 100).toFixed(1);
  const avgLatency = results
    .filter(r => r.latencyMs)
    .reduce((sum, r) => sum + r.latencyMs, 0) / results.filter(r => r.latencyMs).length;

  // Per-guide summary
  const residentResults = results.filter(r => r.guide === 'resident');
  const studentResults = results.filter(r => r.guide === 'student');
  const residentPassed = residentResults.filter(r => r.success).length;
  const studentPassed = studentResults.filter(r => r.success).length;

  console.log(`\n${'='.repeat(70)}`);
  console.log(`${colors.bright}SUMMARY${colors.reset}`);
  console.log(`${'='.repeat(70)}`);
  console.log(`   Total Tests:     ${totalTests}`);
  console.log(`   Passed:          ${colors.green}${passed}${colors.reset}`);
  console.log(`   Failed:          ${failed > 0 ? colors.red : ''}${failed}${colors.reset}`);
  console.log(`   Pass Rate:       ${passRate >= 80 ? colors.green : colors.yellow}${passRate}%${colors.reset}`);
  console.log(`   Avg Latency:     ${avgLatency.toFixed(0)}ms`);
  console.log(`\n   ${colors.cyan}Resident Guide:${colors.reset} ${residentPassed}/${residentResults.length} (${((residentPassed/residentResults.length)*100).toFixed(1)}%)`);
  console.log(`   ${colors.magenta}Student Guide:${colors.reset}  ${studentPassed}/${studentResults.length} (${((studentPassed/studentResults.length)*100).toFixed(1)}%)`);

  // Write results to JSON
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputPath = path.join(__dirname, `deployed-test-results-${timestamp}.json`);

  const report = {
    timestamp: new Date().toISOString(),
    endpoint: DEPLOYED_URL,
    summary: {
      total: totalTests,
      passed,
      failed,
      passRate: `${passRate}%`,
      avgLatencyMs: Math.round(avgLatency),
      byGuide: {
        resident: { total: residentResults.length, passed: residentPassed },
        student: { total: studentResults.length, passed: studentPassed }
      }
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
        console.log(`   - ${r.id} (${r.guide}): Expected "${r.expected.intention}", got "${r.actual.intention || r.actual.error}"`);
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
