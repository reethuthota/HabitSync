const User = require('../models/User');

// SIGNUP (Register a new user)
exports.signup = async (req, res) => {
  try {
    const { email, password, name, username } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    user = new User({
      email,
      username,
      password,
      name,
    });

    // Save the user to the database
    await user.save();

    // Generate JWT token
    const token = user.generateAuthToken();

    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN (Authenticate an existing user)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = user.generateAuthToken();

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
