const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const notificationRoutes = require('./routes/notifications');
const streamRoutes = require('./routes/stream');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
app.use(express.json());

// Routes
app.use('/api', notificationRoutes);
app.use('/stream', streamRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Plus Visual Backend running on port ${PORT}`);
});
