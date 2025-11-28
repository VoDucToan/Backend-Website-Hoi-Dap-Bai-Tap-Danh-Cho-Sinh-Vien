const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');
const Post = require('./Post');
const Tag = require('./Tag');

const Image_Tag = sequelize.define(
    'Image_Tag',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        file_name: {
            type: DataTypes.STRING(2083),
        },
        tag_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Tag,
                key: 'id',
            },
        },
    },
    {
        tableName: 'Image_Tag',
    },
);

module.exports = Image_Tag;