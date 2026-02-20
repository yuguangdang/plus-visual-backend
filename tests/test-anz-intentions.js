/**
 * ANZ Showcase Intention Testing
 * Tests intention detection against expected mappings
 *
 * Usage:
 *   Local:    node tests/test-anz-intentions.js
 *   Deployed: node tests/test-anz-intentions.js --deployed
 */

const LOCAL_URL = 'http://localhost:8080';
const DEPLOYED_URL = 'https://pygmtkd2jp.ap-southeast-2.awsapprunner.com';

// Test cases based on ANZ Showcase PDF and additional agents
const ANZ_TEST_CASES = [
  // ============================================
  // Scenario 1 - Leave Management (PDF Scenarios 1-5)
  // ============================================
  {
    id: '1.1',
    prompt: 'I need to review the pending leave requests',
    expectedIntention: 'leave_view_approvals',
    expectedAgents: ['mytask', 'leave'],
    category: 'Leave Management'
  },
  {
    id: '1.1b',
    prompt: 'Show me the leave requests that need approval',
    expectedIntention: 'leave_view_approvals',
    expectedAgents: ['mytask', 'leave'],
    category: 'Leave Management'
  },
  {
    id: '1.2',
    prompt: 'Please approve them all',
    expectedIntention: 'leave_bulk_approve',
    expectedAgents: ['mytask'],
    category: 'Leave Management'
  },
  {
    id: '1.2b',
    prompt: 'Bulk approve all pending leave',
    expectedIntention: 'leave_bulk_approve',
    expectedAgents: ['mytask'],
    category: 'Leave Management'
  },
  {
    id: '1.3',
    prompt: 'Actually, first check the team calendar for any conflicts',
    expectedIntention: 'leave_check_conflicts',
    expectedAgents: ['leave', 'knowledge'],
    category: 'Leave Management'
  },
  {
    id: '1.3b',
    prompt: 'Are there any scheduling conflicts with these leave requests?',
    expectedIntention: 'leave_check_conflicts',
    expectedAgents: ['leave', 'knowledge'],
    category: 'Leave Management'
  },
  {
    id: '1.4',
    prompt: 'Check the leave requests against our leave policy',
    expectedIntention: 'leave_check_policy',
    expectedAgents: ['leave', 'knowledge'],
    category: 'Leave Management'
  },
  {
    id: '1.4b',
    prompt: 'Validate these against company policy',
    expectedIntention: 'leave_check_policy',
    expectedAgents: ['leave', 'knowledge'],
    category: 'Leave Management'
  },
  {
    id: '1.5',
    prompt: 'Show me the team leave balances as a bar chart',
    expectedIntention: 'leave_team_balances',
    expectedAgents: ['analytics'],
    category: 'Leave Management'
  },
  {
    id: '1.5b',
    prompt: 'Visualize team leave balances',
    expectedIntention: 'leave_team_balances',
    expectedAgents: ['analytics'],
    category: 'Leave Management'
  },
  {
    id: '1.6',
    prompt: 'Generate an email to Jacqui asking her to take the remaining leave',
    expectedIntention: 'leave_draft_email',
    expectedAgents: ['email'],
    category: 'Leave Management'
  },
  {
    id: '1.6b',
    prompt: 'Draft an email reminding him to use his leave',
    expectedIntention: 'leave_draft_email',
    expectedAgents: ['email'],
    category: 'Leave Management'
  },

  // ============================================
  // Scenario 2 - Recruitment (PDF Scenarios 7-12)
  // ============================================
  {
    id: '2.1',
    prompt: 'Show me the applications on my open requisition',
    expectedIntention: 'recruitment_view_applications',
    expectedAgents: ['recruitment'],
    category: 'Recruitment'
  },
  {
    id: '2.1b',
    prompt: 'Who has applied for the job?',
    expectedIntention: 'recruitment_view_applications',
    expectedAgents: ['recruitment'],
    category: 'Recruitment'
  },
  {
    id: '2.2',
    prompt: 'Show me Sarah',
    expectedIntention: 'recruitment_application_summary',
    expectedAgents: ['recruitment'],
    category: 'Recruitment'
  },
  {
    id: '2.2b',
    prompt: 'Tell me about the candidate details',
    expectedIntention: 'recruitment_application_summary',
    expectedAgents: ['recruitment'],
    category: 'Recruitment'
  },
  {
    id: '2.3',
    prompt: 'Compare Sarah to the other candidates',
    expectedIntention: 'recruitment_compare_candidates',
    expectedAgents: ['recruitment'],
    category: 'Recruitment'
  },
  {
    id: '2.3b',
    prompt: 'How does she compare to the others?',
    expectedIntention: 'recruitment_compare_candidates',
    expectedAgents: ['recruitment'],
    category: 'Recruitment'
  },
  {
    id: '2.4',
    prompt: 'Move Sarah to the next stage and mark the others as unsuitable',
    expectedIntention: 'recruitment_move_stage',
    expectedAgents: ['recruitment', 'mytask'],
    category: 'Recruitment'
  },
  {
    id: '2.4b',
    prompt: 'Shortlist Sarah and reject the rest',
    expectedIntention: 'recruitment_move_stage',
    expectedAgents: ['recruitment', 'mytask'],
    category: 'Recruitment'
  },
  {
    id: '2.5',
    prompt: 'Generate interview questions for Sarah',
    expectedIntention: 'recruitment_interview_questions',
    expectedAgents: ['recruitment'],
    category: 'Recruitment'
  },
  {
    id: '2.5b',
    prompt: 'Create an interview pack for the candidate',
    expectedIntention: 'recruitment_interview_questions',
    expectedAgents: ['recruitment'],
    category: 'Recruitment'
  },

  // ============================================
  // Scenario 3 - Email (PDF Scenarios 5, 12)
  // ============================================
  {
    id: '3.1',
    prompt: 'Email that to me',
    expectedIntention: 'general_email',
    expectedAgents: ['email'],
    category: 'Email'
  },
  {
    id: '3.1b',
    prompt: 'Send that via email',
    expectedIntention: 'general_email',
    expectedAgents: ['email'],
    category: 'Email'
  },

  // ============================================
  // Scenario 4 - Work Request (Additional)
  // ============================================
  {
    id: '4.1',
    prompt: 'There is a hole in the wall in meeting room 3, can you report it?',
    expectedIntention: 'work_request_create',
    expectedAgents: ['workrequest'],
    category: 'Work Request'
  },
  {
    id: '4.1b',
    prompt: 'Create a maintenance request for the broken AC',
    expectedIntention: 'work_request_create',
    expectedAgents: ['workrequest'],
    category: 'Work Request'
  },
  {
    id: '4.2',
    prompt: 'What is the status of my work request?',
    expectedIntention: 'work_request_status',
    expectedAgents: ['workrequest'],
    category: 'Work Request'
  },
  {
    id: '4.3',
    prompt: 'Follow up on my previous request',
    expectedIntention: 'work_request_follow',
    expectedAgents: ['workrequest'],
    category: 'Work Request'
  },
  {
    id: '4.4',
    prompt: 'Search for my existing work requests',
    expectedIntention: 'work_request_search',
    expectedAgents: ['workrequest'],
    category: 'Work Request'
  },

  // ============================================
  // Scenario 5 - Requisition (Additional)
  // ============================================
  {
    id: '5.1',
    prompt: 'I need to order a new standing desk',
    expectedIntention: 'requisition_desk',
    expectedAgents: ['requisition', 'workrequest'],
    category: 'Requisition'
  },
  {
    id: '5.1b',
    prompt: 'Requisition a desk replacement',
    expectedIntention: 'requisition_desk',
    expectedAgents: ['requisition', 'workrequest'],
    category: 'Requisition'
  },
  {
    id: '5.2',
    prompt: 'Search the product catalog for ergonomic chairs',
    expectedIntention: 'requisition_search_product',
    expectedAgents: ['requisition'],
    category: 'Requisition'
  },
  {
    id: '5.3',
    prompt: 'Create a new purchase requisition',
    expectedIntention: 'requisition_create',
    expectedAgents: ['requisition'],
    category: 'Requisition'
  },
  {
    id: '5.4',
    prompt: 'Add this item to my requisition',
    expectedIntention: 'requisition_add_item',
    expectedAgents: ['requisition'],
    category: 'Requisition'
  },

  // ============================================
  // Scenario 6 - Finance (Additional)
  // ============================================
  {
    id: '6.1',
    prompt: 'Show me the current budget status for my department',
    expectedIntention: 'finance_view_budget',
    expectedAgents: ['finance'],
    category: 'Finance'
  },
  {
    id: '6.1b',
    prompt: 'What is our budget overview?',
    expectedIntention: 'finance_view_budget',
    expectedAgents: ['finance'],
    category: 'Finance'
  },
  {
    id: '6.2',
    prompt: 'Show me our expenses for this quarter',
    expectedIntention: 'finance_check_expenses',
    expectedAgents: ['finance'],
    category: 'Finance'
  },
  {
    id: '6.2b',
    prompt: 'Generate an expense report',
    expectedIntention: 'finance_check_expenses',
    expectedAgents: ['finance'],
    category: 'Finance'
  },
  {
    id: '6.3',
    prompt: 'Analyze our cost trends over the last 6 months',
    expectedIntention: 'finance_analyze_costs',
    expectedAgents: ['finance', 'analytics'],
    category: 'Finance'
  },

  // ============================================
  // Scenario 7 - Analytics (Additional)
  // ============================================
  {
    id: '7.1',
    prompt: 'Create a chart showing monthly expenses',
    expectedIntention: 'analytics_visualization',
    expectedAgents: ['analytics'],
    category: 'Analytics'
  },
  {
    id: '7.2',
    prompt: 'Export the raw data for this report',
    expectedIntention: 'analytics_raw_data',
    expectedAgents: ['analytics'],
    category: 'Analytics'
  }
];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m'
};

