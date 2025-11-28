const { handleGrantPrivilegesForUser } = require("../services/privilegeService")

const grantPrivilegesForUser = async (req, res) => {
    const { idUser } = req.body;
    const data = await handleGrantPrivilegesForUser(idUser)
    return res.status(200).json(data);
}

module.exports = {
    grantPrivilegesForUser
}