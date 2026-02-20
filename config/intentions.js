// ANZ Showcase Intentions
// Based on ANZ Showcase Prompts PDF and Plus workflow documentation

const DEMO_INTENTIONS = {
  // Leave Management Flows (PDF Scenarios 1-5)
  LEAVE_VIEW_APPROVALS: 'leave_view_approvals',
  LEAVE_BULK_APPROVE: 'leave_bulk_approve',
  LEAVE_CHECK_CONFLICTS: 'leave_check_conflicts',
  LEAVE_CHECK_POLICY: 'leave_check_policy',
  LEAVE_TEAM_BALANCES: 'leave_team_balances',
  LEAVE_DRAFT_EMAIL: 'leave_draft_email',

  // Recruitment Flows (PDF Scenarios 7-12)
  RECRUITMENT_VIEW_POSITIONS: 'recruitment_view_positions',
  RECRUITMENT_VIEW_APPLICATIONS: 'recruitment_view_applications',
  RECRUITMENT_APPLICATION_SUMMARY: 'recruitment_application_summary',
  RECRUITMENT_COMPARE_CANDIDATES: 'recruitment_compare_candidates',
  RECRUITMENT_MOVE_STAGE: 'recruitment_move_stage',
  RECRUITMENT_INTERVIEW_QUESTIONS: 'recruitment_interview_questions',

  // Email Flows (PDF Scenarios 5, 12)
  GENERAL_EMAIL: 'general_email',

  // Work Request Flows (Additional)
  WORK_REQUEST_CREATE: 'work_request_create',
  WORK_REQUEST_FOLLOW: 'work_request_follow',
  WORK_REQUEST_STATUS: 'work_request_status',
  WORK_REQUEST_SEARCH: 'work_request_search',

  // Requisition Flows (Additional)
  REQUISITION_CREATE: 'requisition_create',
  REQUISITION_SEARCH_PRODUCT: 'requisition_search_product',
  REQUISITION_ADD_ITEM: 'requisition_add_item',
  REQUISITION_DESK: 'requisition_desk',

  // Analytics Flows (PDF Scenario 4)
  ANALYTICS_TEAM_LEAVE: 'analytics_team_leave',
  ANALYTICS_VISUALIZATION: 'analytics_visualization',
  ANALYTICS_RAW_DATA: 'analytics_raw_data',

  // Finance Flows (Additional)
  FINANCE_VIEW_BUDGET: 'finance_view_budget',
  FINANCE_CHECK_EXPENSES: 'finance_check_expenses',
  FINANCE_ANALYZE_COSTS: 'finance_analyze_costs',

  // General/Unknown
  GENERAL_INQUIRY: 'general_inquiry'
};

// Semantic descriptions for each intention to guide LLM classification
const INTENTION_DESCRIPTIONS = {
  // Leave Management
  'leave_view_approvals': 'User clicking critical insight card for leave, viewing pending leave requests, or checking leave that needs approval',
  'leave_bulk_approve': 'User wanting to approve all pending leave requests at once, bulk approval',
  'leave_check_conflicts': 'User checking for scheduling conflicts or team calendar availability',
  'leave_check_policy': 'User asking to check leave requests against company leave policy',
  'leave_team_balances': 'User requesting visualization of team leave balances, bar chart, or leave data',
  'leave_draft_email': 'User asking to generate or draft an email about leave, remind someone about leave',

  // Recruitment
  'recruitment_view_positions': 'User viewing open positions or job vacancies',
  'recruitment_view_applications': 'User clicking critical tasks for recruitment, viewing applications on requisition',
  'recruitment_application_summary': 'User asking to show details about a specific candidate like Sarah',
  'recruitment_compare_candidates': 'User asking to compare candidates to each other',
  'recruitment_move_stage': 'User moving candidates to next stage, marking unsuitable, workflow actions',
  'recruitment_interview_questions': 'User asking to generate interview questions for a candidate',

  // Email
  'general_email': 'User asking to email something, send via email, email that to me',

  // Work Request
  'work_request_create': 'User creating a new work request, reporting an issue, maintenance request',
  'work_request_follow': 'User following up on existing work request',
  'work_request_status': 'User checking status of work request',
  'work_request_search': 'User searching for work requests',

  // Requisition
  'requisition_create': 'User creating a purchase requisition',
  'requisition_search_product': 'User searching product catalog',
  'requisition_add_item': 'User adding item to requisition',
  'requisition_desk': 'User ordering a desk or furniture',

  // Analytics
  'analytics_team_leave': 'User viewing team leave analytics or visualizations',
  'analytics_visualization': 'User creating charts or data visualizations',
  'analytics_raw_data': 'User requesting raw data export',

  // Finance
  'finance_view_budget': 'User viewing budget information or financial overview',
  'finance_check_expenses': 'User checking expenses or spending reports',
  'finance_analyze_costs': 'User analyzing costs or financial trends',

  // General
  'general_inquiry': 'Fallback for general questions'
};

