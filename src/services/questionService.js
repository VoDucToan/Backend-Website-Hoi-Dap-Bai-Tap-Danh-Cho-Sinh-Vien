const dayjs = require('dayjs');
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime)
const connection = require('../config/database');
const Post = require('../models/Post');
const Post_Type = require('../models/Post_Type');
const { handleDeleteTagsQuestion, handleInsertTagsQuestion } = require('./tagService');
const { handleDeleteVotePost } = require('./voteService');
const Image = require('../models/Image_Post');
const { handleDeleteImagesForPost, handleCreateImagesForPost } = require('./imageService');
const { handleDeleteCommentsForPost } = require('./commentService');
const { handleDeleteAnswersForQuestion, handleGetAnswer } = require('./answerService');
const Edit = require('../models/Edit_Post');
const { handleEditPost } = require('./editPostService');
const { Op } = require('sequelize');
const sequelize = require('../config/connectDB');

const handleGetListQuestions = async (postStatus) => {
    let typeQuestion = 1;
    const where = {
        post_type_id: typeQuestion,
    }
    if (postStatus !== undefined && postStatus !== '' && postStatus !== 'undefined') {
        const s = postStatus.toLowerCase();
        if (s === "true") {
            postStatus = true;
        }
        else if (s === "false") {
            postStatus = false;
        }
        where.post_status = postStatus;
    }
    const listQuestions = await Post.findAll({
        where
    });
    const formattedListQuestion = listQuestions.map(question => {
        const plainQuestion = question.get({ plain: true });
        plainQuestion.askedTime = dayjs(plainQuestion.createdAt).format('D MMM, YYYY [a]t H:mm');
        plainQuestion.editedTime = dayjs(plainQuestion.updatedAt).format('D MMM, YYYY [a]t H:mm');
        plainQuestion.createdAt = dayjs(plainQuestion.createdAt).format('DD-MM-YYYY HH:mm:ss');
        plainQuestion.updatedAt = dayjs(plainQuestion.updatedAt).format('DD-MM-YYYY HH:mm:ss');
        return plainQuestion;
    });
    return formattedListQuestion;
}

