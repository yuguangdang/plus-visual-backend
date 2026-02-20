# ANZ Showcase Test Prompts

**Local Backend URL:** `http://localhost:8080`
**Deployed Backend URL:** `https://pygmtkd2jp.ap-southeast-2.awsapprunner.com`

---

## Scenario 1 - Leave Management Flow (PDF Scenarios 1-5)

### 1.1 - Critical Insight Card (View Leave Approvals)
**Prompt:** "I need to review the pending leave requests"
**Expected:** `leave_view_approvals` -> Agents: `[mytask, leave]`

```bash
# Local
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "I need to review the pending leave requests", "type": "user", "userId": "test-user"}]'

# Deployed
curl -X POST https://pygmtkd2jp.ap-southeast-2.awsapprunner.com/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "I need to review the pending leave requests", "type": "user", "userId": "test-user"}]'
```

**Alternative Prompts:**
- "Show me the leave requests that need approval"
- "What leave approvals are pending?"
- "Click on the critical insight for leave"

---

### 1.2 - Bulk Approve
**Prompt:** "Please approve them all"
**Expected:** `leave_bulk_approve` -> Agents: `[mytask]`

```bash
# Local
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Please approve them all", "type": "user", "userId": "test-user"}]'

# Deployed
curl -X POST https://pygmtkd2jp.ap-southeast-2.awsapprunner.com/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Please approve them all", "type": "user", "userId": "test-user"}]'
```

**Alternative Prompts:**
- "Approve all the pending leave requests"
- "Bulk approve everything"
- "Yes, approve them all"

---

### 1.3 - Check Conflicts
**Prompt:** "Actually, first check the team calendar for any conflicts"
**Expected:** `leave_check_conflicts` -> Agents: `[leave, knowledge]`

```bash
# Local
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Actually, first check the team calendar for any conflicts", "type": "user", "userId": "test-user"}]'

# Deployed
curl -X POST https://pygmtkd2jp.ap-southeast-2.awsapprunner.com/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Actually, first check the team calendar for any conflicts", "type": "user", "userId": "test-user"}]'
```

**Alternative Prompts:**
- "Are there any scheduling conflicts with these leave requests?"
- "Check for calendar clashes"
- "Will anyone overlap during their leave?"

---

### 1.4 - Check Policy
**Prompt:** "Check the leave requests against our leave policy"
**Expected:** `leave_check_policy` -> Agents: `[leave, knowledge]`

```bash
# Local
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Check the leave requests against our leave policy", "type": "user", "userId": "test-user"}]'

# Deployed
curl -X POST https://pygmtkd2jp.ap-southeast-2.awsapprunner.com/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Check the leave requests against our leave policy", "type": "user", "userId": "test-user"}]'
```

**Alternative Prompts:**
- "Are these requests compliant with company policy?"
- "Validate against our leave policy"
- "Any policy breaches in these requests?"

---

### 1.5 - Team Leave Balances (Chart)
**Prompt:** "Show me the team leave balances as a bar chart"
**Expected:** `leave_team_balances` -> Agents: `[analytics]`

```bash
# Local
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Show me the team leave balances as a bar chart", "type": "user", "userId": "test-user"}]'

# Deployed
curl -X POST https://pygmtkd2jp.ap-southeast-2.awsapprunner.com/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Show me the team leave balances as a bar chart", "type": "user", "userId": "test-user"}]'
```

**Alternative Prompts:**
- "Visualize the team leave balances"
- "Create a chart showing everyone's leave balance"
- "Show leave balance visualization"

---

### 1.6 - Draft Email About Leave
**Prompt:** "Generate an email to Jacqui asking her to take the remaining leave"
**Expected:** `leave_draft_email` -> Agents: `[email]`

```bash
# Local
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Generate an email to Jacqui asking her to take the remaining leave", "type": "user", "userId": "test-user"}]'

# Deployed
curl -X POST https://pygmtkd2jp.ap-southeast-2.awsapprunner.com/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Generate an email to Jacqui asking her to take the remaining leave", "type": "user", "userId": "test-user"}]'
```

**Alternative Prompts:**
- "Draft an email reminding her to use her leave"
- "Write an email about leave balance"
- "Send an email asking him to take his remaining annual leave"

---

## Scenario 2 - Recruitment Flow (PDF Scenarios 7-12)

### 2.1 - View Applications
**Prompt:** "Show me the applications on my open requisition"
**Expected:** `recruitment_view_applications` -> Agents: `[recruitment]`

```bash
# Local
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Show me the applications on my open requisition", "type": "user", "userId": "test-user"}]'

# Deployed
curl -X POST https://pygmtkd2jp.ap-southeast-2.awsapprunner.com/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Show me the applications on my open requisition", "type": "user", "userId": "test-user"}]'
```

**Alternative Prompts:**
- "Who has applied for the open position?"
- "View job applications"
- "Show recruitment data"

---

