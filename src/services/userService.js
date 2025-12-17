const dayjs = require('dayjs');
const connection = require('../config/database');
const User = require('../models/User');
const { Op } = require('sequelize');
const Post = require('../models/Post');
const { handleGrantPrivilegesForUser } = require('./privilegeService');
const sequelize = require('../config/connectDB');

const handleGetUser = async (idUser) => {
    try {
        let [results, fields] = await connection.query(`select * from user where id = ${idUser}`);
        results[0].createdAtAgo = dayjs(results[0].createdAt).fromNow(true);
        return {
            EC: 0,
            EM: "Get user succeed",
            DT: results
        };
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }

}

const handleGetListUsers = async () => {
    try {
        const listUsers = await User.findAll({
            attributes: { exclude: ['password'] },
        });
        const formattedListUsers = listUsers.map(user => {
            const plainUser = user.get({ plain: true });
            plainUser.createdAt = dayjs(plainUser.createdAt).format('DD-MM-YYYY HH:mm:ss');
            plainUser.updatedAt = dayjs(plainUser.updatedAt).format('DD-MM-YYYY HH:mm:ss');
            return plainUser;
        });
        return {
            EC: 0,
            EM: 'Get list users succeed',
            DT: formattedListUsers
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetListUsersPagination = async (page, limit, search) => {
    try {
        const where = {};

        if (search !== undefined && search !== '' && search !== 'undefined') {
            where.display_name = {
                [Op.like]: `%${search}%`
            }
        }

        const offset = (page - 1) * limit;
        const { count, rows } = await User.findAndCountAll({
            attributes: { exclude: ['password'] },
            // where: {
            //     display_name: {
            //         [Op.like]: `%${search}%`
            //     }
            // },
            where,
            offset: offset,
            limit: limit,
        });
        const formattedListUsers = rows.map(user => {
            const plainUser = user.get({ plain: true });
            plainUser.createdAt = dayjs(plainUser.createdAt).format('DD-MM-YYYY HH:mm:ss');
            plainUser.updatedAt = dayjs(plainUser.updatedAt).format('DD-MM-YYYY HH:mm:ss');
            return plainUser;
        });
        const totalPages = Math.ceil(count / limit);
        return {
            EC: 0,
            EM: 'Get list users pagination succeed',
            DT: {
                totalRows: count,
                totalPages: totalPages,
                users: formattedListUsers
            }
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleUpdateUser = async (idUser, idRole, userName, locationUser, aboutMe, avatarImage, reputation) => {
    try {
        if (reputation === 'undefined' || reputation === 'null') {
            reputation = undefined;
        }
        await User.update(
            {
                role_id: idRole,
                display_name: userName,
                location: locationUser,
                about_me: aboutMe,
                reputation: reputation,
            },
            {
                where: {
                    id: idUser,
                },
            },
        );
        if (avatarImage) {
            await User.update(
                {
                    avatar_file_name: avatarImage
                },
                {
                    where: {
                        id: idUser,
                    },
                },
            );
        }
        const user = await User.findOne(
            {
                attributes: ['display_name', 'avatar_file_name'],
                where: {
                    id: idUser,
                },
            }
        );
        return {
            EC: 0,
            DT: user,
            EM: 'Update user succeed',
        }
    } catch (error) {
        console.log('error', error);
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleIncreaseReputationForAuthorPost = async (idPost, reputationPoints) => {
    try {
        const post = await Post.findOne({
            where: {
                id: idPost,
            },
            attributes: ['created_by_user_id'],
        });
        await User.increment('reputation', {
            by: reputationPoints,
            where: {
                id: post.created_by_user_id,
            },
        });
        const dataGrantPrivilegesUser = await handleGrantPrivilegesForUser(post.created_by_user_id);
        if (dataGrantPrivilegesUser?.EC === 0) {
            return {
                EC: 0,
                EM: 'increase reputation for author post succeed',
            }
        }
        else {
            return {
                EC: 2,
                EM: dataGrantPrivilegesUser.EM,
            }
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleIncreaseReputationForUser = async (idUser, reputationPoints) => {
    try {
        await User.increment('reputation', {
            by: reputationPoints,
            where: {
                id: idUser,
            },
        });
        const dataGrantPrivilegesUser = await handleGrantPrivilegesForUser(idUser);
        if (dataGrantPrivilegesUser?.EC === 0) {
            return {
                EC: 0,
                EM: 'increase reputation for user succeed',
            }
        }
        else {
            return {
                EC: 2,
                EM: dataGrantPrivilegesUser.EM,
            }
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleDecreaseReputationForAuthorPost = async (idPost, reputationPoints) => {
    try {
        const post = await Post.findOne({
            where: {
                id: idPost,
            },
            attributes: ['created_by_user_id'],
        });

        await User.update(
            {
                reputation: sequelize.literal(`GREATEST(1, reputation - ${reputationPoints})`)
            },
            {
                where: { id: post.created_by_user_id }
            }
        );

        return {
            EC: 0,
            EM: 'Decrease reputation for author post succeed',
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleDecreaseReputationForUser = async (idUser, reputationPoints) => {
    try {
        const user = await User.findOne({
            where: {
                id: idUser,
            },
            attributes: ['reputation'],
        });
        if (user.reputation - reputationPoints < 1) {
            return {
                EC: 2,
                EM: 'User reputation score is not enough to decrease',
            }
        }
        await User.increment({ reputation: -reputationPoints }, { where: { id: idUser } });
        return {
            EC: 0,
            EM: 'Decrease reputation for user succeed',
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

module.exports = {
    handleGetUser, handleGetListUsers, handleUpdateUser,
    handleGetListUsersPagination, handleIncreaseReputationForAuthorPost,
    handleDecreaseReputationForAuthorPost, handleIncreaseReputationForUser,
    handleDecreaseReputationForUser
}