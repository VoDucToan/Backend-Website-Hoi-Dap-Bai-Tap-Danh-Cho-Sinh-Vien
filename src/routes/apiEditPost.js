const express = require('express')

const { auth } = require('../middleware/auth');
const { editPost, getListEditsPost, getListRevisionsPost, getEditPost, getListEdits, approveEditForPost, rejectEditForPost, getEditForPost, updateEditPost } = require('../controllers/editPostController');
const { upload } = require('../middleware/uploadMulter');

const router = express.Router();

// router.all('*', auth);

router.get('/list-edits-for-post/:idpost', auth, getListEditsPost);
router.get('/edit-for-post/:idpost', getEditForPost);
router.get('/editpost/:idedit', auth, getEditPost);
router.get('/list-revisions-for-post/:idpost', auth, getListRevisionsPost);
router.get('/list-edits/:editstatus', auth, getListEdits);

router.put('/approve-edit-for-post', auth, approveEditForPost);
router.put('/reject-edit-for-post', auth, rejectEditForPost);
router.put('/update-editpost', auth, upload.array('fileImages', 10), updateEditPost);

router.post('/edit-for-post', auth, upload.array('fileImages', 10), editPost);

module.exports = router;