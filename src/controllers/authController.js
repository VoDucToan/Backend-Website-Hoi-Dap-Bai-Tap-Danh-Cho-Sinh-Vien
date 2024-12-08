const { handleCreateUser, handleLoginUser } = require("../services/authService");

const createUser = async (req, res) => {
    const { display_name, email_address, password } = req.body;
    const data = await handleCreateUser(display_name, email_address, password);
    return res.status(200).json(data);
}

const loginUser = async (req, res) => {
    const { email_address, password } = req.body;
    const data = await handleLoginUser(email_address, password);
    return res.status(200).json(data);
}

const getAccount = (req, res) => {
    return res.status(200).json(req.user);
}

module.exports = { createUser, loginUser, getAccount };