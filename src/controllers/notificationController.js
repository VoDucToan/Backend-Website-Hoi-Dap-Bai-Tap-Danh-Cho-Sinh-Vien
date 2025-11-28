const { handleGetListNotificationByUser, handleReadNotificaton, handleUnreadNotificaton, handleNotifyForUser, handleMarkAllRead, handleGetListNotificationPaginationByUser, handleNotifyForUserFollowingPost, handleNotifyForAuthorPost } = require("../services/notificationService");

const getListNotificationByUser = async (req, res) => {
    let idUser = req.params.iduser;
    const { unRead, page, limit, } = req.query;
    if (+page && +limit) {
        const data = await handleGetListNotificationPaginationByUser(idUser, +page, +limit);
        return res.status(200).json(data);
    }
    else {
        const data = await handleGetListNotificationByUser(idUser, unRead);
        return res.status(200).json(data);
    }

}

const readNotification = async (req, res) => {
    const { idNotification } = req.body;
    const data = await handleReadNotificaton(idNotification);
    return res.status(200).json(data);
}

const unreadNotification = async (req, res) => {
    const { idNotification } = req.body;
    const data = await handleUnreadNotificaton(idNotification);
    return res.status(200).json(data);
}

const notifyForUser = async (req, res) => {
    const { idUser, notificationType, notificationSummary, notificationResource,
        idTargetAnswer
    } = req.body;
    const data = await handleNotifyForUser(idUser, notificationType, notificationSummary,
        notificationResource, idTargetAnswer);
    return res.status(200).json(data);
}

const notifyForUserFollowingPost = async (req, res) => {
    const { idPost, idUser, notificationType, notificationSummary } = req.body;
    const data = await handleNotifyForUserFollowingPost(idPost, +idUser, notificationType, notificationSummary);
    return res.status(200).json(data);
}

const notifyForAuthorPost = async (req, res) => {
    const { idPost, notificationType, notificationSummary } = req.body;
    const data = await handleNotifyForAuthorPost(idPost, notificationType, notificationSummary);
    return res.status(200).json(data);
}

const markAllRead = async (req, res) => {
    const { idUser } = req.body;
    const data = await handleMarkAllRead(idUser);
    return res.status(200).json(data);
}

module.exports = {
    getListNotificationByUser, readNotification, unreadNotification,
    notifyForUser, markAllRead, notifyForUserFollowingPost,
    notifyForAuthorPost
}