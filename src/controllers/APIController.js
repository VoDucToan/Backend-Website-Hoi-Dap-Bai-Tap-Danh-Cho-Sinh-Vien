const { handleGetAllUsers } = require('../services/CRUDService');

const getAllUsers = async (req, res) => {
    let users = await handleGetAllUsers();
    return res.status(200).json({
        message: 'oke',
        data: users
    });
}

module.exports = { getAllUsers };