### 2.2 - Application Summary
**Prompt:** "Show me Sarah"
**Expected:** `recruitment_application_summary` -> Agents: `[recruitment]`

```bash
# Local
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Show me Sarah", "type": "user", "userId": "test-user"}]'

# Deployed
curl -X POST https://pygmtkd2jp.ap-southeast-2.awsapprunner.com/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Show me Sarah", "type": "user", "userId": "test-user"}]'
```

**Alternative Prompts:**
- "Tell me about Sarah's application"
- "Show candidate details for Sarah"
- "Give me an overview of the candidate"

---

### 2.3 - Compare Candidates
**Prompt:** "Compare Sarah to the other candidates"
**Expected:** `recruitment_compare_candidates` -> Agents: `[recruitment]`

```bash
# Local
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Compare Sarah to the other candidates", "type": "user", "userId": "test-user"}]'

# Deployed
curl -X POST https://pygmtkd2jp.ap-southeast-2.awsapprunner.com/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Compare Sarah to the other candidates", "type": "user", "userId": "test-user"}]'
```

**Alternative Prompts:**
- "How does Sarah compare to the others?"
- "Compare all candidates"
- "Show me a comparison of applicants"

---

### 2.4 - Move Stage / Mark Unsuitable
**Prompt:** "Move Sarah to the next stage and mark the others as unsuitable"
**Expected:** `recruitment_move_stage` -> Agents: `[recruitment, mytask]`

```bash
# Local
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Move Sarah to the next stage and mark the others as unsuitable", "type": "user", "userId": "test-user"}]'

# Deployed
curl -X POST https://pygmtkd2jp.ap-southeast-2.awsapprunner.com/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Move Sarah to the next stage and mark the others as unsuitable", "type": "user", "userId": "test-user"}]'
```

**Alternative Prompts:**
- "Advance Sarah to interview stage"
- "Shortlist Sarah and reject the rest"
- "Move candidate to next stage"

---

### 2.5 - Interview Questions
**Prompt:** "Generate interview questions for Sarah"
**Expected:** `recruitment_interview_questions` -> Agents: `[recruitment]`

```bash
# Local
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Generate interview questions for Sarah", "type": "user", "userId": "test-user"}]'

# Deployed
curl -X POST https://pygmtkd2jp.ap-southeast-2.awsapprunner.com/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Generate interview questions for Sarah", "type": "user", "userId": "test-user"}]'
```

**Alternative Prompts:**
- "Create an interview pack for Sarah"
- "What questions should I ask in the interview?"
- "Prepare interview preparation materials"

---

### 2.6 - Email Interview Pack
**Prompt:** "Email that to me"
**Expected:** `general_email` -> Agents: `[email]`

```bash
# Local
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Email that to me", "type": "user", "userId": "test-user"}]'

# Deployed
curl -X POST https://pygmtkd2jp.ap-southeast-2.awsapprunner.com/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Email that to me", "type": "user", "userId": "test-user"}]'
```

**Alternative Prompts:**
- "Send that via email"
- "Email this to me"
- "Send me an email with that"

---

## Scenario 3 - Work Request Flow (Additional)

### 3.1 - Create Work Request
**Prompt:** "There's a hole in the wall in meeting room 3, can you report it?"
**Expected:** `work_request_create` -> Agents: `[workrequest]`

```bash
# Local
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "There is a hole in the wall in meeting room 3, can you report it?", "type": "user", "userId": "test-user"}]'

# Deployed
curl -X POST https://pygmtkd2jp.ap-southeast-2.awsapprunner.com/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "There is a hole in the wall in meeting room 3, can you report it?", "type": "user", "userId": "test-user"}]'
```

**Alternative Prompts:**
- "Create a maintenance request for the broken AC"
- "Something is broken in my office"
- "Report an issue with the carpet"

---

### 3.2 - Work Request Status
**Prompt:** "What's the status of my work request?"
**Expected:** `work_request_status` -> Agents: `[workrequest]`

```bash
# Local
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "What is the status of my work request?", "type": "user", "userId": "test-user"}]'

# Deployed
curl -X POST https://pygmtkd2jp.ap-southeast-2.awsapprunner.com/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "What is the status of my work request?", "type": "user", "userId": "test-user"}]'
```

**Alternative Prompts:**
- "Check status of my maintenance request"
- "How is my request progressing?"
- "Any update on the repair?"

---

## Scenario 4 - Requisition Flow (Additional)

### 4.1 - Order a Desk
**Prompt:** "I need to order a new standing desk"
**Expected:** `requisition_desk` -> Agents: `[requisition, workrequest]`

```bash
# Local
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "I need to order a new standing desk", "type": "user", "userId": "test-user"}]'

# Deployed
curl -X POST https://pygmtkd2jp.ap-southeast-2.awsapprunner.com/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "I need to order a new standing desk", "type": "user", "userId": "test-user"}]'
```

**Alternative Prompts:**
- "Requisition a desk replacement"
- "Order new desk furniture"
- "I need a new desk"

---

