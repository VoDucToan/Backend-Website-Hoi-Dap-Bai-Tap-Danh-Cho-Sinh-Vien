const Privilege = require("../models/Privilege");
const User = require("../models/User");
const User_Privilege = require("../models/User_Privilege");
const { handleNotifyForUser } = require("./notificationService");

const handleGrantPrivilegesForUser = async (idUser) => {
    try {
        const user = await User.findOne({
            where: {
                id: idUser,
            },
            attributes: ['reputation'],
        });

        const privileges = await Privilege.findAll();
        for (const privilege of privileges) {
            if (user.reputation >= privilege.privilege_reputation) {
                const userPrivilege = await User_Privilege.findOne({
                    where: {
                        user_id: idUser,
                        privilege_id: privilege.id,
                    },
                });
                if (!userPrivilege) {
                    await User_Privilege.create({
                        privilege_id: privilege.id,
                        user_id: idUser,
                    });
                    const dataNotifyUser = await handleNotifyForUser(idUser, "Chức năng", `Bạn đã mở khóa chức năng ${privilege.privilege_type}`, "/", null);
                    if (dataNotifyUser?.EC !== 0) {
                        return {
                            EC: 2,
                            EM: dataNotifyUser.EM,
                        }
                    }
                }
            }
        }

        return {
            EC: 0,
            EM: 'Grant privileges for user succeed',
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

module.exports = {
    handleGrantPrivilegesForUser
}