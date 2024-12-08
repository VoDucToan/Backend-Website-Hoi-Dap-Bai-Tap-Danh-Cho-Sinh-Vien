const connection = require('../config/database');

const handleGetNumberAnswers = async (idQuestion) => {
    let [results, fields] = await connection.query(`select * from post where post_type_id = 2 and parent_question_id = ${idQuestion}`);
    return results.length;
}

const handleGetListAnswers = async (idQuestion) => {
    let [results, fields] = await connection.query(`select * from post where post_type_id = 2 and parent_question_id = ${idQuestion}`);
    return results;
}

const handleCreateAnswer = async (idUser, idQuestion, idPostType, contentAnswer) => {
    let [results, fields] = await connection.query(`INSERT INTO post (created_by_user_id, parent_question_id, post_type_id, post_details)
                                                    VALUES (${idUser}, ${idQuestion}, ${idPostType}, N'${contentAnswer}')`);
    return {
        EC: 0,
        EM: "Create answer succeed",
    };
}

module.exports = { handleGetNumberAnswers, handleGetListAnswers, handleCreateAnswer }