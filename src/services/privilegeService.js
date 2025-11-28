const User = require("../models/User");
const User_Privilege = require("../models/User_Privilege");
const { handleNotifyForUser } = require("./notificationService");

const handleGrantPrivilegesForUser = async (idUser) => {
    try {
        const user = await User.findOne({
            where: {
                id: idUser,
            },
        });
        if (user.reputation >= 2) {
            const upVotePostPrivilege = await User_Privilege.findOne({
                where: {
                    user_id: idUser,
                    privilege_id: 1,
                },
            });
            if (!upVotePostPrivilege) {
                await User_Privilege.create({
                    privilege_id: 1,
                    user_id: idUser,
                });
                const dataNotifyUser = await handleNotifyForUser(idUser, "Chức năng", "Bạn đã mở khóa chức năng bình chọn cho bình luận", "/")
                if (dataNotifyUser?.EC !== 0) {
                    return {
                        EC: 2,
                        EM: dataNotifyUser.EM,
                    }
                }
            }
        }
        if (user.reputation >= 4) {
            const upVotePostPrivilege = await User_Privilege.findOne({
                where: {
                    user_id: idUser,
                    privilege_id: 2,
                },
            });
            if (!upVotePostPrivilege) {
                await User_Privilege.create({
                    privilege_id: 2,
                    user_id: idUser,
                });
                const dataNotifyUser = await handleNotifyForUser(idUser, "Chức năng", "Bạn đã mở khóa chức năng bình luận", "/")
                if (dataNotifyUser?.EC !== 0) {
                    return {
                        EC: 2,
                        EM: dataNotifyUser.EM,
                    }
                }
            }
        }
        if (user.reputation >= 15) {
            const upVotePostPrivilege = await User_Privilege.findOne({
                where: {
                    user_id: idUser,
                    privilege_id: 3,
                },
            });
            if (!upVotePostPrivilege) {
                await User_Privilege.create({
                    privilege_id: 3,
                    user_id: idUser,
                });
                const dataNotifyUser = await handleNotifyForUser(idUser, "Chức năng", "Bạn đã mở khóa chức năng bình chọn lên cho bài viết", "/")
                if (dataNotifyUser?.EC !== 0) {
                    return {
                        EC: 2,
                        EM: dataNotifyUser.EM,
                    }
                }
            }
        }
        if (user.reputation >= 30) {
            const upVotePostPrivilege = await User_Privilege.findOne({
                where: {
                    user_id: idUser,
                    privilege_id: 4,
                },
            });
            if (!upVotePostPrivilege) {
                await User_Privilege.create({
                    privilege_id: 4,
                    user_id: idUser,
                });
                const dataNotifyUser = await handleNotifyForUser(idUser, "Chức năng",
                    "Bạn đã mở khóa chức năng bình chọn xuống cho bài viết", "/")
                if (dataNotifyUser?.EC !== 0) {
                    return {
                        EC: 2,
                        EM: dataNotifyUser.EM,
                    }
                }
            }
        }
        if (user.reputation >= 75) {
            const upVotePostPrivilege = await User_Privilege.findOne({
                where: {
                    user_id: idUser,
                    privilege_id: 5,
                },
            });
            if (!upVotePostPrivilege) {
                await User_Privilege.create({
                    privilege_id: 5,
                    user_id: idUser,
                });
                const dataNotifyUser = await handleNotifyForUser(idUser, "Chức năng", "Bạn đã mở khóa chức năng thêm điểm thưởng", "/")
                if (dataNotifyUser?.EC !== 0) {
                    return {
                        EC: 2,
                        EM: dataNotifyUser.EM,
                    }
                }
            }
        }
        if (user.reputation >= 150) {
            const upVotePostPrivilege = await User_Privilege.findOne({
                where: {
                    user_id: idUser,
                    privilege_id: 6,
                },
            });
            if (!upVotePostPrivilege) {
                await User_Privilege.create({
                    privilege_id: 6,
                    user_id: idUser,
                });
                const dataNotifyUser = await handleNotifyForUser(idUser, "Chức năng", "Bạn đã mở khóa chức năng tạo thẻ", "/")
                if (dataNotifyUser?.EC !== 0) {
                    return {
                        EC: 2,
                        EM: dataNotifyUser.EM,
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