async function testIntention(baseUrl, testCase) {
  const url = `${baseUrl}/api/chat-notification`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([{
        content: testCase.prompt,
        type: 'user',
        userId: 'test-user'
      }])
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
        testCase
      };
    }

    const data = await response.json();

    const intentionMatch = data.intention === testCase.expectedIntention;
    const agentsMatch = JSON.stringify(data.agents?.sort()) === JSON.stringify(testCase.expectedAgents.sort());

    return {
      success: intentionMatch && agentsMatch,
      intentionMatch,
      agentsMatch,
      actualIntention: data.intention,
      actualAgents: data.agents,
      testCase
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      testCase
    };
  }
}

async function runTests(useDeployed = false) {
  const baseUrl = useDeployed ? DEPLOYED_URL : LOCAL_URL;
  console.log(`\n${colors.cyan}========================================${colors.reset}`);
  console.log(`${colors.cyan}ANZ Showcase Intention Tests${colors.reset}`);
  console.log(`${colors.cyan}========================================${colors.reset}`);
  console.log(`Target: ${baseUrl}\n`);

  let passed = 0;
  let failed = 0;
  const failures = [];
  let currentCategory = '';

  for (const testCase of ANZ_TEST_CASES) {
    // Print category header
    if (testCase.category !== currentCategory) {
      currentCategory = testCase.category;
      console.log(`\n${colors.cyan}--- ${currentCategory} ---${colors.reset}`);
    }

    const result = await testIntention(baseUrl, testCase);

    if (result.success) {
      passed++;
      console.log(`${colors.green}[PASS]${colors.reset} ${testCase.id}: "${testCase.prompt.substring(0, 50)}..."`);
      console.log(`       ${colors.dim}-> ${result.actualIntention} [${result.actualAgents?.join(', ')}]${colors.reset}`);
    } else {
      failed++;
      failures.push(result);
      console.log(`${colors.red}[FAIL]${colors.reset} ${testCase.id}: "${testCase.prompt.substring(0, 50)}..."`);
      if (result.error) {
        console.log(`       ${colors.red}Error: ${result.error}${colors.reset}`);
      } else {
        console.log(`       ${colors.yellow}Expected: ${testCase.expectedIntention} [${testCase.expectedAgents.join(', ')}]${colors.reset}`);
        console.log(`       ${colors.red}Got:      ${result.actualIntention} [${result.actualAgents?.join(', ')}]${colors.reset}`);
        if (!result.intentionMatch) {
          console.log(`       ${colors.red}^ Intention mismatch${colors.reset}`);
        }
        if (!result.agentsMatch) {
          console.log(`       ${colors.red}^ Agents mismatch${colors.reset}`);
        }
      }
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // Summary
  console.log(`\n${colors.cyan}========================================${colors.reset}`);
  console.log(`${colors.cyan}Summary${colors.reset}`);
  console.log(`${colors.cyan}========================================${colors.reset}`);
  console.log(`Total:  ${ANZ_TEST_CASES.length}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
  console.log(`Rate:   ${((passed / ANZ_TEST_CASES.length) * 100).toFixed(1)}%`);

  if (failures.length > 0) {
    console.log(`\n${colors.yellow}Failed Tests:${colors.reset}`);
    failures.forEach(f => {
      console.log(`  - ${f.testCase.id}: ${f.testCase.prompt.substring(0, 40)}...`);
    });
  }

  return { passed, failed, total: ANZ_TEST_CASES.length };
}

// Main execution
const useDeployed = process.argv.includes('--deployed');
runTests(useDeployed).then(results => {
  process.exit(results.failed > 0 ? 1 : 0);
}).catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
});
