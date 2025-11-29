const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');
const User = require('./User');
const Post_Type = require('./Post_Type');

const Post = sequelize.define(
    'Post',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        created_by_user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id',
            },
        },
        parent_question_id: {
            type: DataTypes.INTEGER,
        },
        post_type_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Post_Type,
                key: 'id',
            },
        },
        post_title: {
            type: DataTypes.STRING(1000),
        },
        post_details: {
            type: DataTypes.TEXT('medium'),
        },
        post_plain_details: {
            type: DataTypes.TEXT('medium'),
        },
        accepted_answer_id: {
            type: DataTypes.INTEGER,
        },
        post_status: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        tableName: 'Post',
        indexes: [
            {
                type: "FULLTEXT",
                name: "post_fulltext_index",
                fields: ["post_title", "post_plain_details"]
            }
        ]
    },
);

module.exports = Post;