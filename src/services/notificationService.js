const dayjs = require("dayjs");
const Notification = require("../models/Notification");
const { handleGetPostType } = require("./postService");
const { handleGetUserFollowByPost } = require("./followService");
const Post = require("../models/Post");

const handleGetListNotificationByUser = async (idUser, unRead) => {
    try {
        const where = {
            belonged_by_user_id: idUser,
        }

        if (unRead !== undefined && unRead !== '' && unRead !== 'undefined') {
            const s = unRead.toLowerCase();
            if (s === "true") {
                unRead = true;
            }
            else if (s === "false") {
                unRead = false;
            }

            if (unRead) {
                where.is_read = false;
            }
        }

        const listNotifications = await Notification.findAll({
            where,
            order: [
                ['createdAt', 'DESC'],
            ],
            limit: 25,
        });
        const formattedListNotifications = listNotifications.map(notification => {
            const plainNotification = notification.get({ plain: true });
            plainNotification.noticedTime = dayjs(plainNotification.createdAt).format('D MMM, YYYY [a]t H:mm');
            return plainNotification;
        });
        const amountUnreadNotifications = await Notification.count({
            where: {
                belonged_by_user_id: idUser,
                is_read: false,
            },
        });
        return {
            EC: 0,
            EM: 'Get list notifications succeed',
            DT: {
                amountUnreadNotifications,
                listNotifications: formattedListNotifications,
            }
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetListNotificationPaginationByUser = async (idUser, page, limit) => {
    try {
        const offset = (page - 1) * limit;
        const where = {
            belonged_by_user_id: idUser,
        }

        const { count, rows } = await Notification.findAndCountAll({
            where,
            order: [
                ['createdAt', 'DESC'],
            ],
            offset: offset,
            limit: limit,
        });
        const formattedListNotifications = rows.map(notification => {
            const plainNotification = notification.get({ plain: true });
            plainNotification.noticedTime = dayjs(plainNotification.createdAt).format('D MMM, YYYY [a]t H:mm');
            return plainNotification;
        });
        const totalPages = Math.ceil(count / limit);
        const amountUnreadNotifications = await Notification.count({
            where: {
                belonged_by_user_id: idUser,
                is_read: false,
            },
        });
        return {
            EC: 0,
            EM: 'Get list notifications pagination succeed',
            DT: {
                totalRows: count,
                totalPages: totalPages,
                amountUnreadNotifications,
                listNotifications: formattedListNotifications,
            }
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleReadNotificaton = async (idNotification) => {
    try {
        await Notification.update(
            {
                is_read: true,
            },
            {
                where: {
                    id: idNotification,
                },
            },
        );
        return {
            EC: 0,
            EM: 'Read notification succeed',
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleUnreadNotificaton = async (idNotification) => {
    try {
        await Notification.update(
            {
                is_read: false,
            },
            {
                where: {
                    id: idNotification,
                },
            },
        );
        return {
            EC: 0,
            EM: 'Unread notification succeed',
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleNotifyForUser = async (idUser, notificationType, notificationSummary,
    notificationResource, idTargetAnswer) => {
    try {
        await Notification.create({
            belonged_by_user_id: idUser,
            notification_type: notificationType,
            notification_summary: notificationSummary,
            notification_resource: notificationResource,
            id_target_answer: idTargetAnswer,
        });
        return {
            EC: 0,
            EM: "Notify for user succeed",
        };
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleNotifyForUserFollowingPost = async (idPost, idUser, notificationType, notificationSummary) => {
    try {
        const dataPostType = await handleGetPostType(idPost);
        if (dataPostType?.EC === 0) {
            const dataUserFollowPost = await handleGetUserFollowByPost(idPost);
            if (dataUserFollowPost?.EC === 0) {
                const post = dataPostType.DT.post_type_id === 1 ? "Câu hỏi" : "Câu trả lời"
                const idQuestion = dataPostType.DT.post_type_id === 1 ? idPost : dataPostType.DT.parent_question_id
                const idAnswer = dataPostType.DT.post_type_id === 1 ? null : idPost;
                const notifications = dataUserFollowPost.DT && dataUserFollowPost.DT.length > 0
                    && dataUserFollowPost.DT.filter(item => item.user_id !== idUser)
                        .map((item) => {
                            return {
                                belonged_by_user_id: item.user_id,
                                notification_type: notificationType,
                                notification_summary: `${post} bạn theo dõi đã có người ${notificationSummary}`,
                                notification_resource: `/questions/${idQuestion}`,
                                id_target_answer: idAnswer,
                            }
                        })
                await Notification.bulkCreate(notifications);
                return {
                    EC: 0,
                    EM: "Notify for user following post succeed",
                };
            }
            else {
                return {
                    EC: 2,
                    EM: dataUserFollowPost.EM,
                };
            }
        }
        else {
            return {
                EC: 3,
                EM: dataPostType.EM,
            };
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }

}

const handleNotifyForAuthorPost = async (idPost, notificationType, notificationSummary) => {
    try {
        const dataPost = await Post.findOne({
            where: {
                id: idPost,
            },
        });
        const post = dataPost.post_type_id === 1 ? "Câu hỏi" : "Câu trả lời"
        const idQuestion = dataPost.post_type_id === 1 ? idPost : dataPost.parent_question_id
        const idAnswer = dataPost.post_type_id === 1 ? null : idPost;
        const dataNotifyUser = await handleNotifyForUser(dataPost.created_by_user_id, notificationType,
            `${post} của bạn đã có người ${notificationSummary}`, `/questions/${idQuestion}`, idAnswer,)
        if (dataNotifyUser?.EC === 0) {
            return {
                EC: 0,
                EM: 'Notify for author post succeed',
            }
        }
        else {
            return {
                EC: 1,
                EM: dataNotifyUser.EM,
            };
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleMarkAllRead = async (idUser) => {
    try {
        await Notification.update(
            {
                is_read: true,
            },
            {
                where: {
                    belonged_by_user_id: idUser,
                },
            },
        );
        return {
            EC: 0,
            EM: 'Mark all as read succeed',
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

module.exports = {
    handleGetListNotificationByUser, handleReadNotificaton, handleUnreadNotificaton,
    handleNotifyForUser, handleMarkAllRead, handleGetListNotificationPaginationByUser,
    handleNotifyForUserFollowingPost, handleNotifyForAuthorPost
}