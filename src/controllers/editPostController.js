const { handleEditPost, handleGetListEditsPost, handleGetListRevisionsPost, handleGetEditPost, handleGetListEdits, handleApproveEditForPost, handleRejectEditForPost, handleGetListEditsPagination, handleGetEditForPost, handleUpdateEdiPost } = require("../services/editPostService");

const editPost = async (req, res) => {
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

    const { idUser, idPost, titlePost, detailPost, postPlainDetail, editSummary, listIdTags, previousEditId } = req.body;

    const data = await handleEditPost(idUser, idPost, titlePost, detailPost, postPlainDetail, editSummary, images, listIdTags, previousEditId);

    return res.status(200).json(data);
}

const getListEditsPost = async (req, res) => {
    let idPost = req.params.idpost;
    const data = await handleGetListEditsPost(idPost);
    return res.status(200).json(data);
}

const getEditForPost = async (req, res) => {
    let idPost = req.params.idpost;
    const data = await handleGetEditForPost(idPost);
    return res.status(200).json(data);
}

const getListRevisionsPost = async (req, res) => {
    let idPost = req.params.idpost;
    const { idUser } = req.query;
    const data = await handleGetListRevisionsPost(idPost, idUser);
    return res.status(200).json(data);
}

const getEditPost = async (req, res) => {
    let idEdit = req.params.idedit;
    const data = await handleGetEditPost(idEdit);
    return res.status(200).json(data);
}

const getListEdits = async (req, res) => {
    const { page, limit } = req.query;
    let editStatus = req.params.editstatus;
    if (+page && +limit) {
        const data = await handleGetListEditsPagination(+page, +limit, editStatus);
        return res.status(200).json(data);
    }
    else {
        const data = await handleGetListEdits(editStatus);
        return res.status(200).json(data);
    }
}

const approveEditForPost = async (req, res) => {
    const { idEdit, idUser, notificationType, notificationSummary, notificationResource } = req.body;
    const data = await handleApproveEditForPost(idEdit, idUser, notificationType, notificationSummary, notificationResource);
    return res.status(200).json(data);
}

const rejectEditForPost = async (req, res) => {
    const { idEdit, idUser, notificationType, notificationSummary, notificationResource } = req.body;
    const data = await handleRejectEditForPost(idEdit, idUser, notificationType, notificationSummary, notificationResource);
    return res.status(200).json(data);
}

const updateEditPost = async (req, res) => {
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

    const { idEdit, postTitle, postDetail, postPlainDetail, editSummary, listIdTags } = req.body;
    const data = await handleUpdateEdiPost(idEdit, postTitle, postDetail, postPlainDetail, editSummary, images, listIdTags);
    return res.status(200).json(data);
}

module.exports = {
    editPost, getListEditsPost, getListRevisionsPost, getEditPost,
    getListEdits, approveEditForPost, rejectEditForPost, getEditForPost,
    updateEditPost
}