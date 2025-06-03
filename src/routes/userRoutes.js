const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getUserPoints,
  getUserInfo,
  addPoints,
  redeemPoints,
} = require('../controllers/userController');

const authenticate = require('../middlewares/authenticateToken');

router.post('/register', register);
router.post('/login', login);
router.get('/user/points', authenticate, getUserPoints);
router.get('/user/info', authenticate, getUserInfo);
router.post('/add-points', authenticate, addPoints);
router.post('/redeem-points', authenticate, redeemPoints);

module.exports = router;
