const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');
const User = require('./User');
const Post = require('./Post');
const Post_Type = require('./Post_Type');

const Edit_Post = sequelize.define(
    'edit_post',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        previous_edit_id: {
            type: DataTypes.INTEGER,
        },
        edited_by_user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id',
            },
        },
        post_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Post,
                key: 'id',
            },
        },
        post_title: {
            type: DataTypes.STRING(1000),
        },
        post_details: {
            type: DataTypes.TEXT('medium'),
        },
        post_plain_details: {
            type: DataTypes.TEXT('medium'),
        },
        edit_summary: {
            type: DataTypes.STRING(1000),
        },
        edit_status: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        edit_post_type_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Post_Type,
                key: 'id',
            },
        },
    },
    {
        tableName: 'edit_post',
    },
);

Edit_Post.hasMany(Edit_Post, { sourceKey: 'id', foreignKey: 'previous_edit_id' });
Edit_Post.belongsTo(Edit_Post, { targetKey: 'id', foreignKey: 'previous_edit_id' });

module.exports = Edit_Post;