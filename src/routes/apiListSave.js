const express = require('express')

const { auth } = require('../middleware/auth');
const { createListSave, getListSavesByUser, updateListSaveName, deleteListSave } = require('../controllers/listSaveController');

const router = express.Router();

// router.all('*', auth);

router.get('/list-saves-by-user/:iduser', auth, getListSavesByUser);

router.put('/update-list-save-name', auth, updateListSaveName);

router.post('/create-list-save', auth, createListSave);

router.delete('/delete-list-save/:idlistsave', auth, deleteListSave);

module.exports = router;