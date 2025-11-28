const express = require('express')

const { auth } = require('../middleware/auth');
const { followPostByUser, checkFollowPostByUser, unfollowPostByUser, getUserFollowByPost, getFollowedPostByUser } = require('../controllers/followController');

const router = express.Router();

// router.all('*', auth);

router.get('/check-follow-post-by-user', auth, checkFollowPostByUser);
router.get('/user-follow-by-post/:idPost', auth, getUserFollowByPost);
router.get('/followed-post-by-user/:idUser', auth, getFollowedPostByUser);

router.post('/follow-post-by-user', auth, followPostByUser);

router.delete('/unfollow-post-by-user', auth, unfollowPostByUser);


module.exports = router;