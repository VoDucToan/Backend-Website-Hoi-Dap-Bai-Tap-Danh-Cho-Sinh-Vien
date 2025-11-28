const express = require('express')

const { auth } = require('../middleware/auth');
const { getUser, getListUsers, updateUser, increaseReputationForAuthorPost, decreaseReputationForAuthorPost, increaseReputationForUser, decreaseReputationForUser } = require('../controllers/userController');
const { upload } = require('../middleware/uploadMulter');

const router = express.Router();

// router.all('*', auth);

router.get('/user/:iduser', getUser);
router.get('/list-users', getListUsers);

router.put('/user', upload.single('fileImage'), auth, updateUser);
router.put('/increase-reputation-for-author-post', auth, increaseReputationForAuthorPost);
router.put('/increase-reputation-for-user', auth, increaseReputationForUser);
router.put('/decrease-reputation-for-author-post', auth, decreaseReputationForAuthorPost);
router.put('/decrease-reputation-for-user', auth, decreaseReputationForUser);

module.exports = router;