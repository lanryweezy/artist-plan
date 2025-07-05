const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config({ path: '../.env.local' }); // Adjusted path to .env.local

const app = express();
const PORT = process.env.BACKEND_PORT || 5001; // Or any other port you prefer

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("Error: MONGODB_URI is not defined. Please set it in your .env.local file.");
  process.exit(1); // Exit the process if MongoDB URI is not found
}

mongoose.connect(MONGO_URI)
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the process on connection error
  });

// Basic Route
app.get('/', (req, res) => {
  res.send('Artist Plan Backend is running!');
});

// Placeholder for API routes (to be added later)
// const taskRoutes = require('./routes/taskRoutes');
// app.use('/api/tasks', taskRoutes);

// Auth Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Task Routes
const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);

// Project Routes
const projectRoutes = require('./routes/projectRoutes');
app.use('/api/projects', projectRoutes);

// Financial Routes
const financialRoutes = require('./routes/financialRoutes');
app.use('/api/financials', financialRoutes);

// Campaign Routes
const campaignRoutes = require('./routes/campaignRoutes');
app.use('/api/campaigns', campaignRoutes);

// Content Routes
const contentRoutes = require('./routes/contentRoutes');
app.use('/api/content', contentRoutes);

// Calendar Routes
const calendarRoutes = require('./routes/calendarRoutes');
app.use('/api/calendar', calendarRoutes);

// Tour Management Routes
const tourRoutes = require('./routes/tourRoutes');
app.use('/api/tours', tourRoutes);
const showRoutes = require('./routes/showRoutes');
app.use('/api/shows', showRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
