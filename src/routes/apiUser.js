const express = require('express')

const { auth } = require('../middleware/auth');
const { getUser, getListUsers } = require('../controllers/userController');

const router = express.Router();

router.all('*', auth);

router.get('/user/:iduser', getUser);
router.get('/list-users', getListUsers);

module.exports = router;