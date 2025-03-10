const connection = require('../config/database');

const handleGetListQuestions = async () => {
    let typeQuestion = 1;
    let [results, fields] = await connection.query(`select * from post where post_type_id = ${typeQuestion}`);
    return results;
}

const handleGetQuestion = async (idQuestion) => {
    let [results, fields] = await connection.query(`select * from post where post_type_id = 1 and id = ${idQuestion}`);
    return {
        EC: 0,
        EM: "Get question succeed",
        DT: results[0]
    };
}

const handleCreateQuestion = async (idUser, idPostType, postTitle, postDetail, postImage) => {
    let [results] = await connection.query(`INSERT INTO post (created_by_user_id, post_type_id, post_title, post_details, post_image)
                                                    VALUES (${idUser}, ${idPostType}, N'${postTitle}', N'${postDetail}', N'${postImage}')`);
    console.log('result id', results.insertId);
    return {
        EC: 0,
        EM: "Create question succeed",
    };
}

module.exports = { handleGetListQuestions, handleGetQuestion, handleCreateQuestion }