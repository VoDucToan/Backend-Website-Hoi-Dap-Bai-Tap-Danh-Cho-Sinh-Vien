const User_Privilege = require('../../models/User_Privilege');

const checkupVoteCommentPrivilege = async (req, res, next) => {
    const { idUser } = req.body;
    const upVotePostPrivilege = await User_Privilege.findOne({
        where: {
            user_id: idUser,
            privilege_id: 1,
        },
    });

    if (upVotePostPrivilege) {
        next();
    }
    else {
        return res.status(403).json({
            EC: -1,
            EM: "You must reach 2 reputation points to unlock up vote comment privilege"
        });
    }
}

module.exports = { checkupVoteCommentPrivilege };