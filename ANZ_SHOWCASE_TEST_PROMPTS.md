# ANZ Showcase Test Prompts

**Based on:** ANZ Showcase Prompts.pdf (dated 21/02/2026)
**Local Backend URL:** `http://localhost:8080`
**Deployed Backend URL:** `https://pygmtkd2jp.ap-southeast-2.awsapprunner.com`

---

## Scenario 1 - Leave Management Flow (PDF Rows 1-5)

### Row 1 - Critical Tasks Insight Card
**Prompt:** `Show me my critical tasks. Insight userId: CCARTER insightId: CRITICALTASKSDEMO identifierType: U identifierValue: CCARTER enablementInstanceNumber: 1`
**Expected:** `leave_view_approvals` -> Agents: `[mytask, leave]`
**PDF Agent:** My Tasks Agent and App Builder + Leave and Leave Management

```bash
# Local
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Show me my critical tasks. Insight userId: CCARTER insightId: CRITICALTASKSDEMO identifierType: U identifierValue: CCARTER enablementInstanceNumber: 1", "type": "user", "userId": "test-user"}]'

# Deployed
curl -X POST https://pygmtkd2jp.ap-southeast-2.awsapprunner.com/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Show me my critical tasks. Insight userId: CCARTER insightId: CRITICALTASKSDEMO identifierType: U identifierValue: CCARTER enablementInstanceNumber: 1", "type": "user", "userId": "test-user"}]'
```

---

### Row 2 - Check Leave Policy
**Prompt:** `Check the leave requests against our leave policy`
**Expected:** `leave_check_policy` -> Agents: `[leave, knowledge]`
**PDF Agent:** Leave and Leave Management + Knowledge and LG,SM, Employee

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

---

### Row 3 - Bulk Approve
**Prompt:** `Approve them all`
**Expected:** `leave_bulk_approve` -> Agents: `[mytask]`
**PDF Agent:** My Tasks Agent and App Builder

```bash
# Local
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Approve them all", "type": "user", "userId": "test-user"}]'

# Deployed
curl -X POST https://pygmtkd2jp.ap-southeast-2.awsapprunner.com/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Approve them all", "type": "user", "userId": "test-user"}]'
```

---

### Row 4 - Team Leave Balances Chart
**Prompt:** `Show me my teams leave balances in a bar chart`
**Expected:** `leave_team_balances` -> Agents: `[analytics]`
**PDF Agent:** Analytics and Corporate Performance

```bash
# Local
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Show me my teams leave balances in a bar chart", "type": "user", "userId": "test-user"}]'

# Deployed
curl -X POST https://pygmtkd2jp.ap-southeast-2.awsapprunner.com/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Show me my teams leave balances in a bar chart", "type": "user", "userId": "test-user"}]'
```

---

### Row 5 - Draft Email About Leave
**Prompt:** `Generate an email to Jacqui asking her to take some leave`
**Expected:** `leave_draft_email` -> Agents: `[email]`
**PDF Agent:** Email and Email System

```bash
# Local
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Generate an email to Jacqui asking her to take some leave", "type": "user", "userId": "test-user"}]'

# Deployed
curl -X POST https://pygmtkd2jp.ap-southeast-2.awsapprunner.com/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Generate an email to Jacqui asking her to take some leave", "type": "user", "userId": "test-user"}]'
```

---

## Scenario 2 - Recruitment Flow (PDF Rows 7-12)

### Row 7 - Open Requisitions Insight Card
**Prompt:** `Show me my open requisitions for my applications. Insight userId: CCARTER insightId: OPENREQUISITIONSFORMYAPPLICATIONS identifierType: U identifierValue: CCARTER enablementInstanceNumber: 1`
**Expected:** `recruitment_view_applications` -> Agents: `[recruitment]`
**PDF Agent:** Recruitment and HR & Payroll

```bash
# Local
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Show me my open requisitions for my applications. Insight userId: CCARTER insightId: OPENREQUISITIONSFORMYAPPLICATIONS identifierType: U identifierValue: CCARTER enablementInstanceNumber: 1", "type": "user", "userId": "test-user"}]'

# Deployed
curl -X POST https://pygmtkd2jp.ap-southeast-2.awsapprunner.com/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Show me my open requisitions for my applications. Insight userId: CCARTER insightId: OPENREQUISITIONSFORMYAPPLICATIONS identifierType: U identifierValue: CCARTER enablementInstanceNumber: 1", "type": "user", "userId": "test-user"}]'
```

---

### Row 8 - Show Candidate
**Prompt:** `Show me Sarah`
**Expected:** `recruitment_application_summary` -> Agents: `[recruitment]`
**PDF Agent:** Recruitment and HR & Payroll

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

---

### Row 9 - Compare Candidates
**Prompt:** `Compare sarah to the other candidates`
**Expected:** `recruitment_compare_candidates` -> Agents: `[recruitment]`
**PDF Agent:** Recruitment and HR & Payroll

