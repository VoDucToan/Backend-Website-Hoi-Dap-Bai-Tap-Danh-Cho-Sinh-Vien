const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');

const Post_Type = sequelize.define(
    'post_type',
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
        tableName: 'post_type',
    },
);

module.exports = Post_Type;