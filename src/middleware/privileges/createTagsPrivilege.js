const User_Privilege = require('../../models/User_Privilege');

const checkCreateTagsPrivilege = async (req, res, next) => {
    const { idUser } = req.body;
    const createTagsPrivilege = await User_Privilege.findOne({
        where: {
            user_id: idUser,
            privilege_id: 6,
        },
    });

    if (createTagsPrivilege) {
        next();
    }
    else {
        return res.status(403).json({
            EC: -1,
            EM: "You must reach 150 reputation points to unlock create tags privilege"
        });
    }
}

module.exports = { checkCreateTagsPrivilege };