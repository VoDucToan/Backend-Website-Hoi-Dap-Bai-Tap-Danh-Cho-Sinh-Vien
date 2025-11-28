const { handleGetImagesForPost, handleCreateImagesForPost, handleDeleteImagesForPost, handleCreateImagesForEdit, handleGetImagesForEdit, handleCreateImagesForTag, handleGetImagesForTag, handleDeleteImagesForTag, handleDeleteImagesForEdit, handleCreateImagesForEditTag, handleGetImagesForEditTag, handleDeleteImagesForEditTag } = require("../services/imageService");

const getImagesForPost = async (req, res) => {
    let idPost = req.params.idpost;
    const data = await handleGetImagesForPost(idPost);
    return res.status(200).json(data);
}

const createImagesForPost = async (req, res) => {
    const { idPost } = req.body;
    const data = await handleCreateImagesForPost(idPost, postImage);
    return res.status(200).json(data);
}

const deleteImagesForPost = async (req, res) => {
    let idPost = req.params.idpost;
    const data = await handleDeleteImagesForPost(idPost);
    return res.status(200).json(data);
}

const deleteImagesForTag = async (req, res) => {
    let idTag = req.params.idtag;
    const data = await handleDeleteImagesForTag(idTag);
    return res.status(200).json(data);
}

const createImagesForTag = async (req, res) => {
    const { idTag } = req.body;
    const data = await handleCreateImagesForTag(idTag, tagImage);
    return res.status(200).json(data);
}

const createImagesForEditTag = async (req, res) => {
    const { idEditTag } = req.body;
    const data = await handleCreateImagesForEditTag(idEditTag, tagImage);
    return res.status(200).json(data);
}

const createImagesForEdit = async (req, res) => {
    const { idEdit } = req.body;
    const data = await handleCreateImagesForEdit(idEdit, editImage);
    return res.status(200).json(data);
}

const getImagesForEdit = async (req, res) => {
    let idEdit = req.params.idedit;
    const data = await handleGetImagesForEdit(idEdit);
    return res.status(200).json(data);
}

const getImagesForEditTag = async (req, res) => {
    let idEditTag = req.params.idedittag;
    const data = await handleGetImagesForEditTag(idEditTag);
    return res.status(200).json(data);
}

const getImagesForTag = async (req, res) => {
    let idTag = req.params.idtag;
    const data = await handleGetImagesForTag(idTag);
    return res.status(200).json(data);
}

const deleteImagesForEdit = async (req, res) => {
    let idEdit = req.params.idedit;
    const data = await handleDeleteImagesForEdit(idEdit);
    return res.status(200).json(data);
}

const deleteImagesForEditTag = async (req, res) => {
    let idEditTag = req.params.idedittag;
    const data = await handleDeleteImagesForEditTag(idEditTag);
    return res.status(200).json(data);
}

module.exports = {
    getImagesForPost, createImagesForPost, deleteImagesForPost,
    createImagesForEdit, getImagesForEdit, createImagesForTag,
    getImagesForTag, deleteImagesForTag, deleteImagesForEdit,
    createImagesForEditTag, getImagesForEditTag, deleteImagesForEditTag
}