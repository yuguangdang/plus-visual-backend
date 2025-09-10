# Plus Visual Backend

Backend service for monitoring and visualizing Plus AI chat system operations.

## Features

- **Real-time SSE streaming** to dashboard
- **AWS Bedrock Nova Pro integration** for intention extraction
- **Notification endpoints** for Plus AI system integration
- **CORS support** for frontend communication

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp env.example .env
   # Edit .env with your AWS credentials
   ```

3. **Run locally:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Notifications
- `POST /api/chat-notification` - Receive chat start notification
- `POST /api/chat-complete` - Receive chat completion notification

### SSE Stream
- `GET /stream` - Server-sent events for real-time updates

## Environment Variables

- `AWS_REGION` - AWS region (default: ap-southeast-2)
- `AWS_PROFILE` - AWS profile for SSO (default: aiml_services)
- `PORT` - Server port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)

## AWS Setup

1. **Login with SSO:**
   ```bash
   aws sso login --profile aiml_services
   ```

2. **Verify credentials:**
   ```bash
   aws sts get-caller-identity --profile aiml_services
   ```

## Flow

1. Plus AI → `POST /api/chat-notification` → Backend
2. Backend → `SSE: chat_started` → Dashboard (start animation)
3. Backend → AWS Bedrock Nova Pro → get intention
4. Backend → `SSE: intention_extracted` → Dashboard (continue animation)
5. Plus AI → `POST /api/chat-complete` → Backend
6. Backend → `SSE: chat_completed` → Dashboard (stop animation)
