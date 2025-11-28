const express = require('express')
const { auth } = require('../middleware/auth');
const { getImagesForPost, createImagesForPost, deleteImagesForPost, createImagesForEdit, getImagesForEdit, createImagesForTag, getImagesForTag, deleteImagesForTag, deleteImagesForEdit, createImagesForEditTag, getImagesForEditTag, deleteImagesForEditTag } = require('../controllers/imageController');

const router = express.Router();

// router.all('*', auth);

router.get('/images-for-post/:idpost', getImagesForPost)
router.get('/images-for-edit/:idedit', auth, getImagesForEdit)
router.get('/images-for-edit-tag/:idedittag', auth, getImagesForEditTag)
router.get('/images-for-tag/:idtag', getImagesForTag)

router.post('/create-images-for-post', auth, createImagesForPost) // chưa hoàn thiện
router.post('/create-images-for-edit', auth, createImagesForEdit) // chưa hoàn thiện
router.post('/create-images-for-tag', auth, createImagesForTag) // chưa hoàn thiện
router.post('/create-images-for-edit-tag', auth, createImagesForEditTag) // chưa hoàn thiện

router.delete('/images-for-post/:idpost', auth, deleteImagesForPost)
router.delete('/images-for-tag/:idtag', auth, deleteImagesForTag)
router.delete('/images-for-edit/:idedit', auth, deleteImagesForEdit)
router.delete('/images-for-edit-tag/:idedittag', auth, deleteImagesForEditTag)

module.exports = router;