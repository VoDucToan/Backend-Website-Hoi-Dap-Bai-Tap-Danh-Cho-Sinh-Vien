const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');
const User = require('./User');
const Post_Type = require('./Post_Type');

const Tag = sequelize.define(
    'Tag',
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
        tag_name: {
            type: DataTypes.STRING,
        },
        tag_summary: {
            type: DataTypes.STRING(1000),
        },
        tag_description: {
            type: DataTypes.STRING(10000),
        },
        tag_status: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        tableName: 'Tag',
    },
);

module.exports = Tag;