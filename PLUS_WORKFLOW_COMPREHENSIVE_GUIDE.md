# Plus System: Comprehensive Workflow Guide

## 🎯 **What is Plus?**

Plus is an enterprise AI assistant system built by TechnologyOne, an Australian ERP software company. It's designed to help users complete tasks within enterprise resource planning (ERP) software environments through natural language conversations.

## 🏗️ **System Architecture Overview**

Plus consists of two main microservices:

1. **Plus Conversations Service** - Handles user interactions and AI orchestration
2. **Plus MCP Server** - Exposes business tools via Model Context Protocol (MCP)

## 🔄 **Complete Workflow: From User Request to Response**

### **Step 1: User Initiates Request**
```
User types: "Show me my pending tasks and create a work request for the server issue"
```

### **Step 2: Authentication & Context Setup**
```
Plus Conversations Service receives request with JWT token
├── Extracts user ID from JWT "sub" field
├── Extracts dataset (tenant) from JWT "dataset" field  
├── Extracts base URL from JWT "iss" field
└── Creates ConversationContext with user, dataset, conversation ID
```

### **Step 3: Orchestrator Agent Activation**
```
BedrockStrandsAgentProvider creates/retrieves OrchestratorAgent
├── OrchestratorAgent is the main coordinator
├── It has access to multiple sub-agents as tools
├── Each sub-agent represents a business domain
└── OrchestratorAgent decides which sub-agents to call
```

### **Step 4: Sub-Agent Creation & Tool Registration**
```
OrchestratorAgent creates specialized sub-agents:
├── MyTask Agent (task management)
├── WorkRequest Agent (work request creation)
├── Analytics Agent (data visualization)
├── Requisition Agent (purchase requisitions)
├── Recruitment Agent (HR recruitment)
├── Leave Agent (leave management)
├── WorkOrder Agent (work order details)
└── Knowledge Agent (knowledge base search)

Each sub-agent is registered as a callable tool for the orchestrator
```

### **Step 5: Sub-Agent Tool Execution**
```
OrchestratorAgent calls sub-agents as tools:
├── Calls "mytask" tool → MyTask Agent
├── Calls "workrequest" tool → WorkRequest Agent
└── Each sub-agent processes its part of the user request
```

### **Step 6: MCP Server Connection**
```
Each sub-agent connects to its MCP server endpoint:
├── MyTask Agent → /agent/mytask/v1/mcp/
├── WorkRequest Agent → /agent/workrequest/v1/mcp/
└── Each MCP server exposes domain-specific business tools
```

### **Step 7: Business Tool Execution**
```
Sub-agents call their business tools via MCP:
├── MyTask Agent calls:
│   ├── L_MYTASKS_MYTASK (list user's tasks)
│   └── G_MYTASK_DETAILS (get task details)
├── WorkRequest Agent calls:
│   ├── L_WORKREQUESTS_WORKREQUEST (search existing requests)
│   └── C_WORKREQUESTS_WORKREQUEST (create new request)
└── Each tool makes HTTP calls to internal business services
```

### **Step 8: Business Service Integration**
```
Business tools call internal services:
├── CIA Services (24 tools) - TechnologyOne's internal business services
├── DXP APIs (1 tool) - Direct API calls to business systems
└── External APIs (0 tools) - Third-party integrations (none currently)
```

### **Step 9: Response Processing**
```
Business services return data:
├── MCP servers transform responses to structured format
├── Sub-agents process and format responses
├── OrchestratorAgent combines responses from multiple sub-agents
└── Final response sent back to user
```

## 🤖 **Agent Hierarchy & Responsibilities**

### **OrchestratorAgent (Main Coordinator)**

#### **System Prompt Summary**
The OrchestratorAgent operates with these key principles:
- **Role**: Supportive AI assistant for ERP software environment
- **Communication**: Clear, professional language using UK English
- **Scope**: Only perform explicitly authorized actions, no legal/financial advice
- **Behavior**: Calm, conversational tone with proactive suggestions
- **Safety**: Require explicit confirmation for high-impact actions (>$1,000, >10 records, >5 people)
- **Error Handling**: Clear, non-technical error messages with actionable next steps
- **Memory**: Track up to 10 recent items per session, no long-term memory unless enabled
- **Tool Validation**: Check for `_SYS_REQ_DEF` tools first to get request structure

#### **Responsibilities**:
- Analyze user intent and determine which sub-agents to call
- Coordinate multi-agent workflows
- Combine responses from multiple sub-agents
- Maintain conversation context and state
- Provide system-wide prompts and guidelines

### **Sub-Agents (Domain Specialists)**

#### **1. MyTask Agent**
- **Purpose**: Task management and workflow processing
- **MCP Endpoint**: `/agent/mytask/v1/mcp/`
- **Service Type**: CIA Services
- **Use Cases**:
  - "Show me my pending tasks"
  - "What tasks do I need to approve today?"
  - "Process my leave request approvals"
  - "Get details for task #12345"

**Tools (4 CIA service tools)**:
1. **L_MYTASKS_MYTASK** - List all tasks assigned to user
   - Usage: Get complete task list with status, priority, deadlines
   - Returns: Task overview with classifications (Critical, Priority, Time-sensitive, General)

