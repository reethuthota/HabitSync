const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController'); // Assuming you have the controllers

// Signup route (no authentication required)
router.post('/signup', signup);

// Login route (no authentication required)
router.post('/login', login);

module.exports = router;
