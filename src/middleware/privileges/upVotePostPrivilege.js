const User_Privilege = require('../../models/User_Privilege');

const checkUpVotePostPrivilege = async (req, res, next) => {
    const { idUser } = req.body;
    const upVotePostPrivilege = await User_Privilege.findOne({
        where: {
            user_id: idUser,
            privilege_id: 3,
        },
    });

    if (upVotePostPrivilege) {
        next();
    }
    else {
        return res.status(403).json({
            EC: -1,
            EM: "You must reach 15 reputation points to unlock up vote post privilege"
        });
    }
}

module.exports = { checkUpVotePostPrivilege };