const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');
const User = require('./User');
const Post = require('./Post');
const Vote_Type = require('./Vote_Type');
const Privilege = require('./Privilege');

const User_Privilege = sequelize.define(
    'User_Privilege',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        privilege_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Privilege,
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
        tableName: 'user_privilege',
    },
);

module.exports = User_Privilege;