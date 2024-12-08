const express = require('express')

const { auth } = require('../middleware/auth');
const { increaseVoteForPost, getNumberVoteForPost, unvoteForPost,
    getVoteTypeForPost, decreaseVoteForPost, getNumberVoteForComment,
    increaseVoteForComment, unvoteForComment,
    getVoteTypeForComment } = require('../controllers/voteController');

const router = express.Router();

router.all('*', auth);

router.get('/number-vote-for-post/:idpost', getNumberVoteForPost);
router.get('/vote-type-for-post/:idpost/:iduser', getVoteTypeForPost);
router.get('/number-vote-for-comment/:idcomment', getNumberVoteForComment);
router.get('/vote-type-for-comment/:idcomment/:iduser', getVoteTypeForComment);

router.post('/increase-vote-for-post', increaseVoteForPost)
router.post('/decrease-vote-for-post', decreaseVoteForPost)
router.post('/increase-vote-for-comment', increaseVoteForComment)

router.delete('/unvote-for-post/:idpost/:iduser', unvoteForPost)
router.delete('/unvote-for-comment/:idcomment/:iduser', unvoteForComment)

module.exports = router;