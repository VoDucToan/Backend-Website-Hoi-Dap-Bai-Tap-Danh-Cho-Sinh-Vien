const { handleGetListComments, handleCreateComment, handleDeleteCommentsForPost, handleEditComment, handleDeleteComment } = require("../services/commentService");

const getListComments = async (req, res) => {
    let idPost = req.params.idpost;
    let comments = await handleGetListComments(idPost);
    return res.status(200).json(comments);
}

const createComment = async (req, res) => {
    const { idUser, idPost, contentComment } = req.body;
    const data = await handleCreateComment(idUser, idPost, contentComment);
    return res.status(200).json(data);
}

const deleteCommentsForPost = async (req, res) => {
    let idPost = req.params.idpost;
    const data = await handleDeleteCommentsForPost(idPost);
    return res.status(200).json(data);
}

const editComment = async (req, res) => {
    const { commentText, idComment } = req.body;
    const data = await handleEditComment(commentText, idComment);
    return res.status(200).json(data);
}

const deleteComment = async (req, res) => {
    let idComment = req.params.idcomment;
    const data = await handleDeleteComment(idComment);
    return res.status(200).json(data);
}

module.exports = {
    getListComments, createComment, deleteCommentsForPost,
    editComment, deleteComment
}