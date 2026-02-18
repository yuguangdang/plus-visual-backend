// UK Showcase Intentions
// Student Guide and Resident Guide

const DEMO_INTENTIONS = {
  // Student Guide Intentions - Aligned with UK Showcase Prompts(STU).csv
  // Scenario A - Onboarding Tasks
  STUDENT_ONBOARDING_TASKS: 'student_onboarding_tasks',
  STUDENT_ONBOARDING_CONFIRM: 'student_onboarding_confirm',
  // Scenario B - Assessment Extension
  STUDENT_ASSESSMENT_EXTENSION: 'student_assessment_extension',
  STUDENT_EXTENSION_REASON: 'student_extension_reason',
  STUDENT_EXTENSION_DURATION: 'student_extension_duration',
  // Scenario C - Exam Time Planning
  STUDENT_EXAM_PLANNER: 'student_exam_planner',
  STUDENT_STUDY_PREFERENCES: 'student_study_preferences',

  // Resident Guide Intentions - Aligned with Presenter Spreadsheet
  // Scenario A - Property Inquiry
  PROPERTY_INQUIRY: 'property_inquiry',
  PROPERTY_DETAILS: 'property_details',

  // Scenario B - Waste Disposal / Bulky Waste
  WASTE_DISPOSAL_INQUIRY: 'waste_disposal_inquiry',
  BULKY_WASTE_BOOKING: 'bulky_waste_booking',

  // Scenario C - Council Tax / Hardship
  HARDSHIP_INQUIRY: 'hardship_inquiry',
  HARDSHIP_APPLICATION: 'hardship_application',
  DOCUMENT_SUBMISSION: 'document_submission',
  REQUEST_CONFIRMATION: 'request_confirmation',
  COUNCIL_TAX_VIEW: 'council_tax_view',
  PAYMENT_REDIRECT: 'payment_redirect',

  // Scenario D - Infrastructure Report (Pothole)
  INFRASTRUCTURE_REPORT: 'infrastructure_report',
  REQUEST_DETAILS: 'request_details',
  REQUEST_WITH_ATTACHMENT: 'request_with_attachment',

  // General
  GENERAL_INQUIRY: 'general_inquiry'
};

// Semantic descriptions for each intention to guide LLM classification
const INTENTION_DESCRIPTIONS = {
  // Student Guide - Scenario A (Onboarding)
  'student_onboarding_tasks': 'Student asking to create onboarding tasks, setup their course, or get help with initial enrollment. First message about onboarding.',
  'student_onboarding_confirm': 'Student confirming, modifying, or accepting onboarding tasks that were already presented. Use when student says tasks "look good" or adds/removes specific tasks.',

  // Student Guide - Scenario B (Assessment Extension)
  'student_assessment_extension': 'Student requesting help with an assignment deadline, saying they cannot finish on time, or asking about extensions. Initial request for extension.',
  'student_extension_reason': 'Student providing the reason why they need an extension (e.g., "I was busy with work", illness, personal reasons). Use after extension request.',
  'student_extension_duration': 'Student specifying how long they want the extension to be (e.g., "5 working days", "one week"). Use when student provides duration.',

  // Student Guide - Scenario C (Exam Planning)
  'student_exam_planner': 'Student asking to create a revision plan, study plan, or help preparing for upcoming exams. Initial request for exam planning.',
  'student_study_preferences': 'Student providing study preferences such as subjects to focus on, study times, session duration, or schedule preferences (e.g., "Monday to Friday, 9-11am").',

  // Resident Guide - Scenario A (Property)
  'property_inquiry': 'User asking about a property, neighborhood, or what it is like to live somewhere',
  'property_details': 'User requesting specific property details like flood risk, council tax, schools after initial inquiry',

  // Scenario B - Waste Disposal
  'waste_disposal_inquiry': 'User asking how to dispose of an item, what can be recycled, or waste-related questions',
  'bulky_waste_booking': 'User confirms, schedules, provides dates, or agrees to book a bulky waste collection. Use for ANY confirmation or booking details during waste disposal conversation.',

  // Scenario C - Council Tax / Hardship
  'hardship_inquiry': 'User asking about hardship allowance, financial support, or council tax relief programs',
  'hardship_application': 'User explicitly wants to apply for hardship allowance (e.g., "Yes apply", "I want to apply")',
  'document_submission': 'User provides their circumstances, situation details, or supporting information for a hardship application. Use when user describes why they need hardship support.',
  'request_confirmation': 'Generic final confirmation only when no specific service context applies. Do NOT use if conversation involves waste booking, hardship application, or infrastructure reports.',
  'council_tax_view': 'User wants to see their council tax balance, account, or payment history',
  'payment_redirect': 'User wants to pay now or make a payment',

  // Scenario D - Infrastructure
  'infrastructure_report': 'User initially reporting a pothole, road defect, or infrastructure issue',
  'request_details': 'User providing additional details about severity, hazard level, or impact of an infrastructure issue they already reported',
  'request_with_attachment': 'User confirms submission of an infrastructure report that includes a photo or attachment. Use for final confirmation in pothole/infrastructure reporting flow.',

  // General
  'general_inquiry': 'Fallback for general questions that do not fit other categories'
};

