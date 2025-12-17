const { handleEditTag, handleGetEditTagForUser, handleUpdateEditTag, handleGetListEditsTagPagination, handleGetListEditsTag, handleGetEditTag, handleRejectEditForTag, handleApproveEditForTag, handleGetEditForTag } = require("../services/editTagService");
const cloudinary = require("../config/cloudinary");
const pLimit = require("p-limit");

const editTag = async (req, res) => {
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

    // const limit = pLimit(5);
    // const imagesToUpload = req.files.map((file) => {
    //     return limit(async () => {
    //         const result = await cloudinary.uploader.upload(file.path);
    //         return result;
    //     })
    // })

    // const uploads = await Promise.all(imagesToUpload);
    // const images = uploads.map(image => image.secure_url);

    const images = req?.files?.map((file) => {
        return file.path;
    })

    const { idUser, idTag, tagName, tagSummary, tagDescription, editSummary, previousEditId } = req.body;

    const data = await handleEditTag(idUser, idTag, tagName, tagSummary, tagDescription, editSummary, images, previousEditId);

    return res.status(200).json(data);
}

const getEditTagForUser = async (req, res) => {
    const { idTag, idUser } = req.query;
    const data = await handleGetEditTagForUser(idTag, idUser);
    return res.status(200).json(data);
}

const getListEditsTag = async (req, res) => {
    const { page, limit } = req.query;
    let editStatus = req.params.editstatus;
    if (+page && +limit) {
        const data = await handleGetListEditsTagPagination(+page, +limit, editStatus);
        return res.status(200).json(data);
    }
    else {
        const data = await handleGetListEditsTag(editStatus);
        return res.status(200).json(data);
    }
}

const getEditTag = async (req, res) => {
    let idEditTag = req.params.idedittag;
    const data = await handleGetEditTag(idEditTag);
    return res.status(200).json(data);
}

const getEditForTag = async (req, res) => {
    let idTag = req.params.idTag;
    const data = await handleGetEditForTag(idTag);
    return res.status(200).json(data);
}

const updateEditTag = async (req, res) => {
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

    // const limit = pLimit(5);
    // const imagesToUpload = req.files.map((file) => {
    //     return limit(async () => {
    //         const result = await cloudinary.uploader.upload(file.path);
    //         return result;
    //     })
    // })

    // const uploads = await Promise.all(imagesToUpload);
    // const images = uploads.map(image => image.secure_url);

    const images = req?.files?.map((file) => {
        return file.path;
    })

    const { idEdit, tagName, tagSummary, tagDescription, editSummary } = req.body;
    const data = await handleUpdateEditTag(idEdit, tagName, tagSummary, tagDescription, editSummary, images);
    return res.status(200).json(data);
}

const rejectEditForTag = async (req, res) => {
    const { idEdit } = req.body;
    const data = await handleRejectEditForTag(idEdit);
    return res.status(200).json(data);
}

const approveEditForTag = async (req, res) => {
    const { idEdit } = req.body;
    const data = await handleApproveEditForTag(idEdit);
    return res.status(200).json(data);
}

module.exports = {
    editTag, getEditTagForUser, updateEditTag, getListEditsTag,
    getEditTag, rejectEditForTag, approveEditForTag, getEditForTag
}