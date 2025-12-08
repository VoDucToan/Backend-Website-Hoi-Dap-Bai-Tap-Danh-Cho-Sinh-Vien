const express = require('express')

const { auth } = require('../middleware/auth');
const { getPostType, searchPosts } = require('../controllers/postController');

const router = express.Router();

// router.all('*', auth);

router.get('/post-type/:idpost', auth, getPostType);
router.get('/search-posts', searchPosts);

module.exports = router;