const handleGetListQuestionsPagination = async (page, limit, postStatus, noAnswers, noUpVoted, noAcceptedAnswer,
    daysOld, typeOrder, watchedTags, ignoredTags
) => {
    try {
        let typeQuestion = 1;
        const offset = (page - 1) * limit;
        const subQuery = [];
        const where = {
            post_type_id: typeQuestion,
            [Op.and]: subQuery,
        }

        if (postStatus !== undefined && postStatus !== '' && postStatus !== 'undefined') {
            const s = postStatus.toLowerCase();
            if (s === "true") {
                postStatus = true;
            }
            else if (s === "false") {
                postStatus = false;
            }
            where.post_status = postStatus;
        }

        if (noAnswers !== undefined && noAnswers !== '' && noAnswers !== 'undefined') {
            const s = noAnswers.toLowerCase();
            if (s === "true") {
                noAnswers = true;
            }
            else if (s === "false") {
                noAnswers = false;
            }

            if (noAnswers) {
                subQuery.push(sequelize.literal(`
                    NOT EXISTS (
                        SELECT 1 FROM post p2
                        WHERE p2.parent_question_id = post.id
                          AND p2.post_type_id = 2
                          AND p2.post_status = TRUE
                    )
                `))
            }
        }

        if (noUpVoted !== undefined && noUpVoted !== '' && noUpVoted !== 'undefined') {
            const s = noUpVoted.toLowerCase();
            if (s === "true") {
                noUpVoted = true;
            }
            else if (s === "false") {
                noUpVoted = false;
            }

            if (noUpVoted) {
                subQuery.push(sequelize.literal(`
                        (SELECT IFNULL(SUM(
                        CASE WHEN vp.vote_type_id = 1 THEN 1
                             WHEN vp.vote_type_id = 2 THEN -1
                             ELSE 0 END
                        ), 0)
                        FROM vote_post vp
                        WHERE vp.post_id = post.id
                        ) <= 0 
                `));
            }
        }

        if (noAcceptedAnswer !== undefined && noAcceptedAnswer !== '' && noAcceptedAnswer !== 'undefined') {
            const s = noAcceptedAnswer.toLowerCase();
            if (s === "true") {
                noAcceptedAnswer = true;
            }
            else if (s === "false") {
                noAcceptedAnswer = false;
            }

            if (noAcceptedAnswer) {
                where.accepted_answer_id = {
                    [Op.is]: null,
                };
            }
        }

        if (daysOld !== undefined && daysOld !== '' && daysOld !== 'undefined') {
            daysOld = Number(daysOld);
            let specificDaysOld = new Date();
            specificDaysOld.setDate(specificDaysOld.getDate() - daysOld);
            where.updatedAt = {
                [Op.gt]: specificDaysOld,
            };
        }

        if (watchedTags !== undefined && watchedTags !== '' && watchedTags !== 'undefined') {
            subQuery.push(sequelize.literal(`
                        EXISTS ( 
                            SELECT 1
                            FROM (
                                SELECT * 
                                FROM post_tag
                                WHERE post_tag.post_id = post.id
                                ) as tagQuestion
                            WHERE tagQuestion.tag_id in ${watchedTags}
                        )
                `));
        }

        if (ignoredTags !== undefined && ignoredTags !== '' && ignoredTags !== 'undefined') {
            subQuery.push(sequelize.literal(`
                        NOT EXISTS ( 
                            SELECT 1
                            FROM (
                                SELECT * 
                                FROM post_tag
                                WHERE post_tag.post_id = post.id
                                ) as tagQuestion
                            WHERE tagQuestion.tag_id in ${ignoredTags}
                        )
                `));
        }

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
                ['id', 'DESC'],
            ];
        }
        else if (typeOrder === 'oldest') {
            order = [
                ['createdAt', 'ASC'],
                ['id', 'DESC'],
            ];
        }
        else if (typeOrder === 'active') {
            order = [
                ['createdAt', 'ASC'],
                ['id', 'DESC'],
            ];
        }
        else if (typeOrder === 'answer') {
            order = [
                [sequelize.literal('amountAnswers'), 'DESC'],
                ['updatedAt', 'DESC'],
                ['id', 'DESC'],
            ];
        }
        else {
            order = [
                [sequelize.literal('voteCount'), 'DESC'],
                ['updatedAt', 'DESC'],
                ['id', 'DESC'],
            ];
        }

        const { count, rows } = await Post.findAndCountAll({
            attributes: {
                include: [
                    [
                        sequelize.literal(`(
                    SELECT 
                        IFNULL(SUM(CASE WHEN vote_type_id = 1 THEN 1 WHEN vote_type_id = 2 THEN -1 ELSE 0 END), 0)
                    FROM vote_post
                    WHERE vote_post.post_id = post.id
                    )`),
                        'voteCount'
                    ],
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*) FROM post p2
                            WHERE p2.parent_question_id = post.id
                            AND p2.post_type_id = 2
                            AND p2.post_status = TRUE
                    )`),
                        'amountAnswers'
                    ]
                ]
            },
            where,
            order,
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
            EM: 'Get list questions pagination succeed',
            DT: {
                totalRows: count,
                totalPages: totalPages,
                questions: formattedRows
            }

        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }

}

const handleGetQuestion = async (idQuestion) => {
    try {
        const data = await Post.findAll({
            where: {
                post_type_id: 1,
                id: idQuestion,
            },
        });
        const question = data[0];
        const plainQuestion = question.get({ plain: true });
        plainQuestion.createdAtAgo = dayjs(plainQuestion.createdAt).fromNow();
        plainQuestion.updatedAtAgo = dayjs(plainQuestion.updatedAt).fromNow();
        plainQuestion.askedTime = dayjs(plainQuestion.createdAt).format('D MMM, YYYY [a]t H:mm');
        plainQuestion.editedTime = dayjs(plainQuestion.updatedAt).format('D MMM, YYYY [a]t H:mm');

        let [results, fields] = await connection.query(`select * from post where post_type_id = 2 and parent_question_id = ${idQuestion}`);
        const numberAnswers = results.length;
        plainQuestion.numberAnswers = numberAnswers;

        return {
            EC: 0,
            EM: "Get question succeed",
            DT: plainQuestion
        };
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetQuestionByAnswer = async (idAnswer) => {
    try {
        const dataAnswer = await handleGetAnswer(idAnswer);
        if (dataAnswer && dataAnswer.EC === 0) {
            const dataQuestion = await handleGetQuestion(dataAnswer.DT.parent_question_id);
            if (dataQuestion && dataQuestion.EC === 0) {
                return {
                    EC: 0,
                    EM: "Get question by answer succeed",
                    DT: dataQuestion.DT
                };
            }
            else {
                return {
                    EC: 3,
                    EM: dataQuestion.EM,
                };
            }
        }
        else {
            return {
                EC: 2,
                EM: dataAnswer.EM,
            };
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }

}

const handleCreateQuestion = async (idUser, idPostType, postTitle, postDetail, postPlainDetail, postImage, listIdTags) => {
    try {
        const question = await Post.create({
            created_by_user_id: idUser,
            post_type_id: idPostType,
            post_title: postTitle,
            post_details: postDetail,
            post_plain_details: postPlainDetail,
        });

        const idQuestion = question?.dataValues?.id;
        const dataImagePost = await handleCreateImagesForPost(idQuestion, postImage);
        if (dataImagePost && dataImagePost.EC === 0) {
            const dataTagsQuestion = await handleInsertTagsQuestion(idQuestion, listIdTags);
            if (dataTagsQuestion && dataTagsQuestion.EC === 0) {
                const dataEditPost = await handleEditPost(idUser, idQuestion, postTitle, postDetail, postPlainDetail, "", postImage, listIdTags);
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
                    return {
                        EC: 0,
                        EM: "Create question succeed",
                    };
                }
                else {
                    return {
                        EC: 4,
                        EM: dataEditPost.EM,
                    };
                }
            }
            else {
                return {
                    EC: 3,
                    EM: dataTagsQuestion.EM,
                };
            }

        }
        else {
            return {
                EC: 2,
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

const handleDeleteQuestion = async (idQuestion) => {
    try {
        const dataDeleteAnswersQuestion = await handleDeleteAnswersForQuestion(idQuestion);
        if (dataDeleteAnswersQuestion && dataDeleteAnswersQuestion.EC === 0) {

            const dataDeleteCommentPost = await handleDeleteCommentsForPost(idQuestion);
            if (dataDeleteCommentPost && dataDeleteCommentPost.EC === 0) {

                const dataDeleteImagesPost = await handleDeleteImagesForPost(idQuestion);
                if (dataDeleteImagesPost && dataDeleteImagesPost.EC === 0) {

                    const dataDeleteTagsQuestion = await handleDeleteTagsQuestion(idQuestion);
                    if (dataDeleteTagsQuestion && dataDeleteTagsQuestion.EC === 0) {

                        const dataDeleteVotePost = await handleDeleteVotePost(idQuestion);
                        if (dataDeleteVotePost && dataDeleteVotePost.EC === 0) {

                            await Post.destroy({
                                where: {
                                    id: idQuestion,
                                    post_type_id: 1,
                                },
                            });
                            return {
                                EC: 0,
                                EM: "Delete question succeed",
                            }
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
                            EM: dataDeleteTagsQuestion.EM,
                        }
                    }
                }
                else {
                    return {
                        EC: 4,
                        EM: dataDeleteImagesPost.EM,
                    }
                }
            }
            else {
                return {
                    EC: 5,
                    EM: dataDeleteCommentPost.EM,
                }
            }
        }
        else {
            return {
                EC: 6,
                EM: dataDeleteAnswersQuestion.EM,
            }
        }

    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetAmountQuestionsByUser = async (idUser) => {
    try {
        const count = await Post.count({
            where: {
                created_by_user_id: idUser,
                post_type_id: 1,
                post_status: true,
            }
        });
        return {
            EC: 0,
            DT: count,
            EM: "Get amount questions by user succeed",
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetQuestionsByUser = async (idUser) => {
    try {
        const questions = await Post.findAll({
            where: {
                created_by_user_id: idUser,
                post_type_id: 1,
                post_status: true,
            }
        });

        const formattedQuestions = questions.map(question => {
            const plainQuestion = question.get({ plain: true });
            plainQuestion.askedTime = dayjs(plainQuestion.createdAt).format('D MMM, YYYY [a]t H:mm');
            plainQuestion.editedTime = dayjs(plainQuestion.updatedAt).format('D MMM, YYYY [a]t H:mm');
            plainQuestion.createdAt = dayjs(plainQuestion.createdAt).format('DD-MM-YYYY HH:mm:ss');
            plainQuestion.updatedAt = dayjs(plainQuestion.updatedAt).format('DD-MM-YYYY HH:mm:ss');
            return plainQuestion;
        });

        return {
            EC: 0,
            DT: formattedQuestions,
            EM: "Get questions by user succeed",
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetQuestionsByUserPagination = async (page, limit, idUser) => {
    try {
        const offset = (page - 1) * limit;
        const { count, rows } = await Post.findAndCountAll({
            where: {
                created_by_user_id: idUser,
                post_type_id: 1,
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
            EM: 'Get questions by user succeed',
            DT: {
                totalRows: count,
                totalPages: totalPages,
                questions: formattedRows
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
    handleGetListQuestions, handleGetQuestion, handleCreateQuestion, handleGetListQuestionsPagination,
    handleDeleteQuestion, handleGetQuestionByAnswer, handleGetAmountQuestionsByUser,
    handleGetQuestionsByUser, handleGetQuestionsByUserPagination
}
