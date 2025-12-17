const express = require('express')

const { auth } = require('../middleware/auth');
const { getNumberAnswers, getListAnswers, createAnswer, acceptAnswer, deleteAnswersForQuestion, unacceptedAnswer, getAnswer, getPageNumberByAnswer, getAmountAnswersByUser, getAnswersByUser, getAnswers, updateAnswer } = require('../controllers/answerController');
const { upload } = require('../middleware/uploadMulter');

const router = express.Router();

// router.all('*', auth);

router.get('/number-answers/:idquestion', getNumberAnswers);
router.get('/list-answers/:idquestion', getListAnswers);
router.get('/answer/:idanswer', auth, getAnswer);
router.get('/page-number-by-answer', getPageNumberByAnswer);
router.get('/amount-answers-by-user/:idUser', getAmountAnswersByUser);
router.get('/answers-by-user/:idUser', getAnswersByUser);
router.get('/answers', auth, getAnswers);

router.put('/accept-answer', auth, acceptAnswer);
router.put('/unaccepted-answer', auth, unacceptedAnswer);
router.put('/update-answer', auth, upload.array('fileImages', 10), updateAnswer);

router.post('/create-answers', auth, upload.array('fileImages', 10), createAnswer);

router.delete('/answers-for-question/:idquestion', auth, deleteAnswersForQuestion);

module.exports = router;