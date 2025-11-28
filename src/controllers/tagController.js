const { handleUpdateTag } = require("../services/editTagService");
const { handleGetTagsByQuestion, handleGetListTags, handleInsertTagsQuestion, handleDeleteTagsQuestion, handleInsertTagsEdit, handleGetTagsEdit, handleGetListTagsPagination, handleCreateTag, handleDeleteTagsEdit, handleGetTag } = require("../services/tagService");

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
    const { page, limit, status, search } = req.query;
    if (+page && +limit) {
        const data = await handleGetListTagsPagination(+page, +limit, status, search);
        return res.status(200).json(data);
    }
    else {
        let tags = await handleGetListTags(status);
        return res.status(200).json(tags);
    }

}

const getTag = async (req, res) => {
    let idTag = req.params.idtag;
    let data = await handleGetTag(idTag);
    return res.status(200).json(data);
}

const insertTagsQuestion = async (req, res) => {
    const { listIdTags, idQuestion } = req.body;
    const data = await handleInsertTagsQuestion(idQuestion, listIdTags)
    return res.status(200).json(data);
}

const insertTagsEdit = async (req, res) => {
    const { idEdit, listIdTags } = req.body;
    const data = await handleInsertTagsEdit(idEdit, listIdTags);
    return res.status(200).json(data);
}

const createTag = async (req, res) => {
    if (req?.files && req.files.length > 0) {
        req.files.map((file) => {
            if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
                return res.status(200).json({
                    EC: 1,
                    EM: 'Only image files (jpg, jpeg, png) are allowed!'
                });
            };
        })
    }

    let images = null;
    if (req?.files && req.files.length > 0) {
        images = req.files.map((file) => {
            return file.filename;
        })
    }

    const { idUser, tagName, tagSummary, tagDescription } = req.body;
    const data = await handleCreateTag(idUser, tagName, tagSummary, tagDescription, images);
    return res.status(200).json(data);
}

const updateTag = async (req, res) => {
    if (req?.files && req.files.length > 0) {
        req.files.map((file) => {
            if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
                return res.status(200).json({
                    EC: 2,
                    EM: 'Only image files (jpg, jpeg, png) are allowed!'
                });
            };
        })
    }

    let images = null;
    if (req?.files && req.files.length > 0) {
        images = req.files.map((file) => {
            return file.filename;
        })
    }

    const { idTag, tagName, tagSummary, tagDescription, tagStatus } = req.body;
    const data = await handleUpdateTag(idTag, tagName, tagSummary, tagDescription, images, tagStatus);
    return res.status(200).json(data);
}

const deleteTagsQuestion = async (req, res) => {
    let idQuestion = req.params.idquestion;
    const data = await handleDeleteTagsQuestion(idQuestion);
    return res.status(200).json(data);
}

const deleteTagsEdit = async (req, res) => {
    let idEdit = req.params.idedit;
    const data = await handleDeleteTagsEdit(idEdit);
    return res.status(200).json(data);
}

const getTagsByEdit = async (req, res) => {
    let idEdit = req.params.idedit;
    const data = await handleGetTagsEdit(idEdit);
    return res.status(200).json(data);
}

module.exports = {
    getTagsByQuestion, getListTags, insertTagsQuestion, deleteTagsQuestion,
    insertTagsEdit, getTagsByEdit, createTag, updateTag, deleteTagsEdit,
    getTag
}