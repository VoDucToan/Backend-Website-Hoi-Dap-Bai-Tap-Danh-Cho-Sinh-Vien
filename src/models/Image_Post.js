const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');
const Post = require('./Post');

const Image_Post = sequelize.define(
    'image_post',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        file_name: {
            type: DataTypes.STRING(2083),
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
        tableName: 'image_post',
    },
);

module.exports = Image_Post;