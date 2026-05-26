require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./database/db');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');

connectDB();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = ['http://localhost:5500', 'http://127.0.0.1:5500', process.env.FRONTEND_URL];
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for now, to make Render deployment smooth without knowing the exact Vercel URL yet
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/api/health', (request, response) => {
  response.json({
    status: 'ok',
    service: 'Rapid Rescue API',
    version: '1.0.0',
    time: new Date().toISOString()
  });
});

app.get('/api/health/debug-env', (request, response) => {
  response.json({
    TWILIO_ACCOUNT_SID: {
      exists: !!process.env.TWILIO_ACCOUNT_SID,
      length: process.env.TWILIO_ACCOUNT_SID ? process.env.TWILIO_ACCOUNT_SID.length : 0,
      prefix: process.env.TWILIO_ACCOUNT_SID ? process.env.TWILIO_ACCOUNT_SID.substring(0, 5) : null
    },
    TWILIO_AUTH_TOKEN: {
      exists: !!process.env.TWILIO_AUTH_TOKEN,
      length: process.env.TWILIO_AUTH_TOKEN ? process.env.TWILIO_AUTH_TOKEN.length : 0,
      prefix: process.env.TWILIO_AUTH_TOKEN ? process.env.TWILIO_AUTH_TOKEN.substring(0, 3) : null
    },
    TWILIO_VERIFY_SERVICE_SID: {
      exists: !!process.env.TWILIO_VERIFY_SERVICE_SID,
      length: process.env.TWILIO_VERIFY_SERVICE_SID ? process.env.TWILIO_VERIFY_SERVICE_SID.length : 0,
      prefix: process.env.TWILIO_VERIFY_SERVICE_SID ? process.env.TWILIO_VERIFY_SERVICE_SID.substring(0, 4) : null
    },
    MONGO_URI: {
      exists: !!process.env.MONGO_URI,
      length: process.env.MONGO_URI ? process.env.MONGO_URI.length : 0,
      prefix: process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 15) : null
    }
  });
});

app.use((request, response) => {
  response.status(404).json({ error: 'Route not found.' });
});

app.listen(PORT, () => {
  console.log(`Rapid Rescue API Server is running on http://localhost:${PORT}`);
});
