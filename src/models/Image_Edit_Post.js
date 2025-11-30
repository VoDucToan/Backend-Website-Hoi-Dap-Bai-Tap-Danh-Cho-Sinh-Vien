const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');
const Edit = require('./Edit_Post');

const Image_Edit_Post = sequelize.define(
    'image_edit_post',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        file_name: {
            type: DataTypes.STRING(2083),
        },
        edit_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Edit,
                key: 'id',
            },
        },
    },
    {
        tableName: 'image_edit_post',
    },
);

module.exports = Image_Edit_Post;