const connection = require('../config/database');

const handleGetListComments = async (idPost) => {
    let [results, fields] = await connection.query(`select * from comment where post_id = ${idPost}`);
    return {
        EC: 0,
        EM: "Get list comment for post succeed",
        DT: results
    };
}

module.exports = { handleGetListComments };