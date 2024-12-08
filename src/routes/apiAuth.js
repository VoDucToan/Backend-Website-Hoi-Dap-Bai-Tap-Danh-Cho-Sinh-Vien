const express = require('express')

const { auth } = require('../middleware/auth');
const { createUser, loginUser, getAccount } = require('../controllers/authController');

const router = express.Router();

router.all('*', auth);

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/get-account', getAccount);

module.exports = router;