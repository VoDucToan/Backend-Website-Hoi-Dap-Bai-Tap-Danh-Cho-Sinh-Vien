const User_Privilege = require('../../models/User_Privilege');

const checkCommentPrivilege = async (req, res, next) => {
    const { idUser } = req.body;
    const commentPrivilege = await User_Privilege.findOne({
        where: {
            user_id: idUser,
            privilege_id: 2,
        },
    });

    if (commentPrivilege) {
        next();
    }
    else {
        return res.status(403).json({
            EC: -1,
            EM: "You must reach 20 reputation points to unlock comment privilege"
        });
    }
}

module.exports = { checkCommentPrivilege };