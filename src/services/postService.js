const { Op } = require("sequelize");
const sequelize = require("../config/connectDB");
const Post = require("../models/Post");
const dayjs = require("dayjs");

const handleGetPostType = async (idPost) => {
    try {
        const data = await Post.findOne({
            where: {
                id: idPost,
            },
            attributes: ['post_type_id', 'parent_question_id'],
        });
        return {
            EC: 0,
            EM: "Get post type succeed",
            DT: data
        };
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleSearchPostsPagination = async (page, limit, textSearch) => {
    try {
        const offset = (page - 1) * limit;
        const { count, rows } = await Post.findAndCountAll({
            where: {
                [Op.and]: [
                    sequelize.literal(`MATCH (post_title, post_plain_details) 
                        AGAINST ('${textSearch}' IN NATURAL LANGUAGE MODE)`),
                    { post_status: true }
                ]
            },
            offset: offset,
            limit: limit,
        });
        const totalPages = Math.ceil(count / limit);
        const formattedRows = rows.map(row => {
            const plainRow = row.get({ plain: true });
            plainRow.askedTime = dayjs(plainRow.createdAt).format('D MMM, YYYY [a]t H:mm');
            plainRow.editedTime = dayjs(plainRow.updatedAt).format('D MMM, YYYY [a]t H:mm');
            return plainRow;
        });

        return {
            EC: 0,
            EM: "Search posts succeed",
            DT: {
                totalRows: count,
                totalPages: totalPages,
                results: formattedRows
            }
        };
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

module.exports = {
    handleGetPostType, handleSearchPostsPagination
};