const { handleGetUser, handleGetListUsers } = require("../services/userService");

const getUser = async (req, res) => {
    let idUser = req.params.iduser;
    let user = await handleGetUser(idUser);
    return res.status(200).json({
        EC: 0,
        EM: "Get user succeed",
        DT: user
    });
}

const getListUsers = async (req, res) => {
    let users = await handleGetListUsers();
    return res.status(200).json(users);
}

module.exports = { getUser, getListUsers }