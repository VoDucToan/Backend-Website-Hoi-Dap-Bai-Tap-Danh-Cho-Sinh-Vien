const { handleGetListQuestions, handleGetQuestion, handleCreateQuestion } = require("../services/questionService");

const getListQuestions = async (req, res) => {
    let users = await handleGetListQuestions();
    return res.status(200).json(users);
}

const getQuestion = async (req, res) => {
    let idQuestion = req.params.idquestion;
    let question = await handleGetQuestion(idQuestion);
    return res.status(200).json(question);
}

const createQuestion = async (req, res) => {
    if (req?.file) {
        if (!req.file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
            return res.status(200).json({
                EC: 1,
                EM: 'Only image files (jpg, jpeg, png) are allowed!'
            });
        };
    }
    const image = req?.file?.filename ?? null;
    const { idUser, postTitle, postDetail } = req.body;
    const data = await handleCreateQuestion(idUser, 1, postTitle, postDetail, image);
    return res.status(200).json(data);
}

module.exports = { getListQuestions, getQuestion, createQuestion }