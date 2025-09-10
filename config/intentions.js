// Plus AI System Demo Intentions
// Based on showcase transcript and Plus workflow documentation

const DEMO_INTENTIONS = {
  // Leave Management Flows
  LEAVE_VIEW_APPROVALS: 'leave_view_approvals',
  LEAVE_BULK_APPROVE: 'leave_bulk_approve',
  LEAVE_CHECK_CONFLICTS: 'leave_check_conflicts',
  LEAVE_CHECK_POLICY: 'leave_check_policy',
  LEAVE_TEAM_BALANCES: 'leave_team_balances',
  LEAVE_DRAFT_EMAIL: 'leave_draft_email',
  
  // Work Request Flows
  WORK_REQUEST_CREATE: 'work_request_create',
  WORK_REQUEST_FOLLOW: 'work_request_follow',
  WORK_REQUEST_STATUS: 'work_request_status',
  WORK_REQUEST_SEARCH: 'work_request_search',
  
  // Requisition Flows
  REQUISITION_CREATE: 'requisition_create',
  REQUISITION_SEARCH_PRODUCT: 'requisition_search_product',
  REQUISITION_ADD_ITEM: 'requisition_add_item',
  REQUISITION_DESK: 'requisition_desk',
  
  // Analytics Flows
  ANALYTICS_TEAM_LEAVE: 'analytics_team_leave',
  ANALYTICS_VISUALIZATION: 'analytics_visualization',
  ANALYTICS_RAW_DATA: 'analytics_raw_data',
  
  // Recruitment Flows
  RECRUITMENT_VIEW_POSITIONS: 'recruitment_view_positions',
  RECRUITMENT_VIEW_APPLICATIONS: 'recruitment_view_applications',
  RECRUITMENT_APPLICATION_SUMMARY: 'recruitment_application_summary',
  RECRUITMENT_MOVE_TO_INTERVIEW: 'recruitment_move_to_interview',
  RECRUITMENT_CREATE_INTERVIEW_PACK: 'recruitment_create_interview_pack',
  
  // General/Unknown
  GENERAL_INQUIRY: 'general_inquiry'
};

// Agent mapping for each intention
const INTENTION_TO_AGENT = {
  // Leave Management → MyTask Agent + Leave Agent
  [DEMO_INTENTIONS.LEAVE_VIEW_APPROVALS]: ['mytask', 'knowledge'],
  [DEMO_INTENTIONS.LEAVE_BULK_APPROVE]: ['mytask'],
  [DEMO_INTENTIONS.LEAVE_CHECK_CONFLICTS]: ['mytask', 'knowledge'],
  [DEMO_INTENTIONS.LEAVE_CHECK_POLICY]: ['knowledge'],
  [DEMO_INTENTIONS.LEAVE_TEAM_BALANCES]: ['leave', 'analytics'],
  [DEMO_INTENTIONS.LEAVE_DRAFT_EMAIL]: ['orchestrator'],
  
  // Work Request → WorkRequest Agent
  [DEMO_INTENTIONS.WORK_REQUEST_CREATE]: ['workrequest'],
  [DEMO_INTENTIONS.WORK_REQUEST_FOLLOW]: ['workrequest'],
  [DEMO_INTENTIONS.WORK_REQUEST_STATUS]: ['workrequest', 'workorder'],
  [DEMO_INTENTIONS.WORK_REQUEST_SEARCH]: ['workrequest'],
  
  // Requisition → Requisition Agent
  [DEMO_INTENTIONS.REQUISITION_CREATE]: ['requisition'],
  [DEMO_INTENTIONS.REQUISITION_SEARCH_PRODUCT]: ['requisition'],
  [DEMO_INTENTIONS.REQUISITION_ADD_ITEM]: ['requisition'],
  [DEMO_INTENTIONS.REQUISITION_DESK]: ['requisition', 'workrequest'],
  
  // Analytics → Analytics Agent
  [DEMO_INTENTIONS.ANALYTICS_TEAM_LEAVE]: ['analytics', 'leave'],
  [DEMO_INTENTIONS.ANALYTICS_VISUALIZATION]: ['analytics'],
  [DEMO_INTENTIONS.ANALYTICS_RAW_DATA]: ['analytics'],
  
  // Recruitment → Recruitment Agent
  [DEMO_INTENTIONS.RECRUITMENT_VIEW_POSITIONS]: ['recruitment'],
  [DEMO_INTENTIONS.RECRUITMENT_VIEW_APPLICATIONS]: ['recruitment'],
  [DEMO_INTENTIONS.RECRUITMENT_APPLICATION_SUMMARY]: ['recruitment'],
  [DEMO_INTENTIONS.RECRUITMENT_MOVE_TO_INTERVIEW]: ['recruitment'],
  [DEMO_INTENTIONS.RECRUITMENT_CREATE_INTERVIEW_PACK]: ['recruitment'],
  
  // General
  [DEMO_INTENTIONS.GENERAL_INQUIRY]: ['orchestrator']
};

