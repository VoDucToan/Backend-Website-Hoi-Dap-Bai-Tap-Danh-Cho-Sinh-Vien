const dayjs = require('dayjs');
const sequelize = require('../config/connectDB');
const connection = require('../config/database');
const Edit = require('../models/Edit_Post');
const Edit_Post_Tag = require('../models/Edit_Post_Tag');
const Edit_Tag = require("../models/Edit_Tag");
const Post_Tag = require('../models/Post_Tag');
const Tag = require('../models/Tag');
const User = require('../models/User');
const { handleCreateImagesForTag, handleDeleteImagesForTag } = require('./imageService');
const { handleEditTag } = require('./editTagService');
const { handleDecreaseReputationForUser } = require('./userService');

const handleGetTagsByQuestion = async (idQuestion) => {
    let [results, fields] = await connection.query(
        `select tag.id, tag_name, tag_description, post_id from tag
            inner join post_tag on post_tag.tag_id = tag.id
            inner join post on post.id = post_tag.post_id
            where post.id = ${idQuestion}`);
    return results;
}

const handleGetListTags = async (tagStatus) => {
    try {
        let where = '';
        if (tagStatus !== undefined && tagStatus !== '' && tagStatus !== 'undefined') {
            const s = tagStatus.toLowerCase();
            if (s === "true") {
                tagStatus = true;
            }
            else if (s === "false") {
                tagStatus = false;
            }
            where = `WHERE tag.tag_status = ${tagStatus}`;
        }

        let [results, fields] = await connection.query(`select * from tag ${where} `);
        return {
            EC: 0,
            EM: 'Get list tags succeed',
            DT: results

        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetTag = async (idTag) => {
    try {
        const tag = await Tag.findOne(
            {
                where: {
                    id: idTag,
                    tag_status: true
                }
            }
        );
        return {
            EC: 0,
            EM: 'Get tag succeed',
            DT: tag
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetNumberQuestionByTag = async (idTag) => {
    try {
        const amountQuestion = await Post_Tag.count({
            where: {
                tag_id: idTag,
            },
        });
        return {
            EC: 0,
            EM: 'Get amount questions succeed',
            DT: amountQuestion
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }

}

const handleGetListTagsPagination = async (page, limit, tagStatus, search) => {
    try {
        let where = '';
        if (tagStatus !== undefined && tagStatus !== '' && tagStatus !== 'undefined') {
            const s = tagStatus.toLowerCase();
            if (s === "true") {
                tagStatus = true;
            }
            else if (s === "false") {
                tagStatus = false;
            }
            where = `WHERE tag.tag_status = ${tagStatus}`;
        }

        if (search !== undefined && search !== '' && search !== 'undefined') {
            if (where) {
                where += ' AND ';
            }
            else {
                where += 'WHERE '
            }

            where += `tag.tag_name LIKE '%${search}%'`;
        }

        const offset = (page - 1) * limit;
        const [dataTags] = await sequelize.query(`SELECT tag.id, tag.tag_name, tag.tag_description, tag.tag_summary, 
                                                tag.tag_status, tag.createdAt, tag.updatedAt, 
                                                user.display_name, user.avatar_file_name
                                                FROM tag
                                                LEFT JOIN user ON tag.created_by_user_id = user.id
                                                ${where} 
                                                LIMIT ${limit} 
                                                OFFSET ${offset}`);
        for (let dataTag of dataTags) {
            dataTag.createdAt = dayjs(dataTag.createdAt).format('DD-MM-YYYY HH:mm:ss');
            dataTag.updatedAt = dayjs(dataTag.updatedAt).format('DD-MM-YYYY HH:mm:ss');
            const dataAmountQuestions = await handleGetNumberQuestionByTag(dataTag.id);
            if (dataAmountQuestions && dataAmountQuestions.EC === 0) {
                dataTag.amountQuestions = dataAmountQuestions.DT;
            }
            else {
                return {
                    EC: 2,
                    EM: dataAmountQuestions.EM,
                };
            }
        }

        const [count] = await sequelize.query(`SELECT COUNT(tag.id) as amount
                                                FROM tag
                                                ${where}`);
        const amountTag = count[0].amount;
        const totalPages = Math.ceil(amountTag / limit);
        return {
            EC: 0,
            EM: 'Get list tags pagination succeed',
            DT: {
                totalRows: amountTag,
                totalPages: totalPages,
                tags: dataTags
            }

        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }

}

const handleInsertTagsQuestion = async (idQuestion, listIdTags) => {
    try {
        for (let i = 0; i < listIdTags.length; i++) {
            await Post_Tag.create({
                post_id: idQuestion,
                tag_id: listIdTags[i]
            });
            // let [results, fields] = await connection.query(`INSERT INTO post_tag (post_id, tag_id)
            //                                                 VALUES (${idQuestion}, ${listIdTags[i]})`);
            // console.log('result', results);
        }
        return {
            EC: 0,
            EM: "Insert tags for question succeed",
        };
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleInsertTagsEdit = async (idEdit, listIdTags) => {
    try {
        if (listIdTags && listIdTags.length > 0) {
            for (let i = 0; i < listIdTags.length; i++) {
                console.log('listIdTags[i]', listIdTags[i]);
                await Edit_Post_Tag.create({
                    edit_id: idEdit,
                    tag_id: listIdTags[i]
                });
            }
        }
        return {
            EC: 0,
            EM: "Insert tags for edit succeed",
        };
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleCreateTag = async (idUser, tagName, tagSummary, tagDescription, tagImage) => {
    try {
        const tag = await Tag.create({
            created_by_user_id: idUser,
            tag_name: tagName,
            tag_summary: tagSummary,
            tag_description: tagDescription,
        });
        const idTag = tag?.dataValues?.id;
        const dataImageTag = await handleCreateImagesForTag(idTag, tagImage);
        console.log('dataImageTag', dataImageTag);
        if (dataImageTag && dataImageTag.EC === 0) {
            const dataEditTag = await handleEditTag(idUser, idTag, tagName, tagSummary, tagDescription, '', tagImage);
            if (dataEditTag && dataEditTag.EC === 0) {
                await Edit_Tag.update(
                    {
                        edit_status: 1,
                    },
                    {
                        where: {
                            id: dataEditTag.DT,
                        },
                    },
                );
                const dataDecreaseReputationUser = await handleDecreaseReputationForUser(idUser, 250);
                if (dataDecreaseReputationUser?.EC === 0) {
                    return {
                        EC: 0,
                        EM: "Create tag succeed",
                    };
                }
                else {
                    return {
                        EC: 3,
                        EM: dataDecreaseReputationUser.EM,
                    };
                }

            }
            else {
                return {
                    EC: 3,
                    EM: dataEditTag.EM,
                };
            }

        }
        else {
            return {
                EC: 2,
                EM: dataImageTag.EM,
            };
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleDeleteTagsQuestion = async (idQuestion) => {
    try {
        await Post_Tag.destroy({
            where: {
                post_id: idQuestion,
            },
        });
        return {
            EC: 0,
            EM: "Delete tags for question succeed",
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleDeleteTagsEdit = async (idEdit) => {
    try {
        await Edit_Post_Tag.destroy({
            where: {
                edit_id: idEdit,
            },
        });
        return {
            EC: 0,
            EM: "Delete tags for edit succeed",
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetTagsEdit = async (idEdit) => {
    try {
        const listTags = await Edit.findOne({
            include: {
                model: Tag,
            },
            where: {
                id: idEdit,
            },
        });
        return {
            EC: 0,
            EM: "Get list tags for edit succeed",
            DT: listTags
        };
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

module.exports = {
    handleGetTagsByQuestion, handleGetListTags, handleInsertTagsQuestion, handleDeleteTagsQuestion,
    handleInsertTagsEdit, handleGetTagsEdit, handleGetListTagsPagination, handleGetNumberQuestionByTag,
    handleCreateTag, handleDeleteTagsEdit, handleGetTag
};