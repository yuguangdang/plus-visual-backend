# UK Showcase Test Prompts for Plus UI

Use these prompts in sequence to test each scenario. Wait for the assistant response before sending the next prompt.

**Local Backend URL:** `http://localhost:8080`
**Deployed Backend URL:** `https://w2dpn8shpq.ap-southeast-2.awsapprunner.com`

---

## Scenario A - Property Inquiry (Guest)

### A.1 - Initial Property Question
```
I am looking to buy to 35 Westwood Dr, can you tell me what it is like to live in River City
```
**Expected:** `property_inquiry` → Agents: Knowledge, Spatial, WebAgent

**curl (local):**
```bash
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"type":"user","content":"I am looking to buy to 35 Westwood Dr, can you tell me what it is like to live in River City","userId":"test-user","guide":"resident"}]'
```

### A.2 - Property Details Follow-up
```
Yes Flood risk and Council Tax
```
**Expected:** `property_details` → Agents: Knowledge, Spatial, WebAgent

**curl (local):**
```bash
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"type":"user","content":"I am looking to buy to 35 Westwood Dr, can you tell me what it is like to live in River City","userId":"test-user","guide":"resident"},{"type":"assistant","content":"River City is a wonderful place to live! Would you like more details about flood risk or council tax?","userId":"test-user","guide":"resident"},{"type":"user","content":"Yes Flood risk and Council Tax","userId":"test-user","guide":"resident"}]'
```

---

## Scenario B - Waste Disposal / Bulky Waste (Registered)

### B.2 - Waste Disposal Question
```
how can I dispose of this chair
```
**Expected:** `waste_disposal_inquiry` → Agents: Knowledge, ECM

**curl (local):**
```bash
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"type":"user","content":"how can I dispose of this chair","userId":"test-user","guide":"resident"}]'
```

### B.3 - Book Collection
```
Yes, its just the chair and can we book for 3 March 26
```
**Expected:** `bulky_waste_booking` → Agents: Request, BinCollections

**curl (local):**
```bash
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"type":"user","content":"how can I dispose of this chair","userId":"test-user","guide":"resident"},{"type":"assistant","content":"This appears to be bulky waste. We offer free collection. Would you like to book?","userId":"test-user","guide":"resident"},{"type":"user","content":"Yes, its just the chair and can we book for 3 March 26","userId":"test-user","guide":"resident"}]'
```

### B.4 - Confirm Booking
```
Yes
```
**Expected:** `bulky_waste_booking` → Agents: Request, BinCollections

**curl (local):**
```bash
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"type":"user","content":"how can I dispose of this chair","userId":"test-user","guide":"resident"},{"type":"assistant","content":"This appears to be bulky waste. We offer free collection.","userId":"test-user","guide":"resident"},{"type":"user","content":"Yes, its just the chair and can we book for 3 March 26","userId":"test-user","guide":"resident"},{"type":"assistant","content":"I have prepared a booking for 3 March 2026. Please confirm.","userId":"test-user","guide":"resident"},{"type":"user","content":"Yes","userId":"test-user","guide":"resident"}]'
```

---

## Scenario C - Council Tax / Hardship (Registered)

### C.1 - Hardship Inquiry
```
Tell me about temporary hardship allowance
```
**Expected:** `hardship_inquiry` → Agents: Knowledge, WebAgent

**curl (local):**
```bash
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"type":"user","content":"Tell me about temporary hardship allowance","userId":"test-user","guide":"resident"}]'
```

### C.2 - Apply for Hardship
```
Yes apply
```
**Expected:** `hardship_application` → Agents: Request, TaxTransactions

**curl (local):**
```bash
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"type":"user","content":"Tell me about temporary hardship allowance","userId":"test-user","guide":"resident"},{"type":"assistant","content":"The Temporary Hardship Allowance provides support for residents experiencing financial difficulty. Would you like to apply?","userId":"test-user","guide":"resident"},{"type":"user","content":"Yes apply","userId":"test-user","guide":"resident"}]'
```

### C.3 - Provide Circumstances
```
I am a casual worker and have hurt my leg and can only work half shifts
```
**Expected:** `document_submission` → Agents: ECM, Request

**curl (local):**
```bash
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"type":"user","content":"Tell me about temporary hardship allowance","userId":"test-user","guide":"resident"},{"type":"assistant","content":"The Temporary Hardship Allowance provides support for residents.","userId":"test-user","guide":"resident"},{"type":"user","content":"Yes apply","userId":"test-user","guide":"resident"},{"type":"assistant","content":"Please describe your circumstances and attach supporting documents.","userId":"test-user","guide":"resident"},{"type":"user","content":"I am a casual worker and have hurt my leg and can only work half shifts","userId":"test-user","guide":"resident"}]'
```

