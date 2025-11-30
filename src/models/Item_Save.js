const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');
const List_Save = require('./List_Save');
const Post = require('./Post');

const Item_Save = sequelize.define(
    'item_save',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        list_save_id: {
            type: DataTypes.INTEGER,
            references: {
                model: List_Save,
                key: 'id',
            },
        },
        post_save_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Post,
                key: 'id',
            },
        },
        private_note: {
            type: DataTypes.STRING(),
        },
    },
    {
        tableName: 'item_save',
    },
);

module.exports = Item_Save;