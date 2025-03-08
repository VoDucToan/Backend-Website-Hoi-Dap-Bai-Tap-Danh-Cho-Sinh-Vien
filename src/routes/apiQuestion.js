const express = require('express')
const { auth } = require('../middleware/auth');
const { getListQuestions, getQuestion, createQuestion } = require('../controllers/questionController');
const { upload } = require('../middleware/uploadMulter');

const router = express.Router();

router.all('*', auth);

router.get('/list-questions', getListQuestions)
router.get('/question/:idquestion', getQuestion);

router.post('/create-question', upload.single('fileImage'), createQuestion)

module.exports = router;