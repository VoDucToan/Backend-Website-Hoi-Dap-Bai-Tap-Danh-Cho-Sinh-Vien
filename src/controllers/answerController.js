const { handleGetNumberAnswers, handleGetListAnswers, handleCreateAnswer } = require("../services/answerService");

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
    let idQuestion = req.params.idquestion;
    let answers = await handleGetListAnswers(idQuestion);
    return res.status(200).json(answers);
}

const createAnswer = async (req, res) => {
    const { idUser, idQuestion, contentAnswer } = req.body;
    const data = await handleCreateAnswer(idUser, idQuestion, 2, contentAnswer);
    return res.status(200).json(data);
}

module.exports = { getNumberAnswers, getListAnswers, createAnswer };