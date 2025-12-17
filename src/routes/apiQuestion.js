const express = require('express')
const { auth } = require('../middleware/auth');
const { getListQuestions, getQuestion, createQuestion, deleteQuestion, updateQuestion, getQuestionByAnswer, getNumberQuestionByTag, getAmountQuestionsByUser, getQuestionsByUser } = require('../controllers/questionController');
const { upload } = require('../middleware/uploadMulter');

const router = express.Router();

// router.all('*', auth);

router.get('/list-questions', getListQuestions)
router.get('/questions-by-answer/:idanswer', auth, getQuestionByAnswer)
router.get('/question/:idquestion', getQuestion);
router.get('/number-question-by-tag/:idtag', auth, getNumberQuestionByTag);
router.get('/amount-questions-by-user/:idUser', getAmountQuestionsByUser);
router.get('/questions-by-user/:idUser', getQuestionsByUser);

router.post('/create-question', auth, upload.array('fileImages', 10), createQuestion);

router.put('/update-question', auth, upload.array('fileImages', 10), updateQuestion);

router.delete('/delete-question/:idquestion', auth, deleteQuestion);

module.exports = router;