const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const dailyGoalController = require('../controllers/dailyGoalController');

router.post('/', authenticateToken, dailyGoalController.createGoal);
router.get('/', authenticateToken, dailyGoalController.getGoalsByUser);

module.exports = router;