2. **G_MYTASK_DETAILS** - Get comprehensive workflow information
   - Usage: Retrieve detailed task context and priorities
   - Returns: Full task information including workflow details

3. **G_MYTASK_TASK_DECISION** - Retrieve available decision options
   - Usage: Get decision options for task approvals
   - Returns: Available decisions for task processing

4. **U_MYTASK_TASK_DECISION** - Process task approvals/decisions
   - Usage: Execute task decisions and bulk approvals
   - Returns: Confirmation of processed decisions

#### **2. WorkRequest Agent**
- **Purpose**: Work request management and creation
- **MCP Endpoint**: `/agent/workrequest/v1/mcp/`
- **Service Type**: CIA Services
- **Use Cases**:
  - "Create a work request for the server issue"
  - "Show me similar work requests"
  - "Follow work request #WR-2024-001"
  - "Search for existing work requests about database problems"

**Tools (7 CIA service tools)**:
1. **C_WORKREQUESTS_WORKREQUEST** - Create new work requests
   - Usage: Create work requests with validation and confirmation
   - Returns: Created work request details

2. **L_WORKREQUESTS_WORKREQUEST** - Search existing work requests
   - Usage: Find work requests by criteria, never guess numbers
   - Returns: List of matching work requests

3. **R_WORKREQUESTS_WORKREQUEST** - Read work request details
   - Usage: Display complete work request information
   - Returns: Full work request details in structured format

4. **U_WORKREQUESTS_WORKREQUEST** - Update existing work requests
   - Usage: Modify work request details and status
   - Returns: Updated work request information

5. **U_WORKREQUESTS_WORKREQUEST_FOLLOW** - Follow existing work requests
   - Usage: Link to similar requests instead of creating duplicates
   - Returns: Confirmation of following action

6. **L_WORKREQUESTS_WORKREQUEST_GETSUGGESTIONS** - Find similar work requests
   - Usage: Get suggestions before creating new requests
   - Returns: List of similar existing requests

7. **A_WORKREQUESTS_ATTACHMENT** - Attach files to work requests
   - Usage: Add attachments to work requests
   - Returns: Confirmation of attachment

#### **3. Analytics Agent**
- **Purpose**: Data visualization and analytical insights
- **MCP Endpoint**: `/agent/analytics/v1/mcp/`
- **Service Type**: CIA Services
- **Use Cases**:
  - "Show me top 10 accounts by balance"
  - "Create a chart of monthly sales trends"
  - "Analyze customer data for outliers"
  - "Get raw data for the revenue report"

**Tools (3 CIA service tools)**:
1. **G_ANALYTICS_GENERICENTITY** - Create visualizations from business data
   - Usage: Generate charts and visualizations with viewer URLs
   - Returns: Visualization with embedded iframe viewer
   - Process: Always calls raw data tool after visualization

2. **G_ANALYTICS_MODEL_LIST** - Get list of available analytics models
   - Usage: Find best match model for user queries
   - Returns: List of available data models

3. **G_ANALYTICS_GET_RAW_DATA** - Export raw data after visualizations
   - Usage: Get detailed data for analysis (mandatory after every visualization)
   - Returns: Raw data with outlier analysis (max 3 sentences)

#### **4. Requisition Agent**
- **Purpose**: Purchase requisition management
- **MCP Endpoint**: `/agent/requisition/v1/mcp/`
- **Service Type**: CIA Services
- **Use Cases**:
  - "Create a purchase requisition for office supplies"
  - "Search for laptops in the product catalog"
  - "Add items to my requisition"
  - "Get default purchasing codes"

**Tools (7 CIA service tools)**:
1. **L_REQUISITION_PRODUCT_SEARCH** - Search product catalog
   - Usage: Find items for purchase, never guess product codes
   - Returns: List of matching products

2. **A_REQUISITION_LINE** - Create requisition line items
   - Usage: Add products to requisitions with validation
   - Returns: Created requisition line details

3. **G_DEFAULT_SCM_CODE_VALUES** - Get default purchasing system codes
   - Usage: Retrieve purchasing system and location codes
   - Returns: Default system parameters

4. **G_REQUISITION** - Read requisition header details
   - Usage: Get requisition information for maintenance
   - Returns: Requisition header details

5. **L_REQUISITION_LINE** - List requisition line items
   - Usage: View requisition contents and line items
   - Returns: List of requisition lines

6. **L_REQUISITION_PRODUCT_SEARCH_LIST** - Advanced product search
   - Usage: Filter products by specific criteria
   - Returns: Filtered product list

7. **G_REQUISITION_LOCATION_DEFAULT** - Get default requisition location
   - Usage: Retrieve default location settings
   - Returns: Default location information

#### **5. Recruitment Agent**
- **Purpose**: HR recruitment and application management
- **MCP Endpoint**: `/agent/recruitment/v1/mcp/`
- **Service Type**: CIA Services
- **Use Cases**:
  - "Show me open job positions"
  - "List applications for the developer role"
  - "Move application to interview stage"
  - "Get interview questions for this job"

