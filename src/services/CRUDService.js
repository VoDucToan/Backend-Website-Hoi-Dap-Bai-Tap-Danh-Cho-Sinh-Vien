const connection = require('../config/database');

const handleGetAllUsers = async () => {
    let [results, fields] = await connection.query('select * from user');
    return results;
}

module.exports = { handleGetAllUsers };