// Agent mapping for each intention
// Valid Agent IDs: knowledge, mytask, leave, analytics, finance, workrequest, requisition, recruitment, email
const INTENTION_TO_AGENT = {
  // Leave Management (PDF aligned)
  [DEMO_INTENTIONS.LEAVE_VIEW_APPROVALS]: ['mytask', 'leave'],
  [DEMO_INTENTIONS.LEAVE_BULK_APPROVE]: ['mytask'],
  [DEMO_INTENTIONS.LEAVE_CHECK_CONFLICTS]: ['leave', 'knowledge'],
  [DEMO_INTENTIONS.LEAVE_CHECK_POLICY]: ['leave', 'knowledge'],
  [DEMO_INTENTIONS.LEAVE_TEAM_BALANCES]: ['analytics'],
  [DEMO_INTENTIONS.LEAVE_DRAFT_EMAIL]: ['email'],

  // Recruitment (PDF aligned)
  [DEMO_INTENTIONS.RECRUITMENT_VIEW_POSITIONS]: ['recruitment'],
  [DEMO_INTENTIONS.RECRUITMENT_VIEW_APPLICATIONS]: ['recruitment'],
  [DEMO_INTENTIONS.RECRUITMENT_APPLICATION_SUMMARY]: ['recruitment'],
  [DEMO_INTENTIONS.RECRUITMENT_COMPARE_CANDIDATES]: ['recruitment'],
  [DEMO_INTENTIONS.RECRUITMENT_MOVE_STAGE]: ['recruitment', 'mytask'],
  [DEMO_INTENTIONS.RECRUITMENT_INTERVIEW_QUESTIONS]: ['recruitment'],

  // Email (PDF aligned)
  [DEMO_INTENTIONS.GENERAL_EMAIL]: ['email'],

  // Work Request
  [DEMO_INTENTIONS.WORK_REQUEST_CREATE]: ['workrequest'],
  [DEMO_INTENTIONS.WORK_REQUEST_FOLLOW]: ['workrequest'],
  [DEMO_INTENTIONS.WORK_REQUEST_STATUS]: ['workrequest'],
  [DEMO_INTENTIONS.WORK_REQUEST_SEARCH]: ['workrequest'],

  // Requisition
  [DEMO_INTENTIONS.REQUISITION_CREATE]: ['requisition'],
  [DEMO_INTENTIONS.REQUISITION_SEARCH_PRODUCT]: ['requisition'],
  [DEMO_INTENTIONS.REQUISITION_ADD_ITEM]: ['requisition'],
  [DEMO_INTENTIONS.REQUISITION_DESK]: ['requisition', 'workrequest'],

  // Analytics
  [DEMO_INTENTIONS.ANALYTICS_TEAM_LEAVE]: ['analytics'],
  [DEMO_INTENTIONS.ANALYTICS_VISUALIZATION]: ['analytics'],
  [DEMO_INTENTIONS.ANALYTICS_RAW_DATA]: ['analytics'],

  // Finance
  [DEMO_INTENTIONS.FINANCE_VIEW_BUDGET]: ['finance'],
  [DEMO_INTENTIONS.FINANCE_CHECK_EXPENSES]: ['finance'],
  [DEMO_INTENTIONS.FINANCE_ANALYZE_COSTS]: ['finance', 'analytics'],

  // General
  [DEMO_INTENTIONS.GENERAL_INQUIRY]: ['orchestrator']
};

module.exports = {
  DEMO_INTENTIONS,
  INTENTION_DESCRIPTIONS,
  INTENTION_TO_AGENT
};
