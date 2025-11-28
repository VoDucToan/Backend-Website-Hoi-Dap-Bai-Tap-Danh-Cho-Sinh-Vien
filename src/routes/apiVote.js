const express = require('express')

const { auth } = require('../middleware/auth');
const { increaseVoteForPost, getNumberVoteForPost, unvoteForPost,
    getVoteTypeForPost, decreaseVoteForPost, getNumberVoteForComment,
    increaseVoteForComment, unvoteForComment,
    getVoteTypeForComment,
    deleteVotePost,
    upVoteForPost,
    downVoteForPost,
    getVotePostsByUser } = require('../controllers/voteController');
const { checkUpVotePostPrivilege } = require('../middleware/privileges/upVotePostPrivilege');
const { checkDownVotePostPrivilege } = require('../middleware/privileges/downVotePostPrivilege');
const { checkupVoteCommentPrivilege } = require('../middleware/privileges/upVoteCommentPrivilege');

const router = express.Router();

// router.all('*', auth);

router.get('/number-vote-for-post/:idpost', getNumberVoteForPost);
router.get('/vote-type-for-post/:idpost/:iduser', auth, getVoteTypeForPost);
router.get('/number-vote-for-comment/:idcomment', getNumberVoteForComment);
router.get('/vote-type-for-comment/:idcomment/:iduser', auth, getVoteTypeForComment);
router.get('/vote-posts-by-user/:idUser', auth, getVotePostsByUser);

router.post('/increase-vote-for-post', auth, increaseVoteForPost)
router.post('/decrease-vote-for-post', auth, decreaseVoteForPost)
router.post('/increase-vote-for-comment', auth, checkupVoteCommentPrivilege, increaseVoteForComment)
router.post('/up-vote-for-post', auth, checkUpVotePostPrivilege, upVoteForPost)
router.post('/down-vote-for-post', auth, checkDownVotePostPrivilege, downVoteForPost)


router.delete('/unvote-for-post/:idpost/:iduser', auth, unvoteForPost)
router.delete('/unvote-for-comment/:idcomment/:iduser', auth, unvoteForComment)
router.delete('/delete-vote-post/:idpost', auth, deleteVotePost)

module.exports = router;