/**
 * ANZ Showcase Deployed Intention Classification Test Suite
 *
 * Tests ANZ Showcase intentions against the deployed App Runner endpoint
 * to verify production behavior aligns with ANZ Showcase Prompts PDF.
 *
 * Usage: node tests/test-anz-deployed-intentions.js
 */

const fs = require('fs');
const path = require('path');

// Deployed ANZ Showcase App Runner endpoint
const DEPLOYED_URL = 'https://pygmtkd2jp.ap-southeast-2.awsapprunner.com';

// ============================================
// LEAVE MANAGEMENT TEST CASES (PDF #1-5)
// Based on: ANZ Showcase Prompts PDF
// ============================================
const LEAVE_TEST_CASES = [
  // PDF #1: Critical insight card - Leave approvals
  {
    id: 'L-1.1',
    category: 'Leave Management',
    scenario: 'View Pending Approvals',
    prompt: 'Show me pending leave requests that need my approval',
    expectedIntention: 'leave_view_approvals',
    expectedAgents: ['mytask', 'leave'],
    context: []
  },
  {
    id: 'L-1.2',
    category: 'Leave Management',
    scenario: 'View Pending Approvals',
    prompt: 'What leave requests are waiting for me?',
    expectedIntention: 'leave_view_approvals',
    expectedAgents: ['mytask', 'leave'],
    context: []
  },

  // PDF #2: Check against policy
  {
    id: 'L-2.1',
    category: 'Leave Management',
    scenario: 'Check Policy',
    prompt: 'Check these requests against our leave policy',
    expectedIntention: 'leave_check_policy',
    expectedAgents: ['leave', 'knowledge'],
    context: [
      { type: 'user', content: 'Show me pending leave requests' },
      { type: 'assistant', content: 'You have 3 pending leave requests from your team members: Sarah (5 days annual leave), Mike (2 days sick leave), and Lisa (1 day personal leave).' }
    ]
  },
  {
    id: 'L-2.2',
    category: 'Leave Management',
    scenario: 'Check Policy',
    prompt: 'Do these comply with company leave policy?',
    expectedIntention: 'leave_check_policy',
    expectedAgents: ['leave', 'knowledge'],
    context: [
      { type: 'user', content: 'What leave requests need approval?' },
      { type: 'assistant', content: 'There are pending requests from your team.' }
    ]
  },

  // PDF #3: Bulk approve
  {
    id: 'L-3.1',
    category: 'Leave Management',
    scenario: 'Bulk Approve',
    prompt: 'Approve them all',
    expectedIntention: 'leave_bulk_approve',
    expectedAgents: ['mytask'],
    context: [
      { type: 'user', content: 'Show me pending leave requests' },
      { type: 'assistant', content: 'You have 3 pending requests.' },
      { type: 'user', content: 'Check against policy' },
      { type: 'assistant', content: 'All requests comply with company policy. Would you like to approve them?' }
    ]
  },
  {
    id: 'L-3.2',
    category: 'Leave Management',
    scenario: 'Bulk Approve',
    prompt: 'Yes, approve all pending leave requests',
    expectedIntention: 'leave_bulk_approve',
    expectedAgents: ['mytask'],
    context: [
      { type: 'user', content: 'What needs my approval?' },
      { type: 'assistant', content: 'There are 5 leave requests pending your approval.' }
    ]
  },

  // PDF #4: Team leave balances chart
  {
    id: 'L-4.1',
    category: 'Leave Management',
    scenario: 'Team Balances',
    prompt: 'Show me a chart of team leave balances',
    expectedIntention: 'leave_team_balances',
    expectedAgents: ['analytics'],
    context: []
  },
  {
    id: 'L-4.2',
    category: 'Leave Management',
    scenario: 'Team Balances',
    prompt: 'Can you visualize the leave balances for my team?',
    expectedIntention: 'leave_team_balances',
    expectedAgents: ['analytics'],
    context: []
  },

  // PDF #5: Draft email about leave
  {
    id: 'L-5.1',
    category: 'Leave Management',
    scenario: 'Draft Email',
    prompt: 'Generate an email reminding Jacqui about her excess leave',
    expectedIntention: 'leave_draft_email',
    expectedAgents: ['email'],
    context: [
      { type: 'user', content: 'Show me team leave balances' },
      { type: 'assistant', content: 'Here are your team leave balances. Jacqui has 45 days accumulated which exceeds the recommended limit.' }
    ]
  },
  {
    id: 'L-5.2',
    category: 'Leave Management',
    scenario: 'Draft Email',
    prompt: 'Draft an email to the team about using their leave before end of year',
    expectedIntention: 'leave_draft_email',
    expectedAgents: ['email'],
    context: []
  },

  // Leave conflicts check
  {
    id: 'L-6.1',
    category: 'Leave Management',
    scenario: 'Check Conflicts',
    prompt: 'Are there any conflicts with these leave dates?',
    expectedIntention: 'leave_check_conflicts',
    expectedAgents: ['leave', 'knowledge'],
    context: [
      { type: 'user', content: 'Show pending leave requests' },
      { type: 'assistant', content: 'You have several pending leave requests for next month.' }
    ]
  }
];

