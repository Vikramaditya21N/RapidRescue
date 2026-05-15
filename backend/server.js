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

app.use((request, response) => {
  response.status(404).json({ error: 'Route not found.' });
});

app.listen(PORT, () => {
  console.log(`Rapid Rescue API Server is running on http://localhost:${PORT}`);
});
