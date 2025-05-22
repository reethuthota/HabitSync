const Habit = require('../models/Habit');
const User = require('../models/User');

// Helper function to get weekday from date
function getWeekday(date) {
  return date.toLocaleString('en-US', { weekday: 'long', timeZone: 'UTC' });
}

// Helper: check if two dates are same day
function isSameDay(d1, d2) {
  return d1.toISOString().split('T')[0] === d2.toISOString().split('T')[0];
}

// Helper: get current week range (Sunday–Saturday)
function getWeekRange(date) {
  const day = date.getUTCDay();
  const sunday = new Date(date);
  sunday.setUTCDate(date.getUTCDate() - day);
  const saturday = new Date(sunday);
  saturday.setUTCDate(saturday.getUTCDate() + 6);
  return [sunday, saturday];
}

// CREATE
exports.createHabit = async (req, res) => {
  try {
    let partnerId = null;

    // 🔥 If a username is provided, find the partner
    if (req.body.accountabilityPartnerUsername) {
      const partner = await User.findOne({ username: req.body.accountabilityPartnerUsername.toLowerCase().trim() });
      if (!partner) {
        return res.status(404).json({ error: 'Accountability partner not found' });
      }
      partnerId = partner._id;
    }

    const habit = new Habit({
      ...req.body,
      userId: req.user._id, // Force correct user
      streak: 0,
      lastLogged: null,
      logs: [],
      accountabilityPartner: partnerId, // 🔥 Set the partner if found
    });

    const savedHabit = await habit.save();
    res.status(201).json(savedHabit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ
exports.getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user._id }); // 🔥 real user ID
    console.log('Habits for user:', req.user._id);
    console.log(habits); 
    res.json(habits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// READ: Get a habit by ID
exports.getHabitById = async (req, res) => {
  try {
    let habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ error: 'Habit not found' });

    // Check if the accountabilityPartner is not null
    if (habit.accountabilityPartner) {
      // Find the accountability partner's username
      const accountabilityPartner = await User.findById(habit.accountabilityPartner);
      if (accountabilityPartner) {
        // Convert the habit document to a plain JavaScript object
        habit = habit.toObject();

        // Dynamically add the accountabilityPartnerUsername field
        habit.accountabilityPartnerUsername = accountabilityPartner.username;
      }
    }

    res.json(habit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id }, // 🔥 make sure user owns it
      req.body,
      { new: true }
    );
    if (!habit) return res.status(404).json({ error: 'Habit not found' });
    res.json(habit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
exports.deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user._id }); // 🔥 secure delete
    if (!habit) return res.status(404).json({ error: 'Habit not found' });
    res.json({ message: 'Habit deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOG A HABIT
exports.logHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id }); // 🔥 only your habit
    if (!habit) return res.status(404).json({ error: 'Habit not found' });

    const today = new Date();
    const todayWeekday = getWeekday(today);

    // Check if habit is already logged today
    if (habit.logs.some(log => isSameDay(today, log))) {
      return res.status(400).json({ error: 'Habit already logged today' });
    }

    let shouldBreakStreak = false;

    // Add today's date to the logs array
    habit.logs.push(today);

    // Logic to check for streak breaks based on frequency
    switch (habit.frequencyLabel) {
      case 'daily': {
        if (habit.lastLogged) {
          const yesterday = new Date(today);
          yesterday.setUTCDate(today.getUTCDate() - 1);
          if (!isSameDay(yesterday, habit.lastLogged)) {
            shouldBreakStreak = true;
          }
        }
        break;
      }
      case 'weekly': {
        if (habit.lastLogged) {
          const [weekStart] = getWeekRange(today);
          if (habit.lastLogged < weekStart) {
            shouldBreakStreak = true;
          }
        }
        break;
      }
      case 'weekdays': {
        if (habit.lastLogged) {
          const yesterday = new Date(today);
          yesterday.setUTCDate(today.getUTCDate() - 1);
          const missedYesterday = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(getWeekday(yesterday)) &&
                                  !isSameDay(yesterday, habit.lastLogged);
          if (missedYesterday) shouldBreakStreak = true;
        }
        break;
      }
      case 'weekends': {
        if (habit.lastLogged) {
          const yesterday = new Date(today);
          yesterday.setUTCDate(today.getUTCDate() - 1);
          const missedWeekend = ['Saturday', 'Sunday'].includes(getWeekday(yesterday)) &&
                                !isSameDay(yesterday, habit.lastLogged);
          if (missedWeekend) shouldBreakStreak = true;
        }
        break;
      }
      case 'custom': {
        if (habit.lastLogged) {
          const yesterday = new Date(today);
          yesterday.setUTCDate(today.getUTCDate() - 1);
          const missedCustomDay = habit.frequency.includes(getWeekday(yesterday)) &&
                                  !isSameDay(yesterday, habit.lastLogged);
          if (missedCustomDay) shouldBreakStreak = true;
        }
        break;
      }
      default:
        return res.status(400).json({ error: 'Invalid frequencyLabel' });
    }

    // Update streak based on the log
    if (shouldBreakStreak) {
      habit.streak = 1;
    } else {
      habit.streak += 1;
    }

    // Update lastLogged date
    habit.lastLogged = today;

    await habit.save();

    res.json({ message: 'Habit logged!', streak: habit.streak, logs: habit.logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// INVITE Accountability Partner by Username
exports.invitePartnerToHabit = async (req, res) => {
  try {
    const { username } = req.body;

    // Check if partner exists by username
    const partner = await User.findOne({ username: username.toLowerCase().trim() });
    if (!partner) return res.status(404).json({ error: 'Accountability partner not found' });

    // Find your habit
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });
    if (!habit) return res.status(404).json({ error: 'Habit not found' });

    // Attach partner ID
    habit.accountabilityPartner = partner._id;
    await habit.save();

    res.json({ message: `Partner ${username} added successfully`, habit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET Habits where the user is an Accountability Partner
exports.getPartnerHabits = async (req, res) => {
  try {
    // Find habits where you are the accountability partner
    const habits = await Habit.find({ accountabilityPartner: req.user._id });

    // For each habit, fetch the username of the user who owns the habit (userId)
    const habitsWithOwnerData = await Promise.all(
      habits.map(async (habit) => {
        const user = await User.findById(habit.userId); // Find the user by userId
        return {
          ...habit.toObject(), // Convert the habit document to a plain object
          ownerUsername: user.username, // Add the username to the habit data
        };
      })
    );

    // Send the updated habits with owner username
    res.json(habitsWithOwnerData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// REMOVE Partner from specific Habit
exports.removePartnerFromHabit = async (req, res) => {
  try {
    // Find the habit
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });
    if (!habit) return res.status(404).json({ error: 'Habit not found' });

    habit.accountabilityPartner = null;
    await habit.save();

    res.json({ message: 'Accountability partner removed successfully', habit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