// ============================================
// RECRUITMENT TEST CASES (PDF #7-12)
// Based on: ANZ Showcase Prompts PDF
// ============================================
const RECRUITMENT_TEST_CASES = [
  // PDF #7: Critical tasks for recruitment
  {
    id: 'R-7.1',
    category: 'Recruitment',
    scenario: 'View Applications',
    prompt: 'Show me applications for the senior developer position',
    expectedIntention: 'recruitment_view_applications',
    expectedAgents: ['recruitment'],
    context: []
  },
  {
    id: 'R-7.2',
    category: 'Recruitment',
    scenario: 'View Applications',
    prompt: 'What candidates have applied for my open requisitions?',
    expectedIntention: 'recruitment_view_applications',
    expectedAgents: ['recruitment'],
    context: []
  },

  // PDF #8: Show me Sarah
  {
    id: 'R-8.1',
    category: 'Recruitment',
    scenario: 'Application Summary',
    prompt: 'Show me Sarah',
    expectedIntention: 'recruitment_application_summary',
    expectedAgents: ['recruitment'],
    context: [
      { type: 'user', content: 'Show applications for senior developer' },
      { type: 'assistant', content: 'You have 4 applicants: Sarah Chen (5 years exp), Mike Johnson (3 years), Lisa Wang (7 years), Tom Brown (2 years).' }
    ]
  },
  {
    id: 'R-8.2',
    category: 'Recruitment',
    scenario: 'Application Summary',
    prompt: 'Tell me more about the first candidate',
    expectedIntention: 'recruitment_application_summary',
    expectedAgents: ['recruitment'],
    context: [
      { type: 'user', content: 'Who applied?' },
      { type: 'assistant', content: 'There are 3 candidates for this role.' }
    ]
  },

  // PDF #9: Compare candidates
  {
    id: 'R-9.1',
    category: 'Recruitment',
    scenario: 'Compare Candidates',
    prompt: 'Compare all the candidates',
    expectedIntention: 'recruitment_compare_candidates',
    expectedAgents: ['recruitment'],
    context: [
      { type: 'user', content: 'Show me applications' },
      { type: 'assistant', content: 'You have 4 applicants for the senior developer position.' }
    ]
  },
  {
    id: 'R-9.2',
    category: 'Recruitment',
    scenario: 'Compare Candidates',
    prompt: 'How do these candidates stack up against each other?',
    expectedIntention: 'recruitment_compare_candidates',
    expectedAgents: ['recruitment'],
    context: [
      { type: 'user', content: 'Who applied for the role?' },
      { type: 'assistant', content: 'Here are the applicants.' }
    ]
  },

  // PDF #10: Move candidates
  {
    id: 'R-10.1',
    category: 'Recruitment',
    scenario: 'Move Stage',
    prompt: 'Move Sarah to the next stage and mark the others as unsuitable',
    expectedIntention: 'recruitment_move_stage',
    expectedAgents: ['recruitment', 'mytask'],
    context: [
      { type: 'user', content: 'Compare all candidates' },
      { type: 'assistant', content: 'Based on qualifications and experience, Sarah Chen appears to be the strongest candidate with relevant skills and experience.' }
    ]
  },
  {
    id: 'R-10.2',
    category: 'Recruitment',
    scenario: 'Move Stage',
    prompt: 'Progress the top candidate to interview stage',
    expectedIntention: 'recruitment_move_stage',
    expectedAgents: ['recruitment', 'mytask'],
    context: [
      { type: 'user', content: 'Who is the best candidate?' },
      { type: 'assistant', content: 'Based on qualifications, Sarah is the strongest candidate.' }
    ]
  },

  // PDF #11: Interview questions
  {
    id: 'R-11.1',
    category: 'Recruitment',
    scenario: 'Interview Questions',
    prompt: 'Generate interview questions for Sarah',
    expectedIntention: 'recruitment_interview_questions',
    expectedAgents: ['recruitment'],
    context: [
      { type: 'user', content: 'Move Sarah to the next stage' },
      { type: 'assistant', content: 'Sarah has been moved to the interview stage. Would you like me to prepare interview materials?' }
    ]
  },
  {
    id: 'R-11.2',
    category: 'Recruitment',
    scenario: 'Interview Questions',
    prompt: 'What questions should I ask in the technical interview?',
    expectedIntention: 'recruitment_interview_questions',
    expectedAgents: ['recruitment'],
    context: [
      { type: 'user', content: 'Schedule an interview with the candidate' },
      { type: 'assistant', content: 'Interview has been scheduled.' }
    ]
  },

  // PDF #12: Email that to me
  {
    id: 'R-12.1',
    category: 'Recruitment',
    scenario: 'Email Content',
    prompt: 'Email that to me',
    expectedIntention: 'general_email',
    expectedAgents: ['email'],
    context: [
      { type: 'user', content: 'Generate interview questions' },
      { type: 'assistant', content: 'Here are suggested interview questions for Sarah: 1) Describe your experience with microservices... 2) How do you handle technical debt...' }
    ]
  },
  {
    id: 'R-12.2',
    category: 'Recruitment',
    scenario: 'Email Content',
    prompt: 'Send this to me via email',
    expectedIntention: 'general_email',
    expectedAgents: ['email'],
    context: [
      { type: 'user', content: 'Show candidate comparison' },
      { type: 'assistant', content: 'Here is the comparison table of all candidates.' }
    ]
  }
];

