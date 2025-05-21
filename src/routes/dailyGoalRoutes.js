const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const dailyGoalController = require('../controllers/dailyGoalController');

router.post('/', authenticateToken, dailyGoalController.createGoal);
router.get('/', authenticateToken, dailyGoalController.getGoalsByUser);
router.put('/:id', authenticateToken, dailyGoalController.updateGoal);
router.delete('/:id', authenticateToken, dailyGoalController.deleteGoal);

module.exports = router;
