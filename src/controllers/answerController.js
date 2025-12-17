const { handleGetNumberAnswers, handleGetListAnswers, handleCreateAnswer, handleGetListAnswersPagination, handleAcceptAnswer, handleDeleteAnswersForQuestion, handleUnacceptedAnswer, handleGetAnswer, handleGetPageNumberByAnswer, handleGetAmountAnswersByUser, handleGetAnswersByUser, handleGetAnswersByUserPagination, handleGetAnswers, handleGetAnswersPagination, handleUpdateAnswer } = require("../services/answerService");
const cloudinary = require("../config/cloudinary");
const pLimit = require("p-limit");

const getNumberAnswers = async (req, res) => {
    let idQuestion = req.params.idquestion;
    let countAnswer = await handleGetNumberAnswers(idQuestion);
    return res.status(200).json({
        EC: 0,
        EM: "Get number answers succeed",
        DT: countAnswer
    });
}

const getListAnswers = async (req, res) => {
    const { page, limit, typeOrder } = req.query;
    let idQuestion = req.params.idquestion;
    if (+page && +limit) {
        const data = await handleGetListAnswersPagination(idQuestion, +page, +limit, typeOrder);
        return res.status(200).json(data);
    }
    else {
        let answers = await handleGetListAnswers(idQuestion);
        return res.status(200).json(answers);
    }

}

const getAnswer = async (req, res) => {
    let idAnswer = req.params.idanswer;
    const data = await handleGetAnswer(idAnswer);
    return res.status(200).json(data);
}

const createAnswer = async (req, res) => {
    if (req?.files && req.files.length > 0) {
        for (const file of req.files) {
            if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|webp|WEBP)$/)) {
                return res.status(200).json({
                    EC: 1,
                    EM: 'Only image files (jpg, jpeg, png) are allowed!'
                });
            };
        }
    }

    // let images = null;
    // if (req?.files && req.files.length > 0) {
    //     images = req.files.map((file) => {
    //         return file.filename;
    //     })
    // }

    const limit = pLimit(5);
    const imagesToUpload = req.files.map((file) => {
        return limit(async () => {
            const result = await cloudinary.uploader.upload(file.path);
            return result;
        })
    })

    const uploads = await Promise.all(imagesToUpload);
    const images = uploads.map(image => image.secure_url);

    const { idUser, idQuestion, contentAnswer, contentPlainAnswer } = req.body;
    const data = await handleCreateAnswer(+idUser, idQuestion, 2, contentAnswer, contentPlainAnswer, images);
    return res.status(200).json(data);
}

const acceptAnswer = async (req, res) => {
    const { idAnswer, idQuestion } = req.body;
    const data = await handleAcceptAnswer(idQuestion, idAnswer);
    return res.status(200).json(data);
}

const deleteAnswersForQuestion = async (req, res) => {
    let idQuestion = req.params.idquestion;
    const data = await handleDeleteAnswersForQuestion(idQuestion);
    return res.status(200).json(data);
}

const unacceptedAnswer = async (req, res) => {
    const { idQuestion } = req.body;
    const data = await handleUnacceptedAnswer(idQuestion);
    return res.status(200).json(data);
}

const updateAnswer = async (req, res) => {
    if (req?.files && req.files.length > 0) {
        for (const file of req.files) {
            if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|webp|WEBP)$/)) {
                return res.status(200).json({
                    EC: 1,
                    EM: 'Only image files (jpg, jpeg, png) are allowed!'
                });
            };
        }
    }

    // let images = null;
    // if (req?.files && req.files.length > 0) {
    //     images = req.files.map((file) => {
    //         return file.filename;
    //     })
    // }

    const limit = pLimit(5);
    const imagesToUpload = req.files.map((file) => {
        return limit(async () => {
            const result = await cloudinary.uploader.upload(file.path);
            return result;
        })
    })

    const uploads = await Promise.all(imagesToUpload);
    const images = uploads.map(image => image.secure_url);

    const { idAnswer, postDetail, postStatus, postPlainDetail } = req.body;
    const data = await handleUpdateAnswer(idAnswer, postDetail, postStatus, postPlainDetail, images);
    return res.status(200).json(data);
}

const getPageNumberByAnswer = async (req, res) => {
    const { idAnswer, idQuestion, limit } = req.query;
    const data = await handleGetPageNumberByAnswer(idAnswer, idQuestion, limit);
    return res.status(200).json(data);
}

const getAmountAnswersByUser = async (req, res) => {
    let idUser = req.params.idUser;
    const data = await handleGetAmountAnswersByUser(idUser);
    return res.status(200).json(data);
}

const getAnswersByUser = async (req, res) => {
    let idUser = req.params.idUser;
    const { page, limit
    } = req.query;
    if (+page && +limit) {
        const data = await handleGetAnswersByUserPagination(+page, +limit, idUser);
        return res.status(200).json(data);
    }
    else {
        const data = await handleGetAnswersByUser(idUser);
        return res.status(200).json(data);
    }
}

const getAnswers = async (req, res) => {
    const { page, limit } = req.query;
    if (+page && +limit) {
        const data = await handleGetAnswersPagination(+page, +limit);
        return res.status(200).json(data);
    }
    else {
        const data = await handleGetAnswers();
        return res.status(200).json(data);
    }
}

module.exports = {
    getNumberAnswers, getListAnswers, createAnswer, acceptAnswer, deleteAnswersForQuestion,
    unacceptedAnswer, getAnswer, getPageNumberByAnswer, getAmountAnswersByUser,
    getAnswersByUser, getAnswers, updateAnswer
};