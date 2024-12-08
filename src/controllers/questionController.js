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
    const { idUser, postTitle, postDetail, imgDetail, imgTryExpect } = req.body;
    const data = await handleCreateQuestion(idUser, 1, postTitle, postDetail, imgDetail, imgTryExpect);
    return res.status(200).json(data);
}

module.exports = { getListQuestions, getQuestion, createQuestion }