// Keywords mapping for better intention detection
const INTENTION_KEYWORDS = {
  [DEMO_INTENTIONS.LEAVE_VIEW_APPROVALS]: ['leave approval', 'approve leave', 'pending leave', 'leave requests'],
  [DEMO_INTENTIONS.LEAVE_BULK_APPROVE]: ['bulk approve', 'approve all', 'approve it all'],
  [DEMO_INTENTIONS.LEAVE_CHECK_CONFLICTS]: ['leave conflict', 'team calendar', 'leave calendar'],
  [DEMO_INTENTIONS.LEAVE_CHECK_POLICY]: ['leave policy', 'policy breach', 'policy compliance'],
  [DEMO_INTENTIONS.LEAVE_TEAM_BALANCES]: ['team leave balance', 'leave balance', 'team balances'],
  [DEMO_INTENTIONS.LEAVE_DRAFT_EMAIL]: ['draft email', 'email about leave', 'reminder email'],
  
  [DEMO_INTENTIONS.WORK_REQUEST_CREATE]: ['create work request', 'new work request', 'report issue', 'hole in wall', 'damaged carpet'],
  [DEMO_INTENTIONS.WORK_REQUEST_FOLLOW]: ['follow work request', 'follow existing'],
  [DEMO_INTENTIONS.WORK_REQUEST_STATUS]: ['work request status', 'how is my work request', 'check work request'],
  [DEMO_INTENTIONS.WORK_REQUEST_SEARCH]: ['search work request', 'find work request', 'existing work request'],
  
  [DEMO_INTENTIONS.REQUISITION_CREATE]: ['create requisition', 'purchase requisition', 'new requisition'],
  [DEMO_INTENTIONS.REQUISITION_SEARCH_PRODUCT]: ['search product', 'find product', 'product catalog', 'catalogue'],
  [DEMO_INTENTIONS.REQUISITION_ADD_ITEM]: ['add item', 'add to requisition'],
  [DEMO_INTENTIONS.REQUISITION_DESK]: ['requisition desk', 'new desk', 'standing desk', 'desk replacement'],
  
  [DEMO_INTENTIONS.ANALYTICS_TEAM_LEAVE]: ['team leave analytics', 'leave visualization', 'leave chart'],
  [DEMO_INTENTIONS.ANALYTICS_VISUALIZATION]: ['create chart', 'visualization', 'analytics', 'data model'],
  [DEMO_INTENTIONS.ANALYTICS_RAW_DATA]: ['raw data', 'export data', 'get data'],
  
  [DEMO_INTENTIONS.RECRUITMENT_VIEW_POSITIONS]: ['open positions', 'open jobs', 'vacancies', 'what jobs'],
  [DEMO_INTENTIONS.RECRUITMENT_VIEW_APPLICATIONS]: ['view applications', 'job applications', 'who applied'],
  [DEMO_INTENTIONS.RECRUITMENT_APPLICATION_SUMMARY]: ['application summary', 'tell me about', 'candidate summary'],
  [DEMO_INTENTIONS.RECRUITMENT_MOVE_TO_INTERVIEW]: ['move to interview', 'phone interview', 'interview stage'],
  [DEMO_INTENTIONS.RECRUITMENT_CREATE_INTERVIEW_PACK]: ['interview pack', 'interview questions', 'interview preparation']
};

module.exports = {
  DEMO_INTENTIONS,
  INTENTION_TO_AGENT,
  INTENTION_KEYWORDS
};
