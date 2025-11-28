const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');

const Post_Type = sequelize.define(
    'Post_Type',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        type_name: {
            type: DataTypes.STRING,
        },
    },
    {
        tableName: 'Post_Type',
    },
);

module.exports = Post_Type;