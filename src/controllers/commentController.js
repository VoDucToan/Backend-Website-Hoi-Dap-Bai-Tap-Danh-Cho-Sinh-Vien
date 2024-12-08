const { handleGetListComments } = require("../services/commentService");

const getListComments = async (req, res) => {
    let idPost = req.params.idpost;
    let comments = await handleGetListComments(idPost);
    return res.status(200).json(comments);
}

module.exports = { getListComments }