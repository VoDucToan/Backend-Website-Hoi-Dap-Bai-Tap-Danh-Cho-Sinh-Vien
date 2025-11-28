const { handleFollowPostByUser, handleCheckFollowPostByUser, handleUnfollowPostByUser, handleGetUserFollowByPost, handleGetFollowedPostByUser, handleGetFollowedPostByUserPagination } = require("../services/followService")

const followPostByUser = async (req, res) => {
    const { idUser, idPost } = req.body;
    const data = await handleFollowPostByUser(idUser, idPost);
    return res.status(200).json(data);
}

const checkFollowPostByUser = async (req, res) => {
    const { idUser, idPost } = req.query;
    const data = await handleCheckFollowPostByUser(idUser, idPost);
    return res.status(200).json(data);
}


const unfollowPostByUser = async (req, res) => {
    const { idUser, idPost } = req.query;
    const data = await handleUnfollowPostByUser(idUser, idPost);
    return res.status(200).json(data);
}

const getUserFollowByPost = async (req, res) => {
    let idPost = req.params.idPost;
    const data = await handleGetUserFollowByPost(idPost);
    return res.status(200).json(data);
}

const getFollowedPostByUser = async (req, res) => {
    let idUser = req.params.idUser;
    const { page, limit
    } = req.query;
    if (+page && +limit) {
        const data = await handleGetFollowedPostByUserPagination(+page, +limit, idUser);
        return res.status(200).json(data);
    }
    else {
        const data = await handleGetFollowedPostByUser(idUser);
        return res.status(200).json(data);
    }
}

module.exports = {
    followPostByUser, checkFollowPostByUser, unfollowPostByUser,
    getUserFollowByPost, getFollowedPostByUser
}