### C.4 - Confirm Submission
```
Yes confirmed
```
**Expected:** `request_confirmation` or `document_submission` → Agents: Request (or ECM, Request)

**curl (local):**
```bash
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"type":"user","content":"Yes apply","userId":"test-user","guide":"resident"},{"type":"assistant","content":"Please describe your circumstances.","userId":"test-user","guide":"resident"},{"type":"user","content":"I am a casual worker and have hurt my leg","userId":"test-user","guide":"resident"},{"type":"assistant","content":"I have prepared your application. Please confirm to submit.","userId":"test-user","guide":"resident"},{"type":"user","content":"Yes confirmed","userId":"test-user","guide":"resident"}]'
```

### C.6 - View Council Tax
```
Show me my council tax balance
```
**Expected:** `council_tax_view` → Agents: TaxTransactions

**curl (local):**
```bash
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"type":"user","content":"Show me my council tax balance","userId":"test-user","guide":"resident"}]'
```

### C.7 - Pay Now
```
Pay now
```
**Expected:** `payment_redirect` → Agents: TaxTransactions

**curl (local):**
```bash
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"type":"user","content":"Show me my council tax balance","userId":"test-user","guide":"resident"},{"type":"assistant","content":"Your council tax balance shows £450 outstanding. Would you like to pay now?","userId":"test-user","guide":"resident"},{"type":"user","content":"Pay now","userId":"test-user","guide":"resident"}]'
```

---

## Scenario D - Infrastructure Report / Pothole (Guest)

### D.1 - Report Pothole
```
fix this pothole at 92 Well St it will damage bike tyres
```
**Expected:** `infrastructure_report` → Agents: Knowledge, ECM, Request

**curl (local):**
```bash
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"type":"user","content":"fix this pothole at 92 Well St it will damage bike tyres","userId":"test-user","guide":"resident"}]'
```

### D.2 - Provide Additional Details
```
It is hazardous for bikes and would seriously damage tyres
```
**Expected:** `request_details` → Agents: Request

**curl (local):**
```bash
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"type":"user","content":"fix this pothole at 92 Well St it will damage bike tyres","userId":"test-user","guide":"resident"},{"type":"assistant","content":"Thank you for reporting this pothole. Could you provide additional details about the hazard?","userId":"test-user","guide":"resident"},{"type":"user","content":"It is hazardous for bikes and would seriously damage tyres","userId":"test-user","guide":"resident"}]'
```

### D.3 - Confirm Report
```
Yes
```
**Expected:** `request_with_attachment` → Agents: Request, ECM

**curl (local):**
```bash
curl -X POST http://localhost:8080/api/chat-notification \
  -H "Content-Type: application/json" \
  -d '[{"type":"user","content":"fix this pothole at 92 Well St it will damage bike tyres","userId":"test-user","guide":"resident"},{"type":"assistant","content":"Could you provide additional details?","userId":"test-user","guide":"resident"},{"type":"user","content":"It is hazardous for bikes and would seriously damage tyres","userId":"test-user","guide":"resident"},{"type":"assistant","content":"I have prepared your report. Please confirm to submit.","userId":"test-user","guide":"resident"},{"type":"user","content":"Yes","userId":"test-user","guide":"resident"}]'
```

---

## Tips

1. **Start a new conversation** for each scenario (A, B, C, D) to clear context
2. **Wait for assistant response** before sending the next prompt in sequence
3. **For B and D scenarios**, you may need to attach/upload an image first
4. **Watch the visualization** to confirm correct agents are animating

## Quick Test - Run All First Messages

```bash
# A.1 - Property Inquiry
curl -X POST http://localhost:8080/api/chat-notification -H "Content-Type: application/json" -d '[{"type":"user","content":"I am looking to buy to 35 Westwood Dr, can you tell me what it is like to live in River City","userId":"test-user","guide":"resident"}]'

# B.2 - Waste Disposal
curl -X POST http://localhost:8080/api/chat-notification -H "Content-Type: application/json" -d '[{"type":"user","content":"how can I dispose of this chair","userId":"test-user","guide":"resident"}]'

# C.1 - Hardship Inquiry
curl -X POST http://localhost:8080/api/chat-notification -H "Content-Type: application/json" -d '[{"type":"user","content":"Tell me about temporary hardship allowance","userId":"test-user","guide":"resident"}]'

# C.6 - Council Tax View
curl -X POST http://localhost:8080/api/chat-notification -H "Content-Type: application/json" -d '[{"type":"user","content":"Show me my council tax balance","userId":"test-user","guide":"resident"}]'

# D.1 - Infrastructure Report
curl -X POST http://localhost:8080/api/chat-notification -H "Content-Type: application/json" -d '[{"type":"user","content":"fix this pothole at 92 Well St it will damage bike tyres","userId":"test-user","guide":"resident"}]'
```
