# Student Guide Test Prompts for Plus UI

Use these prompts in sequence to test each scenario. Wait for the assistant response before sending the next prompt.

**Local Backend URL:** `http://localhost:8080`
**Deployed Backend URL:** `https://w2dpn8shpq.ap-southeast-2.awsapprunner.com`

---

## Scenario A - Onboarding Tasks (Logged-in Student)

Quinn is brand new and has never used Plus before. Upon logging for the first time she gets a warm welcome message and a recommendation card asking if she would like help onboarding.

### A.1 - Create Onboarding Tasks
```
Create onboarding tasks
```
**Expected:** `student_onboarding_tasks` → Agents: StudentManagement, LMS, Tasks

**curl (local):**
```bash
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"type":"user","content":"Create onboarding tasks","userId":"test-student","guide":"student"}]'
```

### A.2 - Confirm Tasks with Modification
```
I also want to get a job so add a task for that but the other tasks look good
```
**Expected:** `student_onboarding_confirm` → Agents: Tasks

**curl (local):**
```bash
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"type":"user","content":"Create onboarding tasks","userId":"test-student","guide":"student"},{"type":"assistant","content":"I have created onboarding tasks for you including: 1. Review course materials 2. Complete enrollment forms 3. Set up student portal. Would you like to modify these?","userId":"test-student","guide":"student"},{"type":"user","content":"I also want to get a job so add a task for that but the other tasks look good","userId":"test-student","guide":"student"}]'
```

---

## Scenario B - Assessment Extension (Logged-in Student)

Quinn is now well into term. She has a lot happening and although she is generally organised, one of her assignments has fallen behind because she has been unwell.

### B.1 - Initial Extension Request
```
Help. I'm not going to finish my assignment on time.
```
**Expected:** `student_assessment_extension` → Agents: StudentManagement, LMS, Knowledge, Tasks

**curl (local):**
```bash
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"type":"user","content":"Help. I am not going to finish my assignment on time.","userId":"test-student","guide":"student"}]'
```

### B.2 - Confirm Assessment
```
Yes, the Marketing 101 assignment
```
**Expected:** `student_assessment_extension` → Agents: StudentManagement, LMS, Knowledge, Tasks

**curl (local):**
```bash
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"type":"user","content":"Help. I am not going to finish my assignment on time.","userId":"test-student","guide":"student"},{"type":"assistant","content":"I can see you have several upcoming assessments. Which one do you need help with? 1. Marketing 101 - Due March 5 2. Statistics - Due March 10 3. Economics Essay - Due March 15","userId":"test-student","guide":"student"},{"type":"user","content":"Yes, the Marketing 101 assignment","userId":"test-student","guide":"student"}]'
```

### B.3 - Provide Reason
```
I was busy with work
```
**Expected:** `student_extension_reason` → Agents: StudentManagement, LMS, Knowledge, Tasks

**curl (local):**
```bash
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"type":"user","content":"Help. I am not going to finish my assignment on time.","userId":"test-student","guide":"student"},{"type":"assistant","content":"Which assignment do you need help with?","userId":"test-student","guide":"student"},{"type":"user","content":"Yes, the Marketing 101 assignment","userId":"test-student","guide":"student"},{"type":"assistant","content":"I found the extension policy for Marketing 101. To apply, I need to know the reason for your extension request.","userId":"test-student","guide":"student"},{"type":"user","content":"I was busy with work","userId":"test-student","guide":"student"}]'
```

### B.4 - Request Duration
```
5 working days
```
**Expected:** `student_extension_duration` → Agents: StudentManagement, LMS, Knowledge, Tasks

**curl (local):**
```bash
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"type":"user","content":"Help. I am not going to finish my assignment on time.","userId":"test-student","guide":"student"},{"type":"assistant","content":"Which assignment?","userId":"test-student","guide":"student"},{"type":"user","content":"Marketing 101","userId":"test-student","guide":"student"},{"type":"assistant","content":"What is the reason for your extension request?","userId":"test-student","guide":"student"},{"type":"user","content":"I was busy with work","userId":"test-student","guide":"student"},{"type":"assistant","content":"Thanks. How long would you like the extension to be?","userId":"test-student","guide":"student"},{"type":"user","content":"5 working days","userId":"test-student","guide":"student"}]'
```

---

## Scenario C - Exam Time Planning (Logged-in Student)

Quinn is now nearing the end of term and has exams coming up. She has indicated that she is not good with planning for exams and would like some help.

### C.1 - Create Revision Plan
```
Create a revision plan for upcoming exams
```
**Expected:** `student_exam_planner` → Agents: StudentManagement, LMS, CourseLoop, StudyPlanner

**curl (local):**
```bash
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"type":"user","content":"Create a revision plan for upcoming exams","userId":"test-student","guide":"student"}]'
```

### C.2 - Study Preferences (Subjects)
```
I don't need help to study physics and the topics suggested look great
```
**Expected:** `student_study_preferences` → Agents: CourseLoop, StudyPlanner

**curl (local):**
```bash
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"type":"user","content":"Create a revision plan for upcoming exams","userId":"test-student","guide":"student"},{"type":"assistant","content":"Based on your upcoming exams, I suggest focusing on: Physics, Mathematics, and Chemistry. I have created suggested study topics for each. Would you like to adjust any subjects?","userId":"test-student","guide":"student"},{"type":"user","content":"I do not need help to study physics and the topics suggested look great","userId":"test-student","guide":"student"}]'
```

### C.3 - Study Preferences (Schedule)
```
Monday to Friday, 9-11am, 60min Sessions
```
**Expected:** `student_study_preferences` → Agents: CourseLoop, StudyPlanner

**curl (local):**
```bash
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"type":"user","content":"Create a revision plan for upcoming exams","userId":"test-student","guide":"student"},{"type":"assistant","content":"I have your subjects ready. When do you prefer to study?","userId":"test-student","guide":"student"},{"type":"user","content":"I do not need help to study physics","userId":"test-student","guide":"student"},{"type":"assistant","content":"Great! How would you like to schedule your study sessions?","userId":"test-student","guide":"student"},{"type":"user","content":"Monday to Friday, 9-11am, 60min Sessions","userId":"test-student","guide":"student"}]'
```

---

## Tips

1. **Start a new conversation** for each scenario (A, B, C) to clear context
2. **Wait for assistant response** before sending the next prompt in sequence
3. **Watch the visualization** to confirm correct agents are animating

## Quick Test - Run All First Messages

```bash
# A.1 - Onboarding Tasks
curl -X POST http://localhost:8080/api/chat-notification -H "Content-Type: application/json" -d '[{"type":"user","content":"Create onboarding tasks","userId":"test-student","guide":"student"}]'

# B.1 - Assessment Extension
curl -X POST http://localhost:8080/api/chat-notification -H "Content-Type: application/json" -d '[{"type":"user","content":"Help. I am not going to finish my assignment on time.","userId":"test-student","guide":"student"}]'

# C.1 - Exam Planning
curl -X POST http://localhost:8080/api/chat-notification -H "Content-Type: application/json" -d '[{"type":"user","content":"Create a revision plan for upcoming exams","userId":"test-student","guide":"student"}]'
```
