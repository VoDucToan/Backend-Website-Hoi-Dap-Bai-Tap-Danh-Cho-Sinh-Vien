const express = require('express')

const { auth } = require('../middleware/auth');
const { getTagsByQuestion, getListTags, insertTagsQuestion } = require('../controllers/tagController');

const router = express.Router();

router.all('*', auth);

router.get('/list-tags-by-question/:idquestion', getTagsByQuestion);
router.get('/list-tags', getListTags);

router.post('/insert-tags-for-question', insertTagsQuestion)

module.exports = router;
