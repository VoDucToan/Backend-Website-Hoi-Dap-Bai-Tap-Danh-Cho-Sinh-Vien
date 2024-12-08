const express = require('express')
const { auth } = require('../middleware/auth');
const { getListComments } = require('../controllers/commentController');

const router = express.Router();

router.all('*', auth);

router.get('/list-comments/:idpost', getListComments);

module.exports = router;