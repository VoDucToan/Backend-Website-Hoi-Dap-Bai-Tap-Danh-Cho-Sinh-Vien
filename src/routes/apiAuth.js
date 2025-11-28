const express = require('express')

const { auth } = require('../middleware/auth');
const { createUser, loginUser, getAccount, verifyEmail, refreshAccessToken, logout } = require('../controllers/authController');

const router = express.Router();

// router.all('*', auth);

router.post('/register', createUser);
router.post('/login', loginUser);
router.post('/refresh', refreshAccessToken);

router.put('/logout', auth, logout);
router.put('/verify-email', verifyEmail)

router.get('/get-account', auth, getAccount);

module.exports = router;