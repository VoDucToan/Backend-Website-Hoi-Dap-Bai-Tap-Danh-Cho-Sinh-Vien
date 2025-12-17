const express = require('express')

const { auth } = require('../middleware/auth');
const { upload } = require('../middleware/uploadMulter');
const { editTag, getEditTagForUser, updateEditTag, getListEditsTag, getEditTag, rejectEditForTag, approveEditForTag, getEditForTag } = require('../controllers/editTagController');

const router = express.Router();

// router.all('*', auth);

router.get('/edit-tag-for-user', auth, getEditTagForUser);
router.get('/list-edits-tag/:editstatus', auth, getListEditsTag);
router.get('/edittag/:idedittag', auth, getEditTag);
router.get('/edit-for-tag/:idTag', auth, getEditForTag);

router.post('/edit-for-tag', auth, upload.array('fileImages', 10), editTag);

router.put('/update-edittag', auth, upload.array('fileImages', 10), updateEditTag);
router.put('/reject-edit-for-tag', auth, rejectEditForTag);
router.put('/approve-edit-for-tag', auth, approveEditForTag);

module.exports = router;