**Tools (5 CIA service tools)**:
1. **L_RECRUITMENT_JOB** - List available job positions
   - Usage: Get job requisitions, display title by default
   - Returns: List of available jobs

2. **L_RECRUITMENT_APPLICATION** - List job applications
   - Usage: Get applications for specific jobs, show name and stage
   - Returns: List of applications with key details

3. **L_RECRUITMENT_QUESTION** - Get recruitment questions
   - Usage: Retrieve interview questions for jobs
   - Returns: List of recruitment questions

4. **G_APPLICATION_NV_READ** - Read application natural view
   - Usage: Get detailed application information or summary
   - Returns: Application details or generated summary

5. **U_RECRUITMENT_ENTITY_TASK_PROCESS** - Process recruitment decisions
   - Usage: Move applications through workflow stages
   - Returns: Confirmation of workflow action
   - Actions: Phone interview, First interview, Not suitable, Withdraw

#### **6. Leave Agent**
- **Purpose**: Leave management and team analytics
- **MCP Endpoint**: `/agent/leave/v1/mcp/`
- **Service Type**: CIA Services
- **Use Cases**:
  - "Show me team leave balances"
  - "Generate leave liability report"
  - "Check team leave analytics"

**Tools (1 CIA service tool)**:
1. **L_LEAVE_TEAMLEAVE** - Get team leave balance data
   - Usage: Generate team leave balance visualization and liability reports
   - Returns: Team leave data with bar chart visualization and liability values
   - Process: Automatically shows leave liability, suggests email for high liability

#### **7. WorkOrder Agent**
- **Purpose**: Work order management and details
- **MCP Endpoint**: `/agent/workorder/v1/mcp/`
- **Service Type**: CIA Services
- **Use Cases**:
  - "Show me details for work order #WO-2024-001"
  - "Get work order status and information"

**Tools (1 CIA service tool)**:
1. **R_WORKORDERS_WORKORDER** - Read work order details
   - Usage: Get work order information when WorkSystemName and WorkOrderNumber are known
   - Returns: Work order details in structured format

#### **8. Knowledge Agent**
- **Purpose**: Employee knowledge base search
- **MCP Endpoint**: `/agent/knowledge/v1/mcp/`
- **Service Type**: DXP API
- **Use Cases**:
  - "Search for leave policy information"
  - "Find help articles about system shutdowns"
  - "Look up documentation for expense claims"

**Tools (1 DXP API tool)**:
1. **DXP_KNOWLEDGEBASE_SEARCH** - Search employee knowledge base
   - Usage: Find relevant documentation, help articles, and policies
   - Returns: Search results with content, descriptions, and relevance scores
   - Special Use: Automatically called for leave policy conflicts and shutdown periods

## 🔧 **Tool Categories & Service Integration**

### **CIA Services (24 tools)**
- **What**: TechnologyOne's internal business services
- **Authentication**: JWT token + API key
- **Headers**: Authorization, T1-Dataset, T1-Dataset-Host
- **Purpose**: Core business operations (tasks, requests, analytics, etc.)

### **DXP APIs (1 tool)**
- **What**: Direct API calls to business systems
- **Authentication**: JWT token + dataset headers
- **Headers**: T1-Dataset, T1-Dataset-Host
- **Purpose**: Knowledge base search

### **External APIs (0 tools)**
- **What**: Third-party integrations
- **Status**: None currently implemented
- **Purpose**: Future external service integrations


### **Context Propagation Flow**
```
User Request (JWT) 
    ↓
Plus Conversations (extract user, dataset, URL)
    ↓
OrchestratorAgent (pass context to sub-agents)
    ↓
Sub-Agents (pass context to MCP servers)
    ↓
MCP Servers (pass context to business services)
    ↓
Business Services (authenticated with user context)
```


## 📊 **Data Flow Example**

### **User Request**: "Show me my pending tasks and create a work request for the server issue"

#### **Step 1: Orchestrator Analysis**
```
OrchestratorAgent analyzes request:
├── "Show me my pending tasks" → Call MyTask Agent
└── "create a work request for the server issue" → Call WorkRequest Agent
```

#### **Step 2: MyTask Agent Execution**
```
MyTask Agent:
├── Calls L_MYTASKS_MYTASK tool
├── Tool makes HTTP call to CIA MyWorkflow service
├── Service returns user's pending tasks
├── Agent formats response with task details
└── Returns formatted task list to orchestrator
```

#### **Step 3: WorkRequest Agent Execution**
```
WorkRequest Agent:
├── Calls L_WORKREQUESTS_WORKREQUEST_GETSUGGESTIONS tool
├── Tool searches for similar work requests
├── Calls C_WORKREQUESTS_WORKREQUEST tool
├── Tool creates new work request via CIA WorkRequests service
├── Agent formats response with work request details
└── Returns formatted work request to orchestrator
```

#### **Step 4: Response Combination**
```
OrchestratorAgent:
├── Combines responses from MyTask and WorkRequest agents
├── Formats final response for user
├── Maintains conversation context for follow-up questions
└── Sends comprehensive response to user
```
