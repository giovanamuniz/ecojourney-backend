const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habitController');
const authenticateToken = require('../middlewares/authenticateToken');

router.get('/', authenticateToken, habitController.getHabits);
router.post('/', authenticateToken, habitController.createHabit);
router.put('/:id', authenticateToken, habitController.updateHabit);
router.delete('/:id', authenticateToken, habitController.deleteHabit);

module.exports = router;