// Agent mapping for each intention
const INTENTION_TO_AGENT = {
  // Student Guide - 6 Agents: StudentManagement, LMS, Knowledge, Tasks, StudyPlanner, CourseLoop
  // Scenario A - Onboarding Tasks
  [DEMO_INTENTIONS.STUDENT_ONBOARDING_TASKS]: ['StudentManagement', 'LMS', 'Tasks'],
  [DEMO_INTENTIONS.STUDENT_ONBOARDING_CONFIRM]: ['Tasks'],
  // Scenario B - Assessment Extension
  [DEMO_INTENTIONS.STUDENT_ASSESSMENT_EXTENSION]: ['StudentManagement', 'LMS', 'Knowledge', 'Tasks'],
  [DEMO_INTENTIONS.STUDENT_EXTENSION_REASON]: ['StudentManagement', 'LMS', 'Knowledge', 'Tasks'],
  [DEMO_INTENTIONS.STUDENT_EXTENSION_DURATION]: ['StudentManagement', 'LMS', 'Knowledge', 'Tasks'],
  // Scenario C - Exam Time Planning
  [DEMO_INTENTIONS.STUDENT_EXAM_PLANNER]: ['StudentManagement', 'LMS', 'CourseLoop', 'StudyPlanner'],
  [DEMO_INTENTIONS.STUDENT_STUDY_PREFERENCES]: ['CourseLoop', 'StudyPlanner'],

  // Resident Guide - Aligned with Presenter Spreadsheet
  // Scenario A - Property Inquiry (Guest)
  // Sub-Agents: Knowledge, Spatial Maps, Third Party
  // ERP: Knowledge Base Search, Spatial | Third Party: Websites
  [DEMO_INTENTIONS.PROPERTY_INQUIRY]: ['knowledge', 'spatial', 'webagent'],
  [DEMO_INTENTIONS.PROPERTY_DETAILS]: ['knowledge', 'spatial', 'webagent'],

  // Scenario B - Waste Disposal / Bulky Waste (Registered)
  // B.2: Knowledge, Content Ingestion | ERP: Knowledge Base Search, Attachment Grid (ECM)
  [DEMO_INTENTIONS.WASTE_DISPOSAL_INQUIRY]: ['knowledge', 'ecm'],
  // B.3, B.4: Requests, Third Party | ERP: Request Management | Third Party: Waste System
  [DEMO_INTENTIONS.BULKY_WASTE_BOOKING]: ['request', 'bincollections'],

  // Scenario C - Council Tax / Hardship (Registered)
  // C.1: Knowledge, Third Party | ERP: Knowledge Base Search | Third Party: Websites
  [DEMO_INTENTIONS.HARDSHIP_INQUIRY]: ['knowledge', 'webagent'],
  // C.2: Requests, Third Party | ERP: Request Management | Third Party: Revs & Bens
  [DEMO_INTENTIONS.HARDSHIP_APPLICATION]: ['request', 'taxtransactions'],
  // C.3: Content Ingestion, Request | ERP: Attachment Grid (ECM), Request Management
  [DEMO_INTENTIONS.DOCUMENT_SUBMISSION]: ['ecm', 'request'],
  // C.4: Requests | ERP: Request Management
  [DEMO_INTENTIONS.REQUEST_CONFIRMATION]: ['request'],
  // C.6: 3rd party | Third Party: Revs & Bens
  [DEMO_INTENTIONS.COUNCIL_TAX_VIEW]: ['taxtransactions'],
  // C.7: Payment portal | Third Party: Revs & Bens
  [DEMO_INTENTIONS.PAYMENT_REDIRECT]: ['taxtransactions'],

  // Scenario D - Infrastructure Report / Pothole (Guest)
  // D.1: Knowledge, Content Ingestion, Request | ERP: Knowledge Base Search, Attachment Grid (ECM), Request Management
  [DEMO_INTENTIONS.INFRASTRUCTURE_REPORT]: ['knowledge', 'ecm', 'request'],
  // D.2: Request | ERP: Request Management
  [DEMO_INTENTIONS.REQUEST_DETAILS]: ['request'],
  // D.3: Request | ERP: Request Management, ECM
  [DEMO_INTENTIONS.REQUEST_WITH_ATTACHMENT]: ['request', 'ecm'],

  // General
  [DEMO_INTENTIONS.GENERAL_INQUIRY]: ['orchestrator']
};

module.exports = {
  DEMO_INTENTIONS,
  INTENTION_DESCRIPTIONS,
  INTENTION_TO_AGENT
};
