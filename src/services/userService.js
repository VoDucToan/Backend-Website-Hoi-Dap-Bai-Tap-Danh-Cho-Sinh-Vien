const connection = require('../config/database');

const handleGetUser = async (idUser) => {
    let [results, fields] = await connection.query(`select * from user where id = ${idUser}`);
    return results;
}

const handleGetListUsers = async () => {
    let [results, fields] = await connection.query(`select * from user`);
    return results;
}

module.exports = { handleGetUser, handleGetListUsers }