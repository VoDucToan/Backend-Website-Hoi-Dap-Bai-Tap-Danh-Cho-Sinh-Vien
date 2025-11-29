const dayjs = require('dayjs');
const connection = require('../config/database');
const Post = require('../models/Post');
const { handleDeleteVotePost, handleGetNumberVoteForPost } = require('./voteService');
const { handleDeleteCommentsForPost } = require('./commentService');
const { handleDeleteImagesForPost, handleCreateImagesForPost } = require('./imageService');
const { handleEditPost } = require('./editPostService');
const Edit = require('../models/Edit_Post');
const sequelize = require('../config/connectDB');
const { Op } = require('sequelize');
const { handleNotifyForUserFollowingPost, handleNotifyForAuthorPost } = require('./notificationService');
const { handleIncreaseReputationForAuthorPost, handleDecreaseReputationForAuthorPost } = require('./userService');

const handleGetNumberAnswers = async (idQuestion) => {
    let [results, fields] = await connection.query(`select * from post where post_type_id = 2 and parent_question_id = ${idQuestion}`);
    return results.length;
}

const handleGetListAnswers = async (idQuestion) => {
    try {
        let typeQuestion = 2;
        const listAnswers = await Post.findAll({
            where: {
                post_type_id: typeQuestion,
                parent_question_id: idQuestion,
            },
        });
        return {
            EC: 0,
            EM: 'Get list answers succeed',
            DT: listAnswers
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetAnswer = async (idAnswer) => {
    try {
        const answer = await Post.findOne({
            where: {
                post_type_id: 2,
                id: idAnswer,
            },
        });
        const plainAnswer = answer.get({ plain: true });
        plainAnswer.createdAtAgo = dayjs(plainAnswer.createdAt).fromNow();
        plainAnswer.updatedAtAgo = dayjs(plainAnswer.updatedAt).fromNow();
        plainAnswer.askedTime = dayjs(plainAnswer.createdAt).format('D MMM, YYYY [a]t H:mm');
        plainAnswer.editedTime = dayjs(plainAnswer.updatedAt).format('D MMM, YYYY [a]t H:mm');

        return {
            EC: 0,
            EM: "Get answer succeed",
            DT: plainAnswer
        };
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetListAnswersPagination = async (idQuestion, page, limit, typeOrder) => {
    try {
        let order;
        if (typeOrder === 'vote') {
            order = [
                [sequelize.literal('voteCount'), 'DESC'],
                ['updatedAt', 'DESC'],
                ['id', 'DESC'],
            ];
        }
        else if (typeOrder === 'newest') {
            order = [
                ['updatedAt', 'DESC'],
            ];
        }
        else if (typeOrder === 'oldest') {
            order = [
                ['createdAt', 'ASC']
            ];
        }
        else {
            order = [
                [sequelize.literal('voteCount'), 'DESC'],
                ['updatedAt', 'DESC'],
                ['id', 'DESC'],
            ];
        }

        const offset = (page - 1) * limit;
        const { count, rows } = await Post.findAndCountAll({
            where: {
                post_type_id: 2,
                parent_question_id: idQuestion,
            },
            attributes: {
                include: [
                    [
                        // Subquery tính tổng số vote cho mỗi answer
                        sequelize.literal(`(
                    SELECT 
                        IFNULL(SUM(CASE WHEN vote_type_id = 1 THEN 1 WHEN vote_type_id = 2 THEN -1 ELSE 0 END), 0)
                    FROM vote_post
                    WHERE vote_post.post_id = Post.id
                    )`),
                        'voteCount'
                    ]
                ]
            },
            order: order,
            offset: offset,
            limit: limit,
        });
        const totalPages = Math.ceil(count / limit);
        const formattedRows = rows.map(row => {
            const plainRow = row.get({ plain: true });
            plainRow.askedTime = dayjs(plainRow.createdAt).format('D MMM, YYYY [a]t H:mm');
            plainRow.editedTime = dayjs(plainRow.updatedAt).format('D MMM, YYYY [a]t H:mm');
            return plainRow;
        });
        return {
            EC: 0,
            EM: 'Get list answers pagination succeed',
            DT: {
                totalRows: count,
                totalPages: totalPages,
                answers: formattedRows
            }
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }

}

const handleCreateAnswer = async (idUser, idQuestion, idPostType, contentAnswer, contentPlainAnswer, postImage) => {
    try {
        const answer = await Post.create({
            created_by_user_id: idUser,
            parent_question_id: idQuestion,
            post_type_id: idPostType,
            post_details: contentAnswer,
            post_plain_details: contentPlainAnswer,
            post_status: true,
        });

        const idAnswer = answer?.dataValues?.id;

        const dataImagePost = await handleCreateImagesForPost(idAnswer, postImage);
        if (dataImagePost && dataImagePost.EC === 0) {
            const dataEditPost = await handleEditPost(idUser, idAnswer, '', contentAnswer, contentPlainAnswer, '', postImage);
            if (dataEditPost && dataEditPost.EC === 0) {
                await Edit.update(
                    {
                        edit_status: 1,
                    },
                    {
                        where: {
                            id: dataEditPost.DT,
                        },
                    },
                );
                const dataPost = await Post.findOne({
                    where: {
                        id: idQuestion,
                    },
                });
                if (dataPost.created_by_user_id !== idUser) {
                    const dataNotifyAuthorPost = await handleNotifyForAuthorPost(idQuestion, "Trả lời", "trả lời");
                    if (dataNotifyAuthorPost?.EC !== 0) {
                        return {
                            EC: 3,
                            EM: dataNotifyAuthorPost.EM,
                        };
                    }
                }
                const dataNotifyUserFollowingPost = await handleNotifyForUserFollowingPost(idQuestion, +idUser, 'Trả lời', 'trả lời');
                if (dataNotifyUserFollowingPost?.EC === 0) {
                    return {
                        EC: 0,
                        EM: "Create answer succeed",
                    };
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
                    EC: 1,
                    EM: dataEditPost.EM,
                };
            }
        }
        else {
            return {
                EC: 1,
                EM: dataImagePost.EM,
            };
        }

    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }

}

const handleAcceptAnswer = async (idQuestion, idAnswer) => {
    try {
        const question = await Post.findOne(
            {
                where: { id: idQuestion },
                attributes: ['created_by_user_id', 'accepted_answer_id'],
            }
        );
        const answer = await Post.findOne(
            {
                where: { id: idAnswer },
                attributes: ['created_by_user_id'],
            }
        );
        if (question.accepted_answer_id) {
            const dataUnacceptAnswer = await handleUnacceptedAnswer(idQuestion);
            if (dataUnacceptAnswer?.EC !== 0) {
                return {
                    EC: 3,
                    EM: dataUnacceptAnswer.EM,
                };
            }
        }
        await Post.update(
            { accepted_answer_id: idAnswer },
            {
                where: {
                    id: idQuestion,
                },
            },
        );
        if (question.created_by_user_id !== answer.created_by_user_id) {
            const dataNotifyAuthorPost = await handleNotifyForAuthorPost(idAnswer, "Chấp nhận", "chấp nhận");
            if (dataNotifyAuthorPost?.EC !== 0) {
                return {
                    EC: 3,
                    EM: dataNotifyAuthorPost.EM,
                };
            }
            const dataIncreaseReputationAuthorAnswer = await handleIncreaseReputationForAuthorPost(idAnswer, 15);
            if (dataIncreaseReputationAuthorAnswer?.EC === 0) {
                const dataIncreaseReputationAuthorQuestion = await handleIncreaseReputationForAuthorPost(idQuestion, 2);
                if (dataIncreaseReputationAuthorQuestion?.EC !== 0) {
                    return {
                        EC: 2,
                        EM: dataIncreaseReputationAuthorQuestion.EM
                    }
                }
            }
            else {
                return {
                    EC: 2,
                    EM: dataIncreaseReputationAuthorAnswer.EM
                }
            }
        }
        const dataNotifyUserFollowingPost = await handleNotifyForUserFollowingPost(idQuestion,
            +answer.created_by_user_id, 'Chấp nhận', 'chấp nhận câu trả lời');
        if (dataNotifyUserFollowingPost?.EC === 0) {
            return {
                EC: 0,
                EM: "Accept answer succeed",
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

const handleUnacceptedAnswer = async (idQuestion) => {
    try {
        const question = await Post.findOne(
            {
                where: { id: idQuestion },
                attributes: ['created_by_user_id', 'accepted_answer_id'],
            }
        );
        const answer = await Post.findOne(
            {
                where: { id: question.accepted_answer_id },
                attributes: ['created_by_user_id'],
            }
        );

        if (answer.created_by_user_id !== question.created_by_user_id) {
            const dataDEcreaseReputationAuthorQuestion = await handleDecreaseReputationForAuthorPost(idQuestion, 2)
            if (dataDEcreaseReputationAuthorQuestion?.EC === 0) {
                const dataDEcreaseReputationAuthorAnswer = await handleDecreaseReputationForAuthorPost(question.accepted_answer_id, 15)
                if (dataDEcreaseReputationAuthorAnswer?.EC !== 0) {
                    return {
                        EC: 2,
                        EM: dataDEcreaseReputationAuthorAnswer.EM,
                    }
                }
            }
            else {
                return {
                    EC: 2,
                    EM: dataDEcreaseReputationAuthorQuestion.EM,
                }
            }
        }
        await Post.update(
            { accepted_answer_id: null },
            {
                where: {
                    id: idQuestion,
                },
            },
        );
        return {
            EC: 0,
            EM: "Unaccepted answer succeed",
        };
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleUpdateAnswer = async (idAnswer, postDetail, postStatus, postPlainDetail, postImage) => {
    try {
        await Post.update(
            {
                post_details: postDetail,
                post_status: postStatus,
                post_plain_details: postPlainDetail,
            },
            {
                where: {
                    id: idAnswer,
                },
            },
        );

        if (postImage && postImage.length > 0) {
            const dataDeleteImagesPost = await handleDeleteImagesForPost(idAnswer);
            if (dataDeleteImagesPost && dataDeleteImagesPost.EC === 0) {
                const dataImagesPost = await handleCreateImagesForPost(idAnswer, postImage);
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

        return {
            EC: 0,
            EM: "Update answer succeed",
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleDeleteAnswersForQuestion = async (idQuestion) => {
    try {
        const dataUnacceptedAnswer = await handleUnacceptedAnswer(idQuestion);
        if (dataUnacceptedAnswer && dataUnacceptedAnswer.EC === 0) {

            const dataListAnswers = await handleGetListAnswers(idQuestion);
            if (dataListAnswers && dataListAnswers.EC === 0) {
                const listAnswers = dataListAnswers.DT;
                listAnswers && listAnswers.length > 0 && await Promise.all(listAnswers.map(async (answer) => {

                    const dataDeleteCommentPost = await handleDeleteCommentsForPost(answer.id);
                    if (dataDeleteCommentPost && dataDeleteCommentPost.EC === 0) {

                        const dataDeleteImagesPost = await handleDeleteImagesForPost(answer.id);
                        if (dataDeleteImagesPost && dataDeleteImagesPost.EC === 0) {

                            const dataDeleteVotePost = await handleDeleteVotePost(answer.id);
                            if (dataDeleteVotePost && dataDeleteVotePost.EC === 0) {

                                await Post.destroy({
                                    where: {
                                        id: answer.id,
                                        post_type_id: 2,
                                    },
                                });
                            }
                            else {
                                return {
                                    EC: 2,
                                    EM: dataDeleteVotePost.EM,
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
                    else {
                        return {
                            EC: 4,
                            EM: dataDeleteCommentPost.EM,
                        }
                    }
                }))
                return {
                    EC: 0,
                    EM: "Delete answers for question succeed",
                }
            }
            else {
                return {
                    EC: 5,
                    EM: dataListAnswers.EM,
                }
            }
        }
        else {
            return {
                EC: 6,
                EM: dataUnacceptedAnswer.EM,
            }
        }

    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetPageNumberByAnswer = async (idAnswer, idQuestion, limit) => {
    try {
        const [results] = await sequelize.query(`
            SELECT COUNT(*) AS total
            FROM (
                SELECT p.id, p.updatedAt,
                    (SELECT IFNULL(SUM(
                        CASE WHEN vp.vote_type_id = 1 THEN 1
                             WHEN vp.vote_type_id = 2 THEN -1
                             ELSE 0 END
                    ), 0)
                     FROM vote_post vp
                     WHERE vp.post_id = p.id
                    ) AS voteCount
                FROM post p
                WHERE p.parent_question_id = ${idQuestion}
                  AND p.post_type_id = 2
                  AND p.post_status = TRUE
            ) t
            WHERE 
            (
                t.voteCount > (
                SELECT IFNULL(SUM(
                    CASE WHEN vp.vote_type_id = 1 THEN 1
                        WHEN vp.vote_type_id = 2 THEN -1
                        ELSE 0 END
                    ), 0)
                FROM vote_post vp
                WHERE vp.post_id = ${idAnswer}
                )
            )
            OR
            (
                t.voteCount = (
                SELECT IFNULL(SUM(
                    CASE WHEN vp.vote_type_id = 1 THEN 1
                        WHEN vp.vote_type_id = 2 THEN -1
                        ELSE 0 END
                    ), 0)
                FROM vote_post vp
                WHERE vp.post_id = ${idAnswer}
                )
                AND (
                  t.updatedAt > (SELECT p2.updatedAt FROM post p2 WHERE p2.id = ${idAnswer})
                  OR (t.updatedAt = (SELECT p2.updatedAt FROM post p2 WHERE p2.id = ${idAnswer}) AND t.id > ${idAnswer})
                )
            )   
        `
        );

        const offsetAnswers = parseInt(results[0].total || 0, 10);
        const pageNumber = Math.floor((offsetAnswers / limit) + 1);

        return {
            EC: 0,
            DT: pageNumber,
            EM: "Get page number by answer succeed",
        };
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetAmountAnswersByUser = async (idUser) => {
    try {
        const count = await Post.count({
            where: {
                created_by_user_id: idUser,
                post_type_id: 2,
                post_status: true,
            }
        });
        return {
            EC: 0,
            DT: count,
            EM: "Get amount answers by user succeed",
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetAnswersByUser = async (idUser) => {
    try {
        const answers = await Post.findAll({
            where: {
                created_by_user_id: idUser,
                post_type_id: 2,
                post_status: true,
            }
        });
        return {
            EC: 0,
            DT: answers,
            EM: "Get answers by user succeed",
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetAnswersByUserPagination = async (page, limit, idUser) => {
    try {
        const offset = (page - 1) * limit;
        const { count, rows } = await Post.findAndCountAll({
            where: {
                created_by_user_id: idUser,
                post_type_id: 2,
                post_status: true,
            },
            offset: offset,
            limit: limit,
        });

        const formattedRows = rows.map(row => {
            const plainRow = row.get({ plain: true });
            plainRow.askedTime = dayjs(plainRow.createdAt).format('D MMM, YYYY [a]t H:mm');
            plainRow.editedTime = dayjs(plainRow.updatedAt).format('D MMM, YYYY [a]t H:mm');
            plainRow.createdAt = dayjs(plainRow.createdAt).format('DD-MM-YYYY HH:mm:ss');
            plainRow.updatedAt = dayjs(plainRow.updatedAt).format('DD-MM-YYYY HH:mm:ss');
            return plainRow;
        });
        const totalPages = Math.ceil(count / limit);
        return {
            EC: 0,
            EM: 'Get answers by user succeed',
            DT: {
                totalRows: count,
                totalPages: totalPages,
                answers: formattedRows
            }
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetAnswers = async () => {
    try {
        const answers = await Post.findAll({
            where: {
                post_type_id: 2,
            },
        });
        return {
            EC: 0,
            EM: 'Get answers succeed',
            DT: answers
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetAnswersPagination = async (page, limit) => {
    try {
        const offset = (page - 1) * limit;

        const [dataAnswers] = await sequelize.query(`
            SELECT *,
                (SELECT IFNULL(SUM(CASE WHEN vote_type_id = 1 THEN 1 
                    WHEN vote_type_id = 2 THEN -1 ELSE 0 END), 0)
                FROM vote_post
                WHERE vote_post.post_id = Post.id) AS voteCount
            FROM user
            INNER JOIN post ON post.created_by_user_id = user.id
            WHERE post.post_type_id=2 
            ORDER BY post.updatedAt DESC, post.id DESC
            LIMIT ${limit} 
            OFFSET ${offset}
            `);

        const formattedDataAnswers = dataAnswers.map(item => {
            item.answeredTime = dayjs(item.createdAt).format('D MMM, YYYY [a]t H:mm');
            item.editedTime = dayjs(item.updatedAt).format('D MMM, YYYY [a]t H:mm');
            item.createdAt = dayjs(item.createdAt).format('DD-MM-YYYY HH:mm:ss');
            item.updatedAt = dayjs(item.updatedAt).format('DD-MM-YYYY HH:mm:ss');
            return item;
        });

        const count = await Post.count({
            where: {
                post_type_id: 2,
            },
        });
        const totalPages = Math.ceil(count / limit);

        return {
            EC: 0,
            EM: 'Get answers pagination succeed',
            DT: {
                totalRows: count,
                totalPages: totalPages,
                answers: formattedDataAnswers
            }
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

module.exports = {
    handleGetNumberAnswers, handleGetListAnswers, handleCreateAnswer,
    handleGetListAnswersPagination, handleAcceptAnswer, handleDeleteAnswersForQuestion,
    handleUnacceptedAnswer, handleGetAnswer, handleGetPageNumberByAnswer,
    handleGetAmountAnswersByUser, handleGetAnswersByUser, handleGetAnswersByUserPagination,
    handleGetAnswers, handleGetAnswersPagination, handleUpdateAnswer
}