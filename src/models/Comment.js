const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');
const User = require('./User');
const Post = require('./Post');

const Comment = sequelize.define(
    'Comment',
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
        post_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Post,
                key: 'id',
            },
        },
        comment_text: {
            type: DataTypes.STRING(5000),
        },
    },
    {
        tableName: 'Comment',
    },
);

module.exports = Comment;