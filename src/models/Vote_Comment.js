const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');
const User = require('./User');
const Vote_Type = require('./Vote_Type');
const Comment = require('./Comment');

const Vote_Comment = sequelize.define(
    'Vote_Comment',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        comment_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Comment,
                key: 'id',
            },
        },
        vote_type_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Vote_Type,
                key: 'id',
            },
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id',
            },
        },
    },
    {
        tableName: 'Vote_Comment',
    },
);

module.exports = Vote_Comment;