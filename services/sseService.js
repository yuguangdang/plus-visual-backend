const clients = new Set();
let heartbeatInterval;

// Start heartbeat to keep SSE connections alive
function startHeartbeat() {
  if (heartbeatInterval) return; // Already running

  heartbeatInterval = setInterval(() => {
    sendSSEMessage({ type: 'heartbeat', timestamp: new Date().toISOString() });
  }, 15000); // Every 15 seconds

  console.log('SSE heartbeat started');
}

// Stop heartbeat when no clients connected
function stopHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
    console.log('SSE heartbeat stopped');
  }
}

function setupSSEConnection(req, res) {
  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });
  
  // Add client to set
  clients.add(res);
  console.log(`SSE client connected. Total clients: ${clients.size}`);

  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() })}\n\n`);

  // Start heartbeat if this is the first client
  if (clients.size === 1) {
    startHeartbeat();
  }

  // Handle client disconnect
  req.on('close', () => {
    clients.delete(res);
    console.log(`SSE client disconnected. Total clients: ${clients.size}`);
    // Stop heartbeat if no clients remaining
    if (clients.size === 0) {
      stopHeartbeat();
    }
  });

  // Handle client error
  req.on('error', (error) => {
    console.error('SSE client error:', error);
    clients.delete(res);
    // Stop heartbeat if no clients remaining
    if (clients.size === 0) {
      stopHeartbeat();
    }
  });
}

async function sendSSEMessage(message) {
  const data = `data: ${JSON.stringify(message)}\n\n`;
  console.log('Sending SSE message:', message.type);
  
  clients.forEach(client => {
    try {
      client.write(data);
    } catch (error) {
      console.error('Error sending SSE message:', error);
      clients.delete(client);
    }
  });
}

module.exports = { setupSSEConnection, sendSSEMessage };
