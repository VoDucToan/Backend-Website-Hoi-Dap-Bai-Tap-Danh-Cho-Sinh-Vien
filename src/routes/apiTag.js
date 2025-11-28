const express = require('express')

const { auth } = require('../middleware/auth');
const { getTagsByQuestion, getListTags, insertTagsQuestion, deleteTagsQuestion, insertTagsEdit, getTagsByEdit, createTag, updateTag, deleteTagsEdit, getTag } = require('../controllers/tagController');
const { upload } = require('../middleware/uploadMulter');
const { checkCreateTagsPrivilege } = require('../middleware/privileges/createTagsPrivilege');

const router = express.Router();

// router.all('*', auth);

router.get('/list-tags-by-question/:idquestion', getTagsByQuestion);
router.get('/list-tags-by-edit/:idedit', auth, getTagsByEdit);
router.get('/list-tags', getListTags);
router.get('/tag/:idtag', getTag);

router.post('/insert-tags-for-question', auth, insertTagsQuestion);
router.post('/insert-tags-for-edit', auth, insertTagsEdit);
router.post('/create-tag', auth, upload.array('fileImages', 10), checkCreateTagsPrivilege, createTag);

router.put('/update-tag', auth, upload.array('fileImages', 10), updateTag);

router.delete('/delete-tags-for-question/:idquestion', auth, deleteTagsQuestion);
router.delete('/delete-tags-for-edit/:idedit', auth, deleteTagsEdit);

module.exports = router;
