const express = require('express');
const router = express.Router();
const dailyGoalController = require('../controllers/dailyGoalController');
const authenticateToken = require('../middlewares/authenticateToken');

router.use(authenticateToken);

router.post('/', dailyGoalController.createGoal);
router.get('/', dailyGoalController.getGoals);
router.put('/:id', dailyGoalController.updateGoal);
router.delete('/:id', dailyGoalController.deleteGoal);
router.patch('/:id/toggle', dailyGoalController.toggleGoalCompletion);

module.exports = router;
