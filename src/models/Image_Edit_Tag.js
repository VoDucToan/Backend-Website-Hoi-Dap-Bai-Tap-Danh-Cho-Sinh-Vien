const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');
const Edit = require('./Edit_Post');
const Edit_Tag = require('./Edit_Tag');

const Image_Edit_Tag = sequelize.define(
    'image_edit_tag',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        file_name: {
            type: DataTypes.STRING(2083),
        },
        edit_tag_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Edit_Tag,
                key: 'id',
            },
        },
    },
    {
        tableName: 'image_edit_tag',
    },
);

module.exports = Image_Edit_Tag;