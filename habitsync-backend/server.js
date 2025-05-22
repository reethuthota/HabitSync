const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Make sure CORS is properly enabled
app.use(express.json()); // To parse incoming JSON requests

// Routes
const habitRoutes = require('./routes/habitRoutes');
const authRoutes = require('./routes/authRoutes'); // Import the auth routes
const auth = require('./middleware/authMiddleware');
// const { auth } = require('./middleware/authMiddleware'); 

// Public routes (signup, login)
app.use('/api/auth', authRoutes);

// Protected routes (requires authentication)
app.use('/api/habits', auth, habitRoutes); 

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected');
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => console.error('MongoDB connection error:', err));
