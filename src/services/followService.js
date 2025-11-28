const dayjs = require("dayjs");
const sequelize = require("../config/connectDB");
const Follow = require("../models/Follow");

const handleFollowPostByUser = async (idUser, idPost) => {
    try {
        await Follow.create({
            user_id: idUser,
            post_id: idPost,
        });
        return {
            EC: 0,
            EM: "Following posst by user succeed",
        };
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleCheckFollowPostByUser = async (idUser, idPost) => {
    try {
        const count = await Follow.count({
            where: {
                user_id: idUser,
                post_id: idPost,
            }
        });
        let isFollow = false;
        if (count > 0) {
            isFollow = true;
        }

        return {
            EC: 0,
            EM: "Check Follow post by user succeed",
            DT: isFollow
        };
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleUnfollowPostByUser = async (idUser, idPost) => {
    try {
        await Follow.destroy({
            where: {
                user_id: idUser,
                post_id: idPost,
            },
        });

        return {
            EC: 0,
            EM: "Unfollow post by user succeed",
        };
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetUserFollowByPost = async (idPost) => {
    try {
        const follow = await Follow.findAll({
            where: {
                post_id: idPost,
            },
        });

        return {
            EC: 0,
            DT: follow,
            EM: "Get user follow by post succeed",
        };
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }

}

const handleGetFollowedPostByUser = async (idUser) => {
    try {
        const [followedPosts] = await sequelize.query(`SELECT *
                                                    FROM follow
                                                    INNER JOIN post ON follow.post_id = post.id
                                                    WHERE follow.user_id = ${idUser}`);

        return {
            EC: 0,
            DT: followedPosts,
            EM: "Get followed posts by user succeed",
        };
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }

}

const handleGetFollowedPostByUserPagination = async (page, limit, idUser) => {
    try {
        const offset = (page - 1) * limit;
        const [followedPosts] = await sequelize.query(`SELECT *
                                                    FROM follow
                                                    INNER JOIN post ON follow.post_id = post.id
                                                    WHERE follow.user_id = ${idUser}
                                                    LIMIT ${limit} 
                                                    OFFSET ${offset}`);

        const formattedDataListEdits = followedPosts.map(followedPost => {
            followedPost.askedTime = dayjs(followedPost.createdAt).format('D MMM, YYYY [a]t H:mm');
            return followedPost;
        });

        const count = await Follow.count({
            where: {
                user_id: idUser,
            }
        });
        const totalPages = Math.ceil(count / limit);

        return {
            EC: 0,
            DT: {
                totalRows: count,
                totalPages: totalPages,
                followedPosts: formattedDataListEdits
            },
            EM: "Get followed posts by user pagination succeed",
        };
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }

}

module.exports = {
    handleFollowPostByUser, handleCheckFollowPostByUser, handleUnfollowPostByUser,
    handleGetUserFollowByPost, handleGetFollowedPostByUser, handleGetFollowedPostByUserPagination
}