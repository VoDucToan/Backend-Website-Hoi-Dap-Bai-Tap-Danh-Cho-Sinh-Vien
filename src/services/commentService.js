const dayjs = require('dayjs');
const connection = require('../config/database');
const Comment = require('../models/Comment');
const { handleNotifyForUserFollowingPost } = require('./notificationService');

const handleGetListComments = async (idPost) => {
    try {
        const listComments = await Comment.findAll({
            where: {
                post_id: idPost,
            },
        });
        const formattedListComments = listComments.map(comment => {
            const plainComment = comment.get({ plain: true });
            plainComment.commentedTime = dayjs(plainComment.createdAt).format('D MMM, YYYY [a]t H:mm');
            plainComment.editedTime = dayjs(plainComment.updatedAt).format('D MMM, YYYY [a]t H:mm');
            return plainComment;
        });
        return {
            EC: 0,
            EM: "Get list comment for post succeed",
            DT: formattedListComments
        };
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleCreateComment = async (idUser, idPost, contentComment) => {
    try {
        await Comment.create({
            created_by_user_id: idUser,
            post_id: idPost,
            comment_text: contentComment
        });
        const dataNotifyUserFollowingPost = await handleNotifyForUserFollowingPost(idPost, idUser, 'Bình luận', 'bình luận');
        if (dataNotifyUserFollowingPost?.EC === 0) {
            return {
                EC: 0,
                EM: "Create comment succeed",
            };
        }
        else {
            return {
                EC: 3,
                EM: dataNotifyUserFollowingPost.EM,
            };
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleDeleteCommentsForPost = async (idPost) => {
    try {
        await Comment.destroy({
            where: {
                post_id: idPost,
            },
        });
        return {
            EC: 0,
            EM: "Delete comment for post succeed",
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleEditComment = async (commentText, idComment) => {
    try {
        await Comment.update(
            {
                comment_text: commentText
            },
            {
                where: {
                    id: idComment,
                },
            },
        );
        return {
            EC: 0,
            EM: "Edit comment for post succeed",
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleDeleteComment = async (idComment) => {
    try {
        await Comment.destroy({
            where: {
                id: idComment,
            },
        });
        return {
            EC: 0,
            EM: "Delete comment by id succeed",
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

module.exports = {
    handleGetListComments, handleCreateComment, handleDeleteCommentsForPost,
    handleEditComment, handleDeleteComment
};