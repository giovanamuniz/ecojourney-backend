const express = require('express');
const router = express.Router();
const { generateSuggestions } = require('../controllers/suggestionController');
const authenticateToken = require('../middlewares/authenticateToken');

router.post('/suggestions', authenticateToken, generateSuggestions);

module.exports = router;
