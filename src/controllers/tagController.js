const { handleUpdateTag } = require("../services/editTagService");
const { handleGetTagsByQuestion, handleGetListTags, handleInsertTagsQuestion, handleDeleteTagsQuestion, handleInsertTagsEdit, handleGetTagsEdit, handleGetListTagsPagination, handleCreateTag, handleDeleteTagsEdit, handleGetTag } = require("../services/tagService");
const cloudinary = require("../config/cloudinary");
const pLimit = require("p-limit");


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
        for (const file of req.files) {
            if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|webp|WEBP)$/)) {
                return res.status(200).json({
                    EC: 1,
                    EM: 'Only image files (jpg, jpeg, png) are allowed!'
                });
            };
        }
    }

    // let images = null;
    // if (req?.files && req.files.length > 0) {
    //     images = req.files.map((file) => {
    //         return file.filename;
    //     })
    // }

    const limit = pLimit(5);
    const imagesToUpload = req.files.map((file) => {
        return limit(async () => {
            const result = await cloudinary.uploader.upload(file.path);
            return result;
        })
    })

    const uploads = await Promise.all(imagesToUpload);
    const images = uploads.map(image => image.secure_url);

    const { idUser, tagName, tagSummary, tagDescription } = req.body;
    const data = await handleCreateTag(idUser, tagName, tagSummary, tagDescription, images);
    return res.status(200).json(data);
}

const updateTag = async (req, res) => {
    if (req?.files && req.files.length > 0) {
        for (const file of req.files) {
            if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|webp|WEBP)$/)) {
                return res.status(200).json({
                    EC: 1,
                    EM: 'Only image files (jpg, jpeg, png) are allowed!'
                });
            };
        }
    }

    // let images = null;
    // if (req?.files && req.files.length > 0) {
    //     images = req.files.map((file) => {
    //         return file.filename;
    //     })
    // }

    const limit = pLimit(5);
    const imagesToUpload = req.files.map((file) => {
        return limit(async () => {
            const result = await cloudinary.uploader.upload(file.path);
            return result;
        })
    })

    const uploads = await Promise.all(imagesToUpload);
    const images = uploads.map(image => image.secure_url);

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