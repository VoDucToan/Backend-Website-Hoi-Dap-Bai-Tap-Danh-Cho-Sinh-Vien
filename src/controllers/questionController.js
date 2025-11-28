const { handleUpdateQuestion } = require("../services/editPostService");
const { handleGetListQuestions, handleGetQuestion, handleCreateQuestion,
    handleGetListQuestionsPagination, handleDeleteQuestion,
    handleGetQuestionByAnswer,
    handleGetAmountQuestionsByUser,
    handleGetQuestionsByUser,
    handleGetQuestionsByUserPagination,
} = require("../services/questionService");
const { handleGetNumberQuestionByTag } = require("../services/tagService");

const getListQuestions = async (req, res) => {
    const { page, limit, status, noAnswers, noUpVoted, noAcceptedAnswer,
        daysOld, typeOrder, watchedTags, ignoredTags
    } = req.query;
    if (+page && +limit) {
        const data = await handleGetListQuestionsPagination(+page, +limit, status, noAnswers,
            noUpVoted, noAcceptedAnswer, daysOld, typeOrder, watchedTags, ignoredTags
        );
        return res.status(200).json(data);
    }
    else {
        let listQuestions = await handleGetListQuestions(status);
        return res.status(200).json(listQuestions);
    }
}

const getQuestion = async (req, res) => {
    let idQuestion = req.params.idquestion;
    let question = await handleGetQuestion(idQuestion);
    return res.status(200).json(question);
}

const getQuestionByAnswer = async (req, res) => {
    let idAnswer = req.params.idanswer;
    const data = await handleGetQuestionByAnswer(idAnswer);
    return res.status(200).json(data);
}

const createQuestion = async (req, res) => {
    if (req?.files && req.files.length > 0) {
        req.files.map((file) => {
            if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
                return res.status(200).json({
                    EC: 1,
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

    const { idUser, postTitle, postDetail, postPlainDetail, listIdTags } = req.body;
    const data = await handleCreateQuestion(idUser, 1, postTitle, postDetail, postPlainDetail, images, listIdTags);
    return res.status(200).json(data);
}

const deleteQuestion = async (req, res) => {
    let idQuestion = req.params.idquestion;
    const data = await handleDeleteQuestion(idQuestion);
    return res.status(200).json(data);
}

const updateQuestion = async (req, res) => {
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

    const { idQuestion, postTitle, postDetail, postPlainDetail, listIdTags, postStatus } = req.body;
    const data = await handleUpdateQuestion(idQuestion, postTitle, postDetail, postPlainDetail, images, listIdTags, postStatus);
    return res.status(200).json(data);
}

const getNumberQuestionByTag = async (req, res) => {
    let idTag = req.params.idtag;
    const data = await handleGetNumberQuestionByTag(idTag);
    return res.status(200).json(data);
}

const getAmountQuestionsByUser = async (req, res) => {
    let idUser = req.params.idUser;
    const data = await handleGetAmountQuestionsByUser(idUser);
    return res.status(200).json(data);
}

const getQuestionsByUser = async (req, res) => {
    let idUser = req.params.idUser;
    const { page, limit
    } = req.query;
    if (+page && +limit) {
        const data = await handleGetQuestionsByUserPagination(+page, +limit, idUser);
        return res.status(200).json(data);
    }
    else {
        const data = await handleGetQuestionsByUser(idUser);
        return res.status(200).json(data);
    }
}

module.exports = {
    getListQuestions, getQuestion, createQuestion, deleteQuestion,
    updateQuestion, getQuestionByAnswer, getNumberQuestionByTag,
    getAmountQuestionsByUser, getQuestionsByUser
}