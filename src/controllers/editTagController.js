const { handleEditTag, handleGetEditTagForUser, handleUpdateEditTag, handleGetListEditsTagPagination, handleGetListEditsTag, handleGetEditTag, handleRejectEditForTag, handleApproveEditForTag } = require("../services/editTagService");

const editTag = async (req, res) => {
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

const updateEditTag = async (req, res) => {
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

    const { idEdit, tagName, tagSummary, tagDescription, editSummary } = req.body;
    const data = await handleUpdateEditTag(idEdit, tagName, tagSummary, tagDescription, editSummary, images);
    return res.status(200).json(data);
}

const rejectEditForTag = async (req, res) => {
    const { idEdit, idUser, notificationType, notificationSummary, notificationResource } = req.body;
    const data = await handleRejectEditForTag(idEdit, idUser, notificationType, notificationSummary, notificationResource);
    return res.status(200).json(data);
}

const approveEditForTag = async (req, res) => {
    const { idEdit, idUser, notificationType, notificationSummary, notificationResource } = req.body;
    const data = await handleApproveEditForTag(idEdit, idUser, notificationType, notificationSummary, notificationResource);
    return res.status(200).json(data);
}

module.exports = {
    editTag, getEditTagForUser, updateEditTag, getListEditsTag,
    getEditTag, rejectEditForTag, approveEditForTag
}