```bash
# Local
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Compare sarah to the other candidates", "type": "user", "userId": "test-user"}]'

# Deployed
curl -X POST https://pygmtkd2jp.ap-southeast-2.awsapprunner.com/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Compare sarah to the other candidates", "type": "user", "userId": "test-user"}]'
```

---

### Row 10 - Move Stage / Mark Unsuitable
**Prompt:** `Move Sarah to the next stage and the others to unsuitable`
**Expected:** `recruitment_move_stage` -> Agents: `[recruitment, mytask]`
**PDF Agent:** Recruitment and HR & Payroll + My Task and App Builder

```bash
# Local
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Move Sarah to the next stage and the others to unsuitable", "type": "user", "userId": "test-user"}]'

# Deployed
curl -X POST https://pygmtkd2jp.ap-southeast-2.awsapprunner.com/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Move Sarah to the next stage and the others to unsuitable", "type": "user", "userId": "test-user"}]'
```

---

### Row 11 - Generate Interview Questions
**Prompt:** `Generate some interview questions for Sarah`
**Expected:** `recruitment_interview_questions` -> Agents: `[recruitment]`
**PDF Agent:** Recruitment and HR & Payroll

```bash
# Local
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Generate some interview questions for Sarah", "type": "user", "userId": "test-user"}]'

# Deployed
curl -X POST https://pygmtkd2jp.ap-southeast-2.awsapprunner.com/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Generate some interview questions for Sarah", "type": "user", "userId": "test-user"}]'
```

---

### Row 12 - Email Interview Pack
**Prompt:** `Email that to me`
**Expected:** `general_email` -> Agents: `[email]`
**PDF Agent:** Email agent and system

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

---

## Additional Test Scenarios (Non-PDF Agents)

These scenarios test agents not covered in the PDF demo but available in ANZ Showcase.

### Work Request

**Create Work Request:**
```bash
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "There is a hole in the wall in meeting room 3, can you report it?", "type": "user", "userId": "test-user"}]'
```
Expected: `work_request_create` -> Agents: `[workrequest]`

**Work Request Status:**
```bash
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "What is the status of my work request?", "type": "user", "userId": "test-user"}]'
```
Expected: `work_request_status` -> Agents: `[workrequest]`

---

### Requisition

**Order a Desk:**
```bash
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "I need to order a new standing desk", "type": "user", "userId": "test-user"}]'
```
Expected: `requisition_desk` -> Agents: `[requisition, workrequest]`

**Search Product Catalog:**
```bash
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Search the product catalog for ergonomic chairs", "type": "user", "userId": "test-user"}]'
```
Expected: `requisition_search_product` -> Agents: `[requisition]`

---

### Finance

**View Budget:**
```bash
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Show me the current budget status for my department", "type": "user", "userId": "test-user"}]'
```
Expected: `finance_view_budget` -> Agents: `[finance]`

**Analyze Costs:**
```bash
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Analyze our cost trends over the last 6 months", "type": "user", "userId": "test-user"}]'
```
Expected: `finance_analyze_costs` -> Agents: `[finance, analytics]`

---

### Analytics

**Create Visualization:**
```bash
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Create a chart showing monthly expenses", "type": "user", "userId": "test-user"}]'
```
Expected: `analytics_visualization` -> Agents: `[analytics]`

**Export Raw Data:**
```bash
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"content": "Export the raw data for this report", "type": "user", "userId": "test-user"}]'
```
Expected: `analytics_raw_data` -> Agents: `[analytics]`

---

## Quick Reference - PDF Prompts and Agent Mapping

| Row | Prompt | Intention | Agents |
|-----|--------|-----------|--------|
| 1 | Show me my critical tasks. Insight userId: CCARTER... | `leave_view_approvals` | mytask, leave |
| 2 | Check the leave requests against our leave policy | `leave_check_policy` | leave, knowledge |
| 3 | Approve them all | `leave_bulk_approve` | mytask |
| 4 | Show me my teams leave balances in a bar chart | `leave_team_balances` | analytics |
| 5 | Generate an email to Jacqui asking her to take some leave | `leave_draft_email` | email |
| 7 | Show me my open requisitions for my applications. Insight userId: CCARTER... | `recruitment_view_applications` | recruitment |
| 8 | Show me Sarah | `recruitment_application_summary` | recruitment |
| 9 | Compare sarah to the other candidates | `recruitment_compare_candidates` | recruitment |
| 10 | Move Sarah to the next stage and the others to unsuitable | `recruitment_move_stage` | recruitment, mytask |
| 11 | Generate some interview questions for Sarah | `recruitment_interview_questions` | recruitment |
| 12 | Email that to me | `general_email` | email |

---

## Running Automated Tests

```bash
# Test against local backend
node tests/test-anz-intentions.js

# Test against deployed backend
node tests/test-anz-intentions.js --deployed
```
