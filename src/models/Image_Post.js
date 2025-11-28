const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');
const Post = require('./Post');

const Image_Post = sequelize.define(
    'Image_Post',
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
        tableName: 'Image_Post',
    },
);

module.exports = Image_Post;