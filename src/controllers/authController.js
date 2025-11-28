const { handleCreateUser, handleLoginUser, handleVerifyEmail, handleRefreshAccessToken, handleLogout } = require("../services/authService");

const createUser = async (req, res) => {
    const { display_name, email_address, password } = req.body;
    const data = await handleCreateUser(display_name, email_address, password);
    return res.status(200).json(data);
}

const loginUser = async (req, res) => {
    const { email_address, password } = req.body;
    const data = await handleLoginUser(email_address, password, res);
    return res.status(200).json(data);
}

const getAccount = (req, res) => {
    return res.status(200).json(req.user);
}

const verifyEmail = async (req, res) => {
    const { token } = req.body;
    const data = await handleVerifyEmail(token);
    return res.status(200).json(data);
}

const refreshAccessToken = async (req, res) => {
    const data = await handleRefreshAccessToken(req, res);
    return res.status(200).json(data);
}

const logout = async (req, res) => {
    const data = await handleLogout(req, res);
    return res.status(200).json(data);
}

module.exports = {
    createUser, loginUser, getAccount, verifyEmail,
    refreshAccessToken, logout
};