// UK Showcase Intentions
// Student Guide and Resident Guide

const DEMO_INTENTIONS = {
  // Student Guide Intentions - Aligned with Presenter Script
  STUDENT_ONBOARDING_APPOINTMENT: 'student_onboarding_appointment',
  STUDENT_ONBOARDING_TASKS: 'student_onboarding_tasks',
  STUDENT_ASSESSMENT_EXTENSION: 'student_assessment_extension',
  STUDENT_EXAM_PLANNER: 'student_exam_planner',

  // Resident Guide Intentions
  BIN_COLLECTION_QUERY: 'bin_collection_query',
  COMMUNITY_EVENTS_QUERY: 'community_events_query',
  REQUEST_MANAGEMENT: 'request_management',
  SPATIAL_QUERY: 'spatial_query',
  COUNCIL_TAX_QUERY: 'council_tax_query',
  PAYMENTS_QUERY: 'payments_query',

  // General
  GENERAL_INQUIRY: 'general_inquiry'
};

// Agent mapping for each intention
const INTENTION_TO_AGENT = {
  // Student Guide - SM Agent and KB Agent (4 specific use cases)
  [DEMO_INTENTIONS.STUDENT_ONBOARDING_APPOINTMENT]: ['StudentManagement'],
  [DEMO_INTENTIONS.STUDENT_ONBOARDING_TASKS]: ['StudentManagement'],
  [DEMO_INTENTIONS.STUDENT_ASSESSMENT_EXTENSION]: ['StudentManagement', 'Knowledge'],
  [DEMO_INTENTIONS.STUDENT_EXAM_PLANNER]: ['StudentManagement', 'Knowledge'],

  // Resident Guide - only the 5 resident agents
  [DEMO_INTENTIONS.BIN_COLLECTION_QUERY]: ['bincollections'],
  [DEMO_INTENTIONS.COMMUNITY_EVENTS_QUERY]: ['communityevents'],
  [DEMO_INTENTIONS.REQUEST_MANAGEMENT]: ['request'],
  [DEMO_INTENTIONS.SPATIAL_QUERY]: ['spatial', 'communityevents'],
  [DEMO_INTENTIONS.COUNCIL_TAX_QUERY]: ['taxtransactions', 'communityevents'],
  [DEMO_INTENTIONS.PAYMENTS_QUERY]: ['taxtransactions'],

  // General
  [DEMO_INTENTIONS.GENERAL_INQUIRY]: ['orchestrator']
};

module.exports = {
  DEMO_INTENTIONS,
  INTENTION_TO_AGENT
};
