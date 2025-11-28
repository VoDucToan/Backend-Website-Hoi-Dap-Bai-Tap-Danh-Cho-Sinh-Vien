const express = require('express')

const { auth } = require('../middleware/auth');
const { getListNotificationByUser, readNotification, unreadNotification, notifyForUser, markAllRead, notifyForUserFollowingPost, notifyForAuthorPost } = require('../controllers/notificationController');

const router = express.Router();

// router.all('*', auth);

router.get('/list-notification-by-user/:iduser', auth, getListNotificationByUser);

router.put('/read-notification', auth, readNotification);
router.put('/unread-notification', auth, unreadNotification);
router.put('/mark-all-read', auth, markAllRead);

router.post('/notify-for-user', auth, notifyForUser);
router.post('/notify-for-user-following-post', auth, notifyForUserFollowingPost);
router.post('/notify-for-author-post', auth, notifyForAuthorPost);

module.exports = router;