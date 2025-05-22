const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habitController');


// Habit CRUD
router.post('/create', habitController.createHabit);     // create a habit
router.get('/', habitController.getHabits);             // get all habits for user
router.get('/partner-habits', habitController.getPartnerHabits);        // get habits where user is a partner

router.get('/:id', habitController.getHabitById);       // get a specific habit by ID
router.put('/:id', habitController.updateHabit);       // update a habit
router.delete('/:id', habitController.deleteHabit);    // delete a habit

// Habit actions
router.post('/:id/log', habitController.logHabit);                     // log habit
router.post('/:id/invite-partner', habitController.invitePartnerToHabit); // invite partner
router.delete('/:id/remove-partner', habitController.removePartnerFromHabit); // remove partner

module.exports = router;
