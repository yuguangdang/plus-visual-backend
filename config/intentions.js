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

  // Task Management Flows
  TASK_VIEW_ALL: 'task_view_all',
  TASK_VIEW_URGENT: 'task_view_urgent',

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
  REQUISITION_VIEW_ALL: 'requisition_view_all',
  REQUISITION_VIEW_CONTRACTS: 'requisition_view_contracts',
  
  // Analytics Flows
  ANALYTICS_TEAM_LEAVE: 'analytics_team_leave',
  ANALYTICS_VISUALIZATION: 'analytics_visualization',
  ANALYTICS_RAW_DATA: 'analytics_raw_data',
  ANALYTICS_BUILDING_MAINTENANCE: 'analytics_building_maintenance',
  
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
  // Leave Management → MyTask Agent + Leave Agent + Email Agent
  [DEMO_INTENTIONS.LEAVE_VIEW_APPROVALS]: ['mytask', 'knowledge'],
  [DEMO_INTENTIONS.LEAVE_BULK_APPROVE]: ['mytask'],
  [DEMO_INTENTIONS.LEAVE_CHECK_CONFLICTS]: ['mytask', 'knowledge'],
  [DEMO_INTENTIONS.LEAVE_CHECK_POLICY]: ['knowledge'],
  [DEMO_INTENTIONS.LEAVE_TEAM_BALANCES]: ['leave', 'analytics'],
  [DEMO_INTENTIONS.LEAVE_DRAFT_EMAIL]: ['email'],

  // Task Management → MyTask Agent
  [DEMO_INTENTIONS.TASK_VIEW_ALL]: ['mytask'],
  [DEMO_INTENTIONS.TASK_VIEW_URGENT]: ['mytask'],

  // Work Request → WorkRequest Agent
  [DEMO_INTENTIONS.WORK_REQUEST_CREATE]: ['workrequest'],
  [DEMO_INTENTIONS.WORK_REQUEST_FOLLOW]: ['workrequest'],
  [DEMO_INTENTIONS.WORK_REQUEST_STATUS]: ['workrequest'],
  [DEMO_INTENTIONS.WORK_REQUEST_SEARCH]: ['workrequest'],
  
  // Requisition → Requisition Agent
  [DEMO_INTENTIONS.REQUISITION_CREATE]: ['requisition'],
  [DEMO_INTENTIONS.REQUISITION_SEARCH_PRODUCT]: ['requisition'],
  [DEMO_INTENTIONS.REQUISITION_ADD_ITEM]: ['requisition'],
  [DEMO_INTENTIONS.REQUISITION_DESK]: ['requisition', 'workrequest'],
  [DEMO_INTENTIONS.REQUISITION_VIEW_ALL]: ['requisition'],
  [DEMO_INTENTIONS.REQUISITION_VIEW_CONTRACTS]: ['requisition'],
  
  // Analytics → Analytics Agent
  [DEMO_INTENTIONS.ANALYTICS_TEAM_LEAVE]: ['analytics', 'leave'],
  [DEMO_INTENTIONS.ANALYTICS_VISUALIZATION]: ['analytics'],
  [DEMO_INTENTIONS.ANALYTICS_RAW_DATA]: ['analytics'],
  [DEMO_INTENTIONS.ANALYTICS_BUILDING_MAINTENANCE]: ['analytics', 'workrequest', 'finance'],
  
  // Recruitment → Recruitment Agent
  [DEMO_INTENTIONS.RECRUITMENT_VIEW_POSITIONS]: ['recruitment'],
  [DEMO_INTENTIONS.RECRUITMENT_VIEW_APPLICATIONS]: ['recruitment'],
  [DEMO_INTENTIONS.RECRUITMENT_APPLICATION_SUMMARY]: ['recruitment'],
  [DEMO_INTENTIONS.RECRUITMENT_MOVE_TO_INTERVIEW]: ['recruitment'],
  [DEMO_INTENTIONS.RECRUITMENT_CREATE_INTERVIEW_PACK]: ['recruitment'],
  
  // General
  [DEMO_INTENTIONS.GENERAL_INQUIRY]: ['orchestrator']
};

// DEPRECATED: Keywords are no longer used - we always use LLM for intention extraction
// Kept here for reference only of what phrases map to which intentions

module.exports = {
  DEMO_INTENTIONS,
  INTENTION_TO_AGENT
  // INTENTION_KEYWORDS removed - no longer used
};
