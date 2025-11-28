const express = require('express')
const { auth } = require('../middleware/auth');
const { getListComments, createComment, deleteCommentsForPost, editComment, deleteComment } = require('../controllers/commentController');
const { checkCommentPrivilege } = require('../middleware/privileges/commentPrivilege');

const router = express.Router();

// router.all('*', auth);

router.get('/list-comments/:idpost', getListComments);

router.post('/create-comment', auth, checkCommentPrivilege, createComment);

router.put('/edit-comment', auth, editComment);

router.delete('/comments-for-post/:idpost', auth, deleteCommentsForPost);
router.delete('/comment/:idcomment', auth, deleteComment);

module.exports = router;