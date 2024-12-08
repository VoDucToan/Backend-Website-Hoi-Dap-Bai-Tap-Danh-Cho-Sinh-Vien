const express = require('express')

const { auth } = require('../middleware/auth');
const { getNumberAnswers, getListAnswers, createAnswer } = require('../controllers/answerController');

const router = express.Router();

router.all('*', auth);

router.get('/number-answers/:idquestion', getNumberAnswers);
router.get('/list-answers/:idquestion', getListAnswers);
router.post('/create-answers', createAnswer);

module.exports = router;