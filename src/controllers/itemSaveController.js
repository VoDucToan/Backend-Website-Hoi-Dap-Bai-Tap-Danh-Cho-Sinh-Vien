const { handleSaveItemForList, handleCheckSaveItemByUser, handleUnsaveItemForUser, handleGetItemsSaveByList, handleGetItemsSaveByListLater, handleMoveItemForList, handleDeletePrivateNoteForItem, handleUpdatePrivateNoteForItem } = require("../services/itemSaveService");

const saveItemForList = async (req, res) => {
    const { listSaveId, postId, privateNote } = req.body;
    const data = await handleSaveItemForList(listSaveId, postId, privateNote);
    return res.status(200).json(data);
}

const checkSaveItemByUser = async (req, res) => {
    const { idUser, idPost } = req.query;
    const data = await handleCheckSaveItemByUser(idUser, idPost);
    return res.status(200).json(data);
}

const unsaveItemForUser = async (req, res) => {
    const { idUser, idPost } = req.query;
    const data = await handleUnsaveItemForUser(idUser, idPost);
    return res.status(200).json(data);
}

const getItemsSaveByList = async (req, res) => {
    let idListSave = req.params.idlistsave;
    const data = await handleGetItemsSaveByList(idListSave);
    return res.status(200).json(data);
}

const getItemsSaveByListLater = async (req, res) => {
    let idUser = req.params.iduser;
    const data = await handleGetItemsSaveByListLater(idUser);
    return res.status(200).json(data);
}

const moveItemForList = async (req, res) => {
    const { idItemSave, idListSave } = req.body;
    const data = await handleMoveItemForList(idItemSave, idListSave);
    return res.status(200).json(data);
}

const deletePrivateNoteForItem = async (req, res) => {
    const { idItemSave } = req.body;
    const data = await handleDeletePrivateNoteForItem(idItemSave);
    return res.status(200).json(data);
}

const updatePrivateNoteForItem = async (req, res) => {
    const { idItemSave, privateNote } = req.body;
    const data = await handleUpdatePrivateNoteForItem(idItemSave, privateNote);
    return res.status(200).json(data);
}

module.exports = {
    saveItemForList, checkSaveItemByUser, unsaveItemForUser,
    getItemsSaveByList, getItemsSaveByListLater, moveItemForList,
    deletePrivateNoteForItem, updatePrivateNoteForItem
}

