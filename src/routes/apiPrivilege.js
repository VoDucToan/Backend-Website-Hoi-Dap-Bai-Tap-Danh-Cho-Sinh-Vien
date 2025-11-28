const express = require('express')

const { auth } = require('../middleware/auth');
const { grantPrivilegesForUser } = require('../controllers/privilegeController');

const router = express.Router();

// router.all('*', auth);

router.post('/grant-privileges-for-user', auth, grantPrivilegesForUser);

module.exports = router;