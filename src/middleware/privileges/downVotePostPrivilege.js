const User_Privilege = require('../../models/User_Privilege');

const checkDownVotePostPrivilege = async (req, res, next) => {
    const { idUser } = req.body;
    const downVotePostPrivilege = await User_Privilege.findOne({
        where: {
            user_id: idUser,
            privilege_id: 4,
        },
    });

    if (downVotePostPrivilege) {
        next();
    }
    else {
        return res.status(403).json({
            EC: -1,
            EM: "You must reach 100 reputation points to unlock down vote post privilege"
        });
    }
}

module.exports = { checkDownVotePostPrivilege };