// ============================================
// ADDITIONAL ANZ TEST CASES
// Work Request, Requisition, Finance, Analytics
// ============================================
const ADDITIONAL_TEST_CASES = [
  // Work Request
  {
    id: 'W-1.1',
    category: 'Work Request',
    scenario: 'Create Request',
    prompt: 'I need to report a broken air conditioner in meeting room 3',
    expectedIntention: 'work_request_create',
    expectedAgents: ['workrequest'],
    context: []
  },
  {
    id: 'W-1.2',
    category: 'Work Request',
    scenario: 'Check Status',
    prompt: 'What is the status of my maintenance request?',
    expectedIntention: 'work_request_status',
    expectedAgents: ['workrequest'],
    context: [
      { type: 'user', content: 'I reported a broken AC' },
      { type: 'assistant', content: 'Your work request WR-12345 has been submitted.' }
    ]
  },

  // Requisition
  {
    id: 'Q-1.1',
    category: 'Requisition',
    scenario: 'Order Desk',
    prompt: 'I need to order a new standing desk',
    expectedIntention: 'requisition_desk',
    expectedAgents: ['requisition', 'workrequest'],
    context: []
  },
  {
    id: 'Q-1.2',
    category: 'Requisition',
    scenario: 'Search Product',
    prompt: 'Search for ergonomic keyboards in the catalog',
    expectedIntention: 'requisition_search_product',
    expectedAgents: ['requisition'],
    context: []
  },

  // Finance
  {
    id: 'F-1.1',
    category: 'Finance',
    scenario: 'View Budget',
    prompt: 'Show me my department budget',
    expectedIntention: 'finance_view_budget',
    expectedAgents: ['finance'],
    context: []
  },
  {
    id: 'F-1.2',
    category: 'Finance',
    scenario: 'Check Expenses',
    prompt: 'What have we spent this quarter?',
    expectedIntention: 'finance_check_expenses',
    expectedAgents: ['finance'],
    context: []
  },
  {
    id: 'F-1.3',
    category: 'Finance',
    scenario: 'Analyze Costs',
    prompt: 'Analyze our cost trends over the past year',
    expectedIntention: 'finance_analyze_costs',
    expectedAgents: ['finance', 'analytics'],
    context: []
  },

  // Analytics
  {
    id: 'A-1.1',
    category: 'Analytics',
    scenario: 'Visualization',
    prompt: 'Create a chart showing team productivity metrics',
    expectedIntention: 'analytics_visualization',
    expectedAgents: ['analytics'],
    context: []
  },
  {
    id: 'A-1.2',
    category: 'Analytics',
    scenario: 'Raw Data',
    prompt: 'Export the raw data for this report',
    expectedIntention: 'analytics_raw_data',
    expectedAgents: ['analytics'],
    context: [
      { type: 'user', content: 'Show team analytics' },
      { type: 'assistant', content: 'Here is your team performance dashboard.' }
    ]
  },

  // General inquiry (orchestrator only)
  {
    id: 'G-1.1',
    category: 'General',
    scenario: 'General Inquiry',
    prompt: 'Hello, what can you help me with?',
    expectedIntention: 'general_inquiry',
    expectedAgents: ['orchestrator'],
    context: []
  }
];

// Combine all test cases
const ALL_TEST_CASES = [...LEAVE_TEST_CASES, ...RECRUITMENT_TEST_CASES, ...ADDITIONAL_TEST_CASES];

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
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

