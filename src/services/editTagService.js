const { Op } = require("sequelize");
const Edit_Tag = require("../models/Edit_Tag");
const { handleCreateImagesForEditTag, handleDeleteImagesForEditTag, handleGetImagesForEditTag,
    handleDeleteImagesForTag, handleCreateImagesForTag, handleGetImagesForTag } = require("./imageService");
const sequelize = require("../config/connectDB");
const dayjs = require("dayjs");
const { handleNotifyForUser } = require("./notificationService");
const Tag = require("../models/Tag");
const { handleIncreaseReputationForUser } = require("./userService");

const handleUpdateTag = async (idTag, tagName, tagSummary, tagDescription, tagImage, tagStatus) => {
    try {
        await Tag.update(
            {
                tag_name: tagName,
                tag_summary: tagSummary,
                tag_description: tagDescription,
                tag_status: tagStatus
            },
            {
                where: {
                    id: idTag,
                },
            },
        );

        if (tagImage && tagImage.length > 0) {
            const dataDeleteImagesTag = await handleDeleteImagesForTag(idTag);
            if (dataDeleteImagesTag && dataDeleteImagesTag.EC === 0) {
                const dataImagesTag = await handleCreateImagesForTag(idTag, tagImage);
                if (dataImagesTag && dataImagesTag.EC !== 0) {
                    return {
                        EC: 4,
                        EM: dataImagesTag.EM,
                    }
                }
            }
            else {
                return {
                    EC: 3,
                    EM: dataDeleteImagesTag.EM,
                }
            }
        }
        return {
            EC: 0,
            EM: "Update question succeed",
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleEditTag = async (idUser, idTag, tagName, tagSummary, tagDescription, editSummary, editImage, previousEditId) => {
    try {
        const editTag = await Edit_Tag.create({
            edited_by_user_id: idUser,
            tag_id: idTag,
            tag_name: tagName,
            tag_summary: tagSummary,
            tag_description: tagDescription,
            previous_edit_id: previousEditId,
            edit_summary: editSummary,
        });

        const idEditTag = editTag?.dataValues?.id;

        if (editImage && editImage.length > 0) {
            const dataImagesEditTag = await handleCreateImagesForEditTag(idEditTag, editImage);
            if (dataImagesEditTag && dataImagesEditTag.EC !== 0) {
                return {
                    EC: 3,
                    EM: dataImagesEditTag.EM,
                };
            }
        }
        else {
            const dataImagesTag = await handleGetImagesForTag(idTag);
            if (dataImagesTag && dataImagesTag.EC === 0) {
                editImage = dataImagesTag.DT.map((image) => {
                    return image.file_name;
                })
                const dataImagesEditTag = await handleCreateImagesForEditTag(idEditTag, editImage);
                if (dataImagesEditTag && dataImagesEditTag.EC !== 0) {
                    return {
                        EC: 3,
                        EM: dataImagesEditTag.EM,
                    };
                }
            }
            else {
                return {
                    EC: 4,
                    EM: dataImagesTag.EM,
                };
            }
        }

        return {
            EC: 0,
            DT: idEditTag,
            EM: "Create edit tag succeed",
        };
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetEditTagForUser = async (idTag, idUser) => {
    try {
        const editTag = await Edit_Tag.findOne({
            where: {
                [Op.or]: [
                    {
                        tag_id: idTag,
                        edit_status: 1,
                    },
                    {
                        tag_id: idTag,
                        edited_by_user_id: idUser,
                        edit_status: 0,
                    }
                ],
            },
            order: [['createdAt', 'DESC']],
        });
        // const plainEdit = edit.get({ plain: true });
        // plainEdit.editedTime = dayjs(plainEdit.createdAt).format('D MMM, YYYY [a]t H:mm');
        return {
            EC: 0,
            EM: 'Get edit tag for user succeed',
            DT: editTag
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetListEditsTag = async (editStatus) => {
    try {
        const [dataListEditsTag] = await sequelize.query(`SELECT edit_tag.id, user.display_name, edit_tag.edit_summary, edit_tag.createdAt, 
                                                        edit_tag.tag_id, edit_tag.tag_name, edit_tag.tag_summary, edit_tag.tag_description, 
                                                        edit_tag.edit_status, edit_tag.previous_edit_id, user.avatar_file_name,
                                                        edit_tag.edited_by_user_id
                                                        FROM edit_tag
                                                        LEFT JOIN user ON edit_tag.edited_by_user_id = user.id
                                                        WHERE edit_tag.edit_status=${editStatus} AND edit_tag.previous_edit_id IS NOT NULL`);

        const formattedDataListEditsTag = dataListEditsTag.map(edit => {
            edit.proposedTime = dayjs(edit.createdAt).format('D MMM, YYYY [a]t H:mm');
            edit.createdAt = dayjs(edit.createdAt).format('DD-MM-YYYY HH:mm:ss');
            return edit;
        });

        return {
            EC: 0,
            EM: 'Get list edits tag succeed',
            DT: formattedDataListEditsTag
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetListEditsTagPagination = async (page, limit, editStatus) => {
    try {
        const offset = (page - 1) * limit;
        const [dataListEditsTag] = await sequelize.query(`SELECT edit_tag.id, user.display_name, edit_tag.edit_summary, edit_tag.createdAt, 
                                                        edit_tag.tag_id, edit_tag.tag_name, edit_tag.tag_summary, edit_tag.tag_description, 
                                                        edit_tag.edit_status, edit_tag.previous_edit_id, user.avatar_file_name,
                                                        edit_tag.edited_by_user_id
                                                        FROM edit_tag
                                                        LEFT JOIN user ON edit_tag.edited_by_user_id = user.id
                                                        WHERE edit_tag.edit_status=${editStatus} AND edit_tag.previous_edit_id IS NOT NULL
                                                        LIMIT ${limit} 
                                                        OFFSET ${offset}`);

        const formattedDataListEditsTag = dataListEditsTag.map(edit => {
            edit.proposedTime = dayjs(edit.createdAt).format('D MMM, YYYY [a]t H:mm');
            edit.createdAt = dayjs(edit.createdAt).format('DD-MM-YYYY HH:mm:ss');
            return edit;
        });

        const dataTotalListEditsTag = await handleGetListEditsTag(editStatus);
        if (dataTotalListEditsTag && dataTotalListEditsTag.EC === 0) {
            const count = dataTotalListEditsTag.DT.length;
            const totalPages = Math.ceil(count / limit);
            return {
                EC: 0,
                EM: 'Get list edits tag pagination succeed',
                DT: {
                    totalRows: count,
                    totalPages: totalPages,
                    editsTag: formattedDataListEditsTag
                }
            }
        }
        else {
            return {
                EC: 2,
                EM: dataTotalListEditsTag.EM,
            };
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetEditTag = async (idEditTag) => {
    try {
        const editPostTag = await Edit_Tag.findOne({
            where: {
                id: idEditTag,
            },
        });

        return {
            EC: 0,
            EM: "Get edit tag succeed",
            DT: editPostTag
        };
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleUpdateEditTag = async (idEdit, tagName, tagSummary, tagDescription, editSummary, editImage) => {
    try {
        await Edit_Tag.update(
            {
                tag_name: tagName,
                tag_summary: tagSummary,
                tag_description: tagDescription,
                edit_summary: editSummary,
            },
            {
                where: {
                    id: idEdit,
                },
            },
        );

        if (editImage && editImage.length > 0) {
            const dataDeleteImagesEditTag = await handleDeleteImagesForEditTag(idEdit);
            if (dataDeleteImagesEditTag && dataDeleteImagesEditTag.EC === 0) {
                const dataImagesEditTag = await handleCreateImagesForEditTag(idEdit, editImage);
                if (dataImagesEditTag && dataImagesEditTag.EC !== 0) {
                    return {
                        EC: 4,
                        EM: dataImagesEditTag.EM,
                    }

                }
            }
            else {
                return {
                    EC: 3,
                    EM: dataDeleteImagesEditTag.EM,
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

const handleRejectEditForTag = async (idEdit, idUser, notificationType, notificationSummary, notificationResource) => {
    try {
        await Edit_Tag.update(
            {
                edit_status: 2,
            },
            {
                where: {
                    id: idEdit,
                },
            },
        );
        const dataNotifyUser = await handleNotifyForUser(idUser, notificationType, notificationSummary, notificationResource)
        if (dataNotifyUser && dataNotifyUser.EC === 0) {
            return {
                EC: 0,
                EM: 'Reject edit for tag succeed',
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

const handleApproveEditForTag = async (idEdit, idUser, notificationType, notificationSummary, notificationResource) => {
    try {
        await Edit_Tag.update(
            {
                edit_status: 1,
            },
            {
                where: {
                    id: idEdit,
                },
            },
        );

        const edit = await Edit_Tag.findOne({
            where: {
                id: idEdit,
            },
        });

        const listEditsReject = await Edit_Tag.findAll({
            where: {
                tag_id: edit.tag_id,
                previous_edit_id: edit.previous_edit_id,
                id: {
                    [Op.ne]: idEdit,
                }
            },
        });

        for (const editReject of listEditsReject) {
            const dataRejectEditPost = await handleRejectEditForTag(editReject.id, editReject.edited_by_user_id, "Chỉnh sửa",
                "Bài viết đã được thay đổi trước khi bản chỉnh sửa của bạn được duyệt. Vui lòng xem và chỉnh sửa lại!",
                `/edit-tag-wiki/${editReject.tag_id}`);
            if (dataRejectEditPost && dataRejectEditPost.EC !== 0) {
                return {
                    EC: 5,
                    EM: dataRejectEditPost.EM,
                };
            }
        }

        const dataImagesEdit = await handleGetImagesForEditTag(idEdit);
        if (dataImagesEdit && dataImagesEdit.EC === 0) {
            const tagImage = dataImagesEdit.DT.map((image) => {
                return image.file_name;
            })
            const dataUpdateTag = await handleUpdateTag(edit.tag_id, edit.tag_name, edit.tag_summary,
                edit.tag_description, tagImage)
            if (dataUpdateTag && dataUpdateTag.EC === 0) {
                const dataIncreaseReputationUser = await handleIncreaseReputationForUser(idUser, 10);
                if (dataIncreaseReputationUser?.EC === 0) {
                    const dataNotifyUser = await handleNotifyForUser(idUser, notificationType, notificationSummary, notificationResource)
                    if (dataNotifyUser && dataNotifyUser.EC === 0) {
                        return {
                            EC: 0,
                            EM: 'Approve edit for tag succeed',
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
                    EM: dataUpdateTag.EM,
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

module.exports = {
    handleEditTag, handleGetEditTagForUser, handleUpdateEditTag,
    handleGetListEditsTagPagination, handleGetListEditsTag, handleGetEditTag,
    handleRejectEditForTag, handleApproveEditForTag, handleUpdateTag
}