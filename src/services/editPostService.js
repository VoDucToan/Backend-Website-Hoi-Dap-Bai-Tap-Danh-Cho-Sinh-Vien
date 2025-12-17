const Edit = require("../models/Edit_Post");
const Post = require("../models/Post");
const User = require("../models/User");
const { handleCreateImagesForEdit, handleGetImagesForEdit, handleDeleteImagesForPost, handleCreateImagesForPost, handleGetImagesForPost, handleDeleteImagesForEdit } = require("./imageService");
const { handleInsertTagsEdit, handleGetTagsEdit, handleDeleteTagsQuestion, handleInsertTagsQuestion, handleDeleteTagsEdit } = require("./tagService");
const sequelize = require('../config/connectDB');
const { DataTypes, Op } = require('sequelize');
const dayjs = require("dayjs");
const { handleGetPostType } = require("./postService");
const Post_Tag = require("../models/Post_Tag");
const { handleNotifyForUser, handleNotifyForUserFollowingPost, handleNotifyForAuthorPost } = require("./notificationService");
const { handleIncreaseReputationForAuthorPost, handleIncreaseReputationForUser } = require("./userService");
const Edit_Post = require("../models/Edit_Post");
const Notification = require("../models/Notification");

const handleUpdateQuestion = async (idQuestion, postTitle, postDetail, postPlainDetail, postImage, listIdTags, postStatus) => {
    try {
        await Post.update(
            {
                post_title: postTitle,
                post_details: postDetail,
                post_status: postStatus,
                post_plain_details: postPlainDetail,
            },
            {
                where: {
                    id: idQuestion,
                },
            },
        );

        if (postImage && postImage.length > 0) {
            const dataDeleteImagesPost = await handleDeleteImagesForPost(idQuestion);
            if (dataDeleteImagesPost && dataDeleteImagesPost.EC === 0) {
                const dataImagesPost = await handleCreateImagesForPost(idQuestion, postImage);
                if (dataImagesPost && dataImagesPost.EC !== 0) {
                    return {
                        EC: 4,
                        EM: dataImagesPost.EM,
                    }

                }
            }
            else {
                return {
                    EC: 3,
                    EM: dataDeleteImagesPost.EM,
                }
            }
        }

        const dataDeleteTagsQuestion = await handleDeleteTagsQuestion(idQuestion);
        if (dataDeleteTagsQuestion && dataDeleteTagsQuestion.EC === 0) {
            const dataInsertTagsQuestion = await handleInsertTagsQuestion(idQuestion, listIdTags)
            if (dataInsertTagsQuestion && dataInsertTagsQuestion.EC === 0) {
                return {
                    EC: 0,
                    EM: "Update question succeed",
                }
            }
            else {
                return {
                    EC: 6,
                    EM: dataInsertTagsQuestion.EM,
                }
            }
        }
        else {
            return {
                EC: 5,
                EM: dataDeleteTagsQuestion.EM,
            }
        }

    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleEditPost = async (idUser, idPost, titlePost, detailPost, postPlainDetail, editSummary, editImage, listIdTags, previousEditId) => {
    try {
        let editPost;
        const dataPostType = await handleGetPostType(idPost);
        if (dataPostType && dataPostType.EC === 0) {
            editPost = await Edit.create({
                edited_by_user_id: idUser,
                post_id: idPost,
                post_title: titlePost,
                post_details: detailPost,
                post_plain_details: postPlainDetail,
                edit_summary: editSummary,
                previous_edit_id: previousEditId,
                edit_post_type_id: dataPostType.DT.post_type_id
            });
        }
        else {
            return {
                EC: 6,
                EM: dataPostType.EM,
            };
        }

        const idEdit = editPost?.dataValues?.id;

        if (editImage && editImage.length > 0) {
            const dataImagesEdit = await handleCreateImagesForEdit(idEdit, editImage);
            if (dataImagesEdit && dataImagesEdit.EC !== 0) {
                return {
                    EC: 3,
                    EM: dataImagesEdit.EM,
                };
            }
        }
        else {
            const dataImagesPost = await handleGetImagesForPost(idPost);
            if (dataImagesPost && dataImagesPost.EC === 0) {
                editImage = dataImagesPost.DT.map((image) => {
                    return image.file_name;
                })
                const dataImagesEdit = await handleCreateImagesForEdit(idEdit, editImage);
                if (dataImagesEdit && dataImagesEdit.EC !== 0) {
                    return {
                        EC: 3,
                        EM: dataImagesEdit.EM,
                    };
                }
            }
            else {
                return {
                    EC: 4,
                    EM: dataImagesPost.EM,
                };
            }
        }

        const dataInsertTagsEdit = await handleInsertTagsEdit(idEdit, listIdTags);
        if (dataInsertTagsEdit && dataInsertTagsEdit.EC === 0) {
            return {
                EC: 0,
                DT: idEdit,
                EM: "Create edit post succeed",
            };
        }
        else {
            return {
                EC: 5,
                EM: dataInsertTagsEdit.EM,
            };
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetListEditsPost = async (idPost) => {
    try {
        const listEditsPost = await Edit.findAll({
            where: {
                post_id: idPost,
            },
        });
        return {
            EC: 0,
            EM: 'Get list edits for post succeed',
            DT: listEditsPost
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetEditForPost = async (idPost) => {
    try {
        const edit = await Edit.findOne({
            where: {
                post_id: idPost,
                edit_status: 1,
            },
            order: [['createdAt', 'DESC']],
        });
        const plainEdit = edit.get({ plain: true });
        plainEdit.editedTime = dayjs(plainEdit.createdAt).format('D MMM, YYYY [a]t H:mm');
        return {
            EC: 0,
            EM: 'Get edit for post succeed',
            DT: plainEdit
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetListRevisionsPost = async (idPost, idUser) => {
    try {
        const [datalistRevisionsPost] = await sequelize.query(`SELECT edit_post.edit_summary, edit_post.createdAt, 
                                                            user.display_name, edit_post.id, edit_post.edit_status
                                                            FROM edit_post
                                                            LEFT JOIN user ON edit_post.edited_by_user_id = user.id
                                                            WHERE (edit_post.post_id = ${idPost} AND edit_post.edit_status = 1) 
                                                            OR (edit_post.post_id = ${idPost} AND edit_post.edit_status = 0 
                                                            AND edit_post.edited_by_user_id = ${idUser})
                                                            ORDER BY edit_post.id DESC `);
        const formattedDatalistRevisionsPost = datalistRevisionsPost.map(revision => {
            revision.createdAt = dayjs(revision.createdAt).format('D MMM, YYYY [a]t H:mm');
            return revision;
        });

        return {
            EC: 0,
            EM: 'Get list revisions for post succeed',
            DT: formattedDatalistRevisionsPost
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetEditPost = async (idEdit) => {
    try {
        const editPost = await Edit.findOne({
            where: {
                id: idEdit,
            },
        });

        return {
            EC: 0,
            EM: "Get edit post succeed",
            DT: editPost
        };
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }

}

const handleGetListEdits = async (editStatus) => {
    try {
        const [dataListEdits] = await sequelize.query(`SELECT edit_post.id, user.display_name, edit_post.edit_summary, edit_post.createdAt, 
                                                                edit_post.post_id, edit_post.post_title, edit_post.post_details, edit_post.edit_status,
                                                                edit_post.previous_edit_id, edit_post.edit_post_type_id, user.avatar_file_name,
                                                                edit_post.edited_by_user_id
                                                                FROM edit_post
                                                                LEFT JOIN user ON edit_post.edited_by_user_id = user.id
                                                                WHERE edit_post.edit_status=${editStatus} AND edit_post.previous_edit_id IS NOT NULL`);

        const formattedDataListEdits = dataListEdits.map(edit => {
            edit.proposedTime = dayjs(edit.createdAt).format('D MMM, YYYY [a]t H:mm');
            edit.createdAt = dayjs(edit.createdAt).format('DD-MM-YYYY HH:mm:ss');
            return edit;
        });

        return {
            EC: 0,
            EM: 'Get list edits succeed',
            DT: formattedDataListEdits
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetListEditsPagination = async (page, limit, editStatus) => {
    try {
        const offset = (page - 1) * limit;
        const [dataListEdits] = await sequelize.query(`SELECT edit_post.id, user.display_name, edit_post.edit_summary, edit_post.createdAt, 
                                                                edit_post.post_id, edit_post.post_title, edit_post.post_details, edit_post.edit_status,
                                                                edit_post.previous_edit_id, edit_post.edit_post_type_id, user.avatar_file_name,
                                                                edit_post.edited_by_user_id
                                                                FROM edit_post
                                                                LEFT JOIN user ON edit_post.edited_by_user_id = user.id
                                                                WHERE edit_post.edit_status=${editStatus} AND edit_post.previous_edit_id IS NOT NULL
                                                                LIMIT ${limit} 
                                                                OFFSET ${offset}`);

        const formattedDataListEdits = dataListEdits.map(edit => {
            edit.proposedTime = dayjs(edit.createdAt).format('D MMM, YYYY [a]t H:mm');
            edit.createdAt = dayjs(edit.createdAt).format('DD-MM-YYYY HH:mm:ss');
            return edit;
        });

        const count = await Edit_Post.count({
            where: {
                edit_status: editStatus,
                previous_edit_id: {
                    [Op.not]: null
                }
            }
        });
        const totalPages = Math.ceil(count / limit);
        return {
            EC: 0,
            EM: 'Get list edits pagination succeed',
            DT: {
                totalRows: count,
                totalPages: totalPages,
                edits: formattedDataListEdits
            }
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleApproveEditForPost = async (idEdit) => {
    try {
        await Edit.update(
            {
                edit_status: 1,
            },
            {
                where: {
                    id: idEdit,
                },
            },
        );

        const edit = await Edit.findOne({
            where: {
                id: idEdit,
            },
        });

        const dataPostType = await handleGetPostType(edit.post_id);
        if (dataPostType?.EC !== 0) {
            return {
                EC: 5,
                EM: dataPostType.EM,
            };
        }
        const postType = dataPostType.DT.post_type_id === 1 ? "câu hỏi" : "câu trả lời"
        const idQuestion = dataPostType.DT.post_type_id === 1 ? edit.post_id : dataPostType.DT.parent_question_id
        const idAnswer = dataPostType.DT.post_type_id === 1 ? null : edit.post_id;

        const listEditsReject = await Edit.findAll({
            where: {
                post_id: edit.post_id,
                previous_edit_id: edit.previous_edit_id,
                id: {
                    [Op.ne]: idEdit,
                }
            },
        });

        const arrIdEditsReject = listEditsReject?.length > 0 && listEditsReject.map((item) => {
            return item.id;
        })
        await Edit.update(
            {
                edit_status: 2,
            },
            {
                where: {
                    id: { [Op.in]: arrIdEditsReject },
                },
            },
        );
        const notifications = listEditsReject?.length > 0 && listEditsReject.map((item) => {
            return {
                belonged_by_user_id: item.edited_by_user_id,
                notification_type: "Chỉnh sửa",
                notification_summary: `${postType.charAt(0).toUpperCase() + postType.slice(1)} đã được thay đổi trước khi bản chỉnh sửa của bạn được duyệt. 
                Vui lòng xem và chỉnh sửa lại!`,
                notification_resource: `/posts/${item.post_id}/edit`,
                id_target_answer: null,
            }
        })
        await Notification.bulkCreate(notifications);

        const dataImagesEdit = await handleGetImagesForEdit(idEdit);
        if (dataImagesEdit && dataImagesEdit.EC === 0) {
            const postImage = dataImagesEdit.DT.map((image) => {
                return image.file_name;
            })
            const dataTagsEdit = await handleGetTagsEdit(idEdit);
            if (dataTagsEdit && dataTagsEdit.EC === 0) {
                const listIdTags = dataTagsEdit.DT.tags.map((tag) => {
                    return tag.id;
                })
                const dataUpdateQuestion = await handleUpdateQuestion(edit.post_id, edit.post_title,
                    edit.post_details, edit.post_plain_details, postImage, listIdTags)
                if (dataUpdateQuestion && dataUpdateQuestion.EC === 0) {
                    const dataIncreaseReputationUser = await handleIncreaseReputationForUser(edit.edited_by_user_id, 10);
                    if (dataIncreaseReputationUser?.EC === 0) {

                        const dataNotifyAuthorPost = await handleNotifyForAuthorPost(edit.post_id, "Chỉnh sửa",
                            `${postType.charAt(0).toUpperCase() + postType.slice(1)} của bạn đã có người chỉnh sửa`,
                            `/questions/${idQuestion}`, idAnswer);
                        if (dataNotifyAuthorPost?.EC !== 0) {
                            return {
                                EC: 7,
                                EM: dataNotifyAuthorPost.EM,
                            };
                        }

                        const dataNotifyUser = await handleNotifyForUser(edit.edited_by_user_id, "Chỉnh sửa",
                            `Bản chỉnh sửa ${postType} của bạn được chấp nhận, +10 điểm danh tiếng`, `/questions/${idQuestion}`, idAnswer)
                        if (dataNotifyUser && dataNotifyUser.EC === 0) {
                            const dataNotifyUserFollowingPost = await handleNotifyForUserFollowingPost(edit.post_id,
                                edit.edited_by_user_id, 'Chỉnh sửa',
                                `${postType.charAt(0).toUpperCase() + postType.slice(1)} bạn theo dõi đã có người chỉnh sửa`,
                                `/questions/${idQuestion}`, idAnswer);
                            if (dataNotifyUserFollowingPost?.EC === 0) {
                                return {
                                    EC: 0,
                                    EM: 'Approve edit for post succeed',
                                }
                            }
                            else {
                                return {
                                    EC: 3,
                                    EM: dataNotifyUserFollowingPost.EM,
                                };
                            }
                        }
                        else {
                            return {
                                EC: 6,
                                EM: dataNotifyUser.EM,
                            };
                        }
                    }
                    else {
                        return {
                            EC: 4,
                            EM: dataIncreaseReputationUser.EM,
                        };
                    }
                }
                else {
                    return {
                        EC: 4,
                        EM: dataUpdateQuestion.EM,
                    };
                }
            }
            else {
                return {
                    EC: 3,
                    EM: dataTagsEdit.EM,
                };
            }
        }
        else {
            return {
                EC: 2,
                EM: dataImagesEdit.EM,
            };
        }


    } catch (error) {
        console.log('error', error);
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleUpdateEdiPost = async (idEdit, postTitle, postDetail, postPlainDetail, editSummary, editImage, listIdTags) => {
    try {
        await Edit.update(
            {
                post_title: postTitle,
                post_details: postDetail,
                post_plain_details: postPlainDetail,
                edit_summary: editSummary,
            },
            {
                where: {
                    id: idEdit,
                },
            },
        );

        if (editImage && editImage.length > 0) {
            const dataDeleteImagesEdit = await handleDeleteImagesForEdit(idEdit);
            if (dataDeleteImagesEdit && dataDeleteImagesEdit.EC === 0) {
                const dataImagesEdit = await handleCreateImagesForEdit(idEdit, editImage);
                if (dataImagesEdit && dataImagesEdit.EC !== 0) {
                    return {
                        EC: 4,
                        EM: dataImagesEdit.EM,
                    }

                }
            }
            else {
                return {
                    EC: 3,
                    EM: dataDeleteImagesEdit.EM,
                }
            }
        }

        if (listIdTags && listIdTags.length > 0) {
            const dataDeleteTagsEdit = await handleDeleteTagsEdit(idEdit);
            if (dataDeleteTagsEdit && dataDeleteTagsEdit.EC === 0) {
                const dataInsertTagsEdit = await handleInsertTagsEdit(idEdit, listIdTags)
                if (dataInsertTagsEdit && dataInsertTagsEdit.EC !== 0) {
                    return {
                        EC: 6,
                        EM: dataInsertTagsEdit.EM,
                    }
                }
            }
            else {
                return {
                    EC: 5,
                    EM: dataDeleteTagsEdit.EM,
                }
            }
        }
        return {
            EC: 0,
            EM: "Update edit succeed",
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleRejectEditForPost = async (idEdit) => {
    try {
        await Edit.update(
            {
                edit_status: 2,
            },
            {
                where: {
                    id: idEdit,
                },
            },
        );

        const edit = await Edit.findOne({
            where: {
                id: idEdit,
            },
            attributes: ['edited_by_user_id', 'post_id'],
        });

        const dataPostType = await handleGetPostType(edit.post_id);
        if (dataPostType?.EC !== 0) {
            return {
                EC: 5,
                EM: dataPostType.EM,
            };
        }
        const postType = dataPostType.DT.post_type_id === 1 ? "câu hỏi" : "câu trả lời"
        const idQuestion = dataPostType.DT.post_type_id === 1 ? edit.post_id : dataPostType.DT.parent_question_id
        const idAnswer = dataPostType.DT.post_type_id === 1 ? null : edit.post_id;

        const dataNotifyUser = await handleNotifyForUser(edit.edited_by_user_id, "Chỉnh sửa",
            `Bản chỉnh sửa ${postType} của bạn được từ chối`, `/questions/${idQuestion}`, idAnswer)
        if (dataNotifyUser && dataNotifyUser.EC === 0) {
            return {
                EC: 0,
                EM: 'Reject edit for post succeed',
            }
        }
        else {
            return {
                EC: 2,
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

module.exports = {
    handleEditPost, handleGetListEditsPost, handleGetListRevisionsPost,
    handleGetEditPost, handleGetListEdits, handleApproveEditForPost,
    handleRejectEditForPost, handleUpdateQuestion, handleGetListEditsPagination,
    handleGetEditForPost, handleUpdateEdiPost
};



