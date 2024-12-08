const { handleGetTagsByQuestion, handleGetListTags } = require("../services/tagService");

const getTagsByQuestion = async (req, res) => {
    let idQuestion = req.params.idquestion;
    let tags = await handleGetTagsByQuestion(idQuestion);
    return res.status(200).json({
        EC: 0,
        EM: "Get tags by question succeed",
        DT: tags
    });
}

const getListTags = async (req, res) => {
    let tags = await handleGetListTags();
    return res.status(200).json(tags);
}

module.exports = { getTagsByQuestion, getListTags }