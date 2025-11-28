const { handleGetPostType, handleSearchPostsPagination } = require("../services/postService");

const getPostType = async (req, res) => {
    let idPost = req.params.idpost;
    const data = await handleGetPostType(idPost);
    return res.status(200).json(data);
}

const searchPosts = async (req, res) => {
    const { page, limit, textSearch } = req.query;
    const data = await handleSearchPostsPagination(+page, +limit, textSearch);
    return res.status(200).json(data);
}

module.exports = {
    getPostType, searchPosts
}