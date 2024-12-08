const { handleIncreaseVoteForPost, handleUnvoteForPost, handleGetVoteTypeForPost,
    handleDecreaseVoteForPost, handleGetNumberVoteForPost,
    handleGetNumberVoteForComment,
    handleIncreaseVoteForComment,
    handleUnvoteForComment,
    handleGetVoteTypeForComment } = require("../services/voteService");

const getNumberVoteForPost = async (req, res) => {
    let idPost = req.params.idpost;
    let countVote = await handleGetNumberVoteForPost(idPost);
    return res.status(200).json({
        EC: 0,
        EM: "Get number vote for post succeed",
        DT: countVote
    });
}

const increaseVoteForPost = async (req, res) => {
    const { idPost, idUser, idVoteType } = req.body;
    const data = await handleIncreaseVoteForPost(idPost, idUser, idVoteType);
    return res.status(200).json(data);
}

const unvoteForPost = async (req, res) => {
    const { idpost, iduser } = req.params;
    const data = await handleUnvoteForPost(idpost, iduser);
    return res.status(200).json(data);
}

const getVoteTypeForPost = async (req, res) => {
    const { idpost, iduser } = req.params;
    const data = await handleGetVoteTypeForPost(idpost, iduser);
    return res.status(200).json(data);
}

const decreaseVoteForPost = async (req, res) => {
    const { idPost, idUser, idVoteType } = req.body;
    const data = await handleDecreaseVoteForPost(idPost, idUser, idVoteType);
    return res.status(200).json(data);
}

const getNumberVoteForComment = async (req, res) => {
    const idComment = req.params.idcomment;
    const data = await handleGetNumberVoteForComment(idComment);
    return res.status(200).json(data);
}

const increaseVoteForComment = async (req, res) => {
    const { idComment, idUser, idVoteType } = req.body;
    const data = await handleIncreaseVoteForComment(idComment, idUser, idVoteType);
    return res.status(200).json(data);
}

const unvoteForComment = async (req, res) => {
    const { idcomment, iduser } = req.params;
    const data = await handleUnvoteForComment(idcomment, iduser);
    return res.status(200).json(data);
}

const getVoteTypeForComment = async (req, res) => {
    const { idcomment, iduser } = req.params;
    const data = await handleGetVoteTypeForComment(idcomment, iduser);
    return res.status(200).json(data);
}

module.exports = {
    increaseVoteForPost, getNumberVoteForPost, unvoteForPost,
    getVoteTypeForPost, decreaseVoteForPost, getNumberVoteForComment,
    increaseVoteForComment, unvoteForComment, getVoteTypeForComment
};