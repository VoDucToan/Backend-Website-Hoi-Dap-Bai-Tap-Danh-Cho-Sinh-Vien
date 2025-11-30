const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');
const Post = require('./Post');
const Tag = require('./Tag');

const Post_Tag = sequelize.define(
    'post_tag',
    {
        post_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Post,
                key: 'id',
            },
        },
        tag_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Tag,
                key: 'id',
            },
        },
    },
    {
        tableName: 'post_tag',
    },
);

module.exports = Post_Tag;