async function callDeployedEndpoint(prompt, context) {
  // Build the messages array format expected by the API
  // Context messages first, then the latest user message
  const messages = [
    ...context.map(msg => ({
      type: msg.type,
      content: msg.content,
      userId: 'test-deployed-user'
    })),
    // Add the current user message
    {
      type: 'user',
      content: prompt,
      userId: 'test-deployed-user'
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
  console.log(`\n${colors.bright}${colors.cyan}ANZ Showcase Deployed Intention Test Suite${colors.reset}`);
  console.log(`${'='.repeat(70)}`);
  console.log(`${colors.dim}Testing against: ${DEPLOYED_URL}${colors.reset}`);
  console.log(`${colors.dim}Total tests: ${ALL_TEST_CASES.length}${colors.reset}`);
  console.log(`${colors.dim}  - Leave Management: ${LEAVE_TEST_CASES.length}${colors.reset}`);
  console.log(`${colors.dim}  - Recruitment: ${RECRUITMENT_TEST_CASES.length}${colors.reset}`);
  console.log(`${colors.dim}  - Additional (Work/Requisition/Finance/Analytics): ${ADDITIONAL_TEST_CASES.length}${colors.reset}\n`);

  let passed = 0;
  let failed = 0;
  const results = [];
  let currentCategory = '';
  let currentScenario = '';

  for (const testCase of ALL_TEST_CASES) {
    // Print category header when it changes
    if (testCase.category !== currentCategory) {
      currentCategory = testCase.category;
      const categoryColor =
        currentCategory === 'Leave Management' ? colors.cyan :
        currentCategory === 'Recruitment' ? colors.magenta :
        currentCategory === 'Work Request' ? colors.blue :
        currentCategory === 'Finance' ? colors.green :
        colors.yellow;
      console.log(`\n${colors.bright}${categoryColor}═══ ${currentCategory.toUpperCase()} ═══${colors.reset}`);
      currentScenario = ''; // Reset scenario for new category
    }

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
      const startTime = Date.now();
      const { intention, agents } = await callDeployedEndpoint(
        testCase.prompt,
        testCase.context
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
        category: testCase.category,
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
        category: testCase.category,
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

  // Per-category summary
  const leaveResults = results.filter(r => r.category === 'Leave Management');
  const recruitmentResults = results.filter(r => r.category === 'Recruitment');
  const additionalResults = results.filter(r => !['Leave Management', 'Recruitment'].includes(r.category));

  const leavePassed = leaveResults.filter(r => r.success).length;
  const recruitmentPassed = recruitmentResults.filter(r => r.success).length;
  const additionalPassed = additionalResults.filter(r => r.success).length;

  console.log(`\n${'='.repeat(70)}`);
  console.log(`${colors.bright}SUMMARY${colors.reset}`);
  console.log(`${'='.repeat(70)}`);
  console.log(`   Total Tests:     ${totalTests}`);
  console.log(`   Passed:          ${colors.green}${passed}${colors.reset}`);
  console.log(`   Failed:          ${failed > 0 ? colors.red : ''}${failed}${colors.reset}`);
  console.log(`   Pass Rate:       ${passRate >= 80 ? colors.green : colors.yellow}${passRate}%${colors.reset}`);
  console.log(`   Avg Latency:     ${avgLatency.toFixed(0)}ms`);
  console.log(`\n   ${colors.cyan}Leave Management:${colors.reset} ${leavePassed}/${leaveResults.length} (${((leavePassed/leaveResults.length)*100).toFixed(1)}%)`);
  console.log(`   ${colors.magenta}Recruitment:${colors.reset}      ${recruitmentPassed}/${recruitmentResults.length} (${((recruitmentPassed/recruitmentResults.length)*100).toFixed(1)}%)`);
  console.log(`   ${colors.yellow}Additional:${colors.reset}       ${additionalPassed}/${additionalResults.length} (${((additionalPassed/additionalResults.length)*100).toFixed(1)}%)`);

  // Write results to JSON
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputPath = path.join(__dirname, `anz-deployed-test-results-${timestamp}.json`);

  const report = {
    timestamp: new Date().toISOString(),
    endpoint: DEPLOYED_URL,
    summary: {
      total: totalTests,
      passed,
      failed,
      passRate: `${passRate}%`,
      avgLatencyMs: Math.round(avgLatency),
      byCategory: {
        leaveManagement: { total: leaveResults.length, passed: leavePassed },
        recruitment: { total: recruitmentResults.length, passed: recruitmentPassed },
        additional: { total: additionalResults.length, passed: additionalPassed }
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
        console.log(`   - ${r.id} (${r.category}): Expected "${r.expected.intention}", got "${r.actual.intention || r.actual.error}"`);
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
