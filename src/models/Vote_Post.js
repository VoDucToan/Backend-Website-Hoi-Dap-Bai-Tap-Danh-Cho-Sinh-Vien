const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');
const User = require('./User');
const Post = require('./Post');
const Vote_Type = require('./Vote_Type');

const Vote_Post = sequelize.define(
    'vote_post',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        post_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Post,
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
        tableName: 'vote_post',
    },
);

module.exports = Vote_Post;