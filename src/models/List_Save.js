const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');
const User = require('./User');

const List_Save = sequelize.define(
    'List_Save',
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
        list_name: {
            type: DataTypes.STRING(),
        },
    },
    {
        tableName: 'list_save',
    },
);

module.exports = List_Save;