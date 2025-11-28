const express = require('express')

const { auth } = require('../middleware/auth');
const { saveItemForList, checkSaveItemByUser, unsaveItemForUser, getItemsSaveByList, getItemsSaveByListLater, moveItemForList, deletePrivateNoteForItem, updatePrivateNoteForItem } = require('../controllers/itemSaveController');

const router = express.Router();

// router.all('*', auth);

router.get('/check-save-item-by-user', auth, checkSaveItemByUser);
router.get('/items-save-by-list/:idlistsave', auth, getItemsSaveByList);
router.get('/items-save-by-list-later/:iduser', auth, getItemsSaveByListLater);

router.post('/save-item-for-list', auth, saveItemForList);

router.put('/move-item-for-list', auth, moveItemForList);
router.put('/delete-private-note-for-item', auth, deletePrivateNoteForItem);
router.put('/update-private-note-for-item', auth, updatePrivateNoteForItem);

router.delete('/unsave-item-for-user', auth, unsaveItemForUser);


module.exports = router;