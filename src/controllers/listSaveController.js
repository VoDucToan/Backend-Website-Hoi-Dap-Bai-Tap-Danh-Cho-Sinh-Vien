const { handleCreateListSave, handleGetListSavesByUser, handleUpdateListSaveName, handleDeleteListSave } = require("../services/listSaveService");

const createListSave = async (req, res) => {
    const { idUser, listName } = req.body;
    const data = await handleCreateListSave(idUser, listName);
    return res.status(200).json(data);
}

const getListSavesByUser = async (req, res) => {
    let idUser = req.params.iduser;
    const data = await handleGetListSavesByUser(idUser);
    return res.status(200).json(data);
}

const updateListSaveName = async (req, res) => {
    const { idListSave, listName } = req.body;
    const data = await handleUpdateListSaveName(idListSave, listName);
    return res.status(200).json(data);
}

const deleteListSave = async (req, res) => {
    let idListSave = req.params.idlistsave;
    const data = await handleDeleteListSave(idListSave);
    return res.status(200).json(data);
}

module.exports = {
    createListSave, getListSavesByUser, updateListSaveName,
    deleteListSave
}

