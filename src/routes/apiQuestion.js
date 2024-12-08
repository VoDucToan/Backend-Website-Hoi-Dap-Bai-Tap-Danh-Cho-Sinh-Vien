const express = require('express')
const { auth } = require('../middleware/auth');
const { getListQuestions, getQuestion, createQuestion } = require('../controllers/questionController');

const router = express.Router();

router.all('*', auth);

router.get('/list-questions', getListQuestions)
router.get('/question/:idquestion', getQuestion);

router.post('/create-question', createQuestion)

module.exports = router;