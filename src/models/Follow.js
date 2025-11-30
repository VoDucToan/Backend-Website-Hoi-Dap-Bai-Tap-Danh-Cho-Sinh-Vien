const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');
const User = require('./User');
const Post = require('./Post');

const Follow = sequelize.define(
    'Follow',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
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
    },
    {
        tableName: 'follow',
    },
);

module.exports = Follow;