### 4.2 - Search Product Catalog
**Prompt:** "Search the product catalog for ergonomic chairs"
**Expected:** `requisition_search_product` -> Agents: `[requisition]`

```bash
# Local
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Search the product catalog for ergonomic chairs", "type": "user", "userId": "test-user"}]'

# Deployed
curl -X POST https://pygmtkd2jp.ap-southeast-2.awsapprunner.com/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Search the product catalog for ergonomic chairs", "type": "user", "userId": "test-user"}]'
```

**Alternative Prompts:**
- "Browse products in the catalogue"
- "Find products matching office supplies"
- "Search for monitors in requisition"

---

## Scenario 5 - Finance Flow (Additional)

### 5.1 - View Budget
**Prompt:** "Show me the current budget status for my department"
**Expected:** `finance_view_budget` -> Agents: `[finance]`

```bash
# Local
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Show me the current budget status for my department", "type": "user", "userId": "test-user"}]'

# Deployed
curl -X POST https://pygmtkd2jp.ap-southeast-2.awsapprunner.com/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Show me the current budget status for my department", "type": "user", "userId": "test-user"}]'
```

**Alternative Prompts:**
- "What's our budget overview?"
- "Show budget information"
- "How much budget do we have left?"

---

### 5.2 - Check Expenses
**Prompt:** "Show me our expenses for this quarter"
**Expected:** `finance_check_expenses` -> Agents: `[finance]`

```bash
# Local
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Show me our expenses for this quarter", "type": "user", "userId": "test-user"}]'

# Deployed
curl -X POST https://pygmtkd2jp.ap-southeast-2.awsapprunner.com/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Show me our expenses for this quarter", "type": "user", "userId": "test-user"}]'
```

**Alternative Prompts:**
- "Generate an expense report"
- "What have we spent this month?"
- "Check our spending"

---

### 5.3 - Analyze Costs
**Prompt:** "Analyze our cost trends over the last 6 months"
**Expected:** `finance_analyze_costs` -> Agents: `[finance, analytics]`

```bash
# Local
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Analyze our cost trends over the last 6 months", "type": "user", "userId": "test-user"}]'

# Deployed
curl -X POST https://pygmtkd2jp.ap-southeast-2.awsapprunner.com/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Analyze our cost trends over the last 6 months", "type": "user", "userId": "test-user"}]'
```

**Alternative Prompts:**
- "Show financial trends"
- "Cost analysis for Q1"
- "What are our spending patterns?"

---

## Scenario 6 - Analytics Flow (Additional)

### 6.1 - Create Visualization
**Prompt:** "Create a chart showing monthly expenses"
**Expected:** `analytics_visualization` -> Agents: `[analytics]`

```bash
# Local
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Create a chart showing monthly expenses", "type": "user", "userId": "test-user"}]'

# Deployed
curl -X POST https://pygmtkd2jp.ap-southeast-2.awsapprunner.com/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Create a chart showing monthly expenses", "type": "user", "userId": "test-user"}]'
```

**Alternative Prompts:**
- "Visualize the data"
- "Show me a graph"
- "Create a data model visualization"

---

### 6.2 - Export Raw Data
**Prompt:** "Export the raw data for this report"
**Expected:** `analytics_raw_data` -> Agents: `[analytics]`

```bash
# Local
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Export the raw data for this report", "type": "user", "userId": "test-user"}]'

# Deployed
curl -X POST https://pygmtkd2jp.ap-southeast-2.awsapprunner.com/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Export the raw data for this report", "type": "user", "userId": "test-user"}]'
```

**Alternative Prompts:**
- "Download the data"
- "Get me the raw data"
- "Export to CSV"

---

## Quick Reference - Intention to Agent Mapping

| Intention | Agents |
|-----------|--------|
| `leave_view_approvals` | mytask, leave |
| `leave_bulk_approve` | mytask |
| `leave_check_conflicts` | leave, knowledge |
| `leave_check_policy` | leave, knowledge |
| `leave_team_balances` | analytics |
| `leave_draft_email` | email |
| `recruitment_view_positions` | recruitment |
| `recruitment_view_applications` | recruitment |
| `recruitment_application_summary` | recruitment |
| `recruitment_compare_candidates` | recruitment |
| `recruitment_move_stage` | recruitment, mytask |
| `recruitment_interview_questions` | recruitment |
| `general_email` | email |
| `work_request_create` | workrequest |
| `work_request_follow` | workrequest |
| `work_request_status` | workrequest |
| `work_request_search` | workrequest |
| `requisition_create` | requisition |
| `requisition_search_product` | requisition |
| `requisition_add_item` | requisition |
| `requisition_desk` | requisition, workrequest |
| `analytics_team_leave` | analytics |
| `analytics_visualization` | analytics |
| `analytics_raw_data` | analytics |
| `finance_view_budget` | finance |
| `finance_check_expenses` | finance |
| `finance_analyze_costs` | finance, analytics |
| `general_inquiry` | orchestrator |
