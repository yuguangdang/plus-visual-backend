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

// Test cases based on ANZ Showcase Prompts PDF (dated 21/02/2026)
const ANZ_TEST_CASES = [
  // ============================================
  // PDF SCENARIO 1 - Leave Management (Rows 1-5)
  // MUST MATCH PDF EXACTLY
  // ============================================
  {
    id: 'PDF-1',
    prompt: 'Show me my critical tasks. Insight userId: CCARTER insightId: CRITICALTASKSDEMO identifierType: U identifierValue: CCARTER enablementInstanceNumber: 1',
    expectedIntention: 'leave_view_approvals',
    expectedAgents: ['mytask', 'leave'],
    category: 'PDF - Leave Management'
  },
  {
    id: 'PDF-2',
    prompt: 'Check the leave requests against our leave policy',
    expectedIntention: 'leave_check_policy',
    expectedAgents: ['leave', 'knowledge'],
    category: 'PDF - Leave Management'
  },
  {
    id: 'PDF-3',
    prompt: 'Approve them all',
    expectedIntention: 'leave_bulk_approve',
    expectedAgents: ['mytask'],
    category: 'PDF - Leave Management'
  },
  {
    id: 'PDF-4',
    prompt: 'Show me my teams leave balances in a bar chart',
    expectedIntention: 'leave_team_balances',
    expectedAgents: ['analytics'],
    category: 'PDF - Leave Management'
  },
  {
    id: 'PDF-5',
    prompt: 'Generate an email to Jacqui asking her to take some leave',
    expectedIntention: 'leave_draft_email',
    expectedAgents: ['email'],
    category: 'PDF - Leave Management'
  },

  // ============================================
  // PDF SCENARIO 2 - Recruitment (Rows 7-12)
  // MUST MATCH PDF EXACTLY
  // ============================================
  {
    id: 'PDF-7',
    prompt: 'Show me my open requisitions for my applications. Insight userId: CCARTER insightId: OPENREQUISITIONSFORMYAPPLICATIONS identifierType: U identifierValue: CCARTER enablementInstanceNumber: 1',
    expectedIntention: 'recruitment_view_applications',
    expectedAgents: ['recruitment'],
    category: 'PDF - Recruitment'
  },
  {
    id: 'PDF-8',
    prompt: 'Show me Sarah',
    expectedIntention: 'recruitment_application_summary',
    expectedAgents: ['recruitment'],
    category: 'PDF - Recruitment'
  },
  {
    id: 'PDF-9',
    prompt: 'Compare sarah to the other candidates',
    expectedIntention: 'recruitment_compare_candidates',
    expectedAgents: ['recruitment'],
    category: 'PDF - Recruitment'
  },
  {
    id: 'PDF-10',
    prompt: 'Move Sarah to the next stage and the others to unsuitable',
    expectedIntention: 'recruitment_move_stage',
    expectedAgents: ['recruitment', 'mytask'],
    category: 'PDF - Recruitment'
  },
  {
    id: 'PDF-11',
    prompt: 'Generate some interview questions for Sarah',
    expectedIntention: 'recruitment_interview_questions',
    expectedAgents: ['recruitment'],
    category: 'PDF - Recruitment'
  },
  {
    id: 'PDF-12',
    prompt: 'Email that to me',
    expectedIntention: 'general_email',
    expectedAgents: ['email'],
    category: 'PDF - Recruitment'
  },

  // ============================================
  // ADDITIONAL TESTS - Leave Management Variants
  // ============================================
  {
    id: 'L-1',
    prompt: 'Show me the leave requests that need approval',
    expectedIntention: 'leave_view_approvals',
    expectedAgents: ['mytask', 'leave'],
    category: 'Leave Management'
  },
  {
    id: 'L-2',
    prompt: 'Are there any scheduling conflicts with these leave requests?',
    expectedIntention: 'leave_check_conflicts',
    expectedAgents: ['leave', 'knowledge'],
    category: 'Leave Management'
  },

  // ============================================
  // ADDITIONAL TESTS - Work Request
  // ============================================
  {
    id: 'W-1',
    prompt: 'There is a hole in the wall in meeting room 3, can you report it?',
    expectedIntention: 'work_request_create',
    expectedAgents: ['workrequest'],
    category: 'Work Request'
  },
  {
    id: 'W-2',
    prompt: 'Create a maintenance request for the broken AC',
    expectedIntention: 'work_request_create',
    expectedAgents: ['workrequest'],
    category: 'Work Request'
  },
  {
    id: 'W-3',
    prompt: 'What is the status of my work request?',
    expectedIntention: 'work_request_status',
    expectedAgents: ['workrequest'],
    category: 'Work Request'
  },
  {
    id: 'W-4',
    prompt: 'Follow up on my previous request',
    expectedIntention: 'work_request_follow',
    expectedAgents: ['workrequest'],
    category: 'Work Request'
  },
  {
    id: 'W-5',
    prompt: 'Search for my existing work requests',
    expectedIntention: 'work_request_search',
    expectedAgents: ['workrequest'],
    category: 'Work Request'
  },

  // ============================================
  // ADDITIONAL TESTS - Requisition
  // ============================================
  {
    id: 'Q-1',
    prompt: 'I need to order a new standing desk',
    expectedIntention: 'requisition_desk',
    expectedAgents: ['requisition', 'workrequest'],
    category: 'Requisition'
  },
  {
    id: 'Q-2',
    prompt: 'Search the product catalog for ergonomic chairs',
    expectedIntention: 'requisition_search_product',
    expectedAgents: ['requisition'],
    category: 'Requisition'
  },
  {
    id: 'Q-3',
    prompt: 'Create a new purchase requisition',
    expectedIntention: 'requisition_create',
    expectedAgents: ['requisition'],
    category: 'Requisition'
  },
  {
    id: 'Q-4',
    prompt: 'Add this item to my requisition',
    expectedIntention: 'requisition_add_item',
    expectedAgents: ['requisition'],
    category: 'Requisition'
  },

  // ============================================
  // ADDITIONAL TESTS - Finance
  // ============================================
  {
    id: 'F-1',
    prompt: 'Show me the current budget status for my department',
    expectedIntention: 'finance_view_budget',
    expectedAgents: ['finance'],
    category: 'Finance'
  },
  {
    id: 'F-2',
    prompt: 'Show me our expenses for this quarter',
    expectedIntention: 'finance_check_expenses',
    expectedAgents: ['finance'],
    category: 'Finance'
  },
  {
    id: 'F-3',
    prompt: 'Analyze our cost trends over the last 6 months',
    expectedIntention: 'finance_analyze_costs',
    expectedAgents: ['finance', 'analytics'],
    category: 'Finance'
  },

  // ============================================
  // ADDITIONAL TESTS - Analytics
  // ============================================
  {
    id: 'A-1',
    prompt: 'Create a chart showing monthly expenses',
    expectedIntention: 'analytics_visualization',
    expectedAgents: ['analytics'],
    category: 'Analytics'
  },
  {
    id: 'A-2',
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
  magenta: '\x1b[35m',
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
  console.log(`Target: ${baseUrl}`);
  console.log(`Total tests: ${ANZ_TEST_CASES.length}\n`);

  let passed = 0;
  let failed = 0;
  const failures = [];
  let currentCategory = '';

  // Separate PDF tests from additional tests
  const pdfTests = ANZ_TEST_CASES.filter(t => t.id.startsWith('PDF-'));
  const additionalTests = ANZ_TEST_CASES.filter(t => !t.id.startsWith('PDF-'));

  console.log(`${colors.magenta}PDF Tests: ${pdfTests.length} | Additional Tests: ${additionalTests.length}${colors.reset}\n`);

  for (const testCase of ANZ_TEST_CASES) {
    // Print category header
    if (testCase.category !== currentCategory) {
      currentCategory = testCase.category;
      const isPDF = currentCategory.startsWith('PDF');
      const categoryColor = isPDF ? colors.magenta : colors.cyan;
      console.log(`\n${categoryColor}--- ${currentCategory} ---${colors.reset}`);
    }

    const result = await testIntention(baseUrl, testCase);
    const truncatedPrompt = testCase.prompt.length > 55
      ? testCase.prompt.substring(0, 55) + '...'
      : testCase.prompt;

    if (result.success) {
      passed++;
      console.log(`${colors.green}[PASS]${colors.reset} ${testCase.id}: "${truncatedPrompt}"`);
      console.log(`       ${colors.dim}-> ${result.actualIntention} [${result.actualAgents?.join(', ')}]${colors.reset}`);
    } else {
      failed++;
      failures.push(result);
      console.log(`${colors.red}[FAIL]${colors.reset} ${testCase.id}: "${truncatedPrompt}"`);
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
  const pdfPassed = pdfTests.filter(t => !failures.find(f => f.testCase.id === t.id)).length;
  const pdfFailed = pdfTests.length - pdfPassed;

  console.log(`\n${colors.cyan}========================================${colors.reset}`);
  console.log(`${colors.cyan}Summary${colors.reset}`);
  console.log(`${colors.cyan}========================================${colors.reset}`);
  console.log(`Total:  ${ANZ_TEST_CASES.length}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
  console.log(`Rate:   ${((passed / ANZ_TEST_CASES.length) * 100).toFixed(1)}%`);
  console.log(`\n${colors.magenta}PDF Tests: ${pdfPassed}/${pdfTests.length} (${((pdfPassed / pdfTests.length) * 100).toFixed(1)}%)${colors.reset}`);

  if (pdfFailed > 0) {
    console.log(`${colors.red}WARNING: PDF tests failed - demo prompts not working correctly!${colors.reset}`);
  }

  if (failures.length > 0) {
    console.log(`\n${colors.yellow}Failed Tests:${colors.reset}`);
    failures.forEach(f => {
      const isPDF = f.testCase.id.startsWith('PDF-');
      const prefix = isPDF ? `${colors.magenta}[PDF]${colors.reset}` : '';
      console.log(`  ${prefix} - ${f.testCase.id}: ${f.testCase.prompt.substring(0, 40)}...`);
    });
  }

  return { passed, failed, total: ANZ_TEST_CASES.length, pdfPassed, pdfTotal: pdfTests.length };
}

// Main execution
const useDeployed = process.argv.includes('--deployed');
runTests(useDeployed).then(results => {
  process.exit(results.failed > 0 ? 1 : 0);
}).catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
});
