const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');
const User = require('./User');
const Post = require('./Post');
const Post_Type = require('./Post_Type');
const Tag = require('./Tag');

const Edit_Tag = sequelize.define(
    'Edit_Tag',
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
        tag_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Tag,
                key: 'id',
            },
        },
        tag_name: {
            type: DataTypes.STRING,
        },
        tag_summary: {
            type: DataTypes.STRING(1000),
        },
        tag_description: {
            type: DataTypes.STRING(10000),
        },
        edit_summary: {
            type: DataTypes.STRING(1000),
        },
        edit_status: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        tableName: 'Edit_Tag',
    },
);

Edit_Tag.hasMany(Edit_Tag, { sourceKey: 'id', foreignKey: 'previous_edit_id' });
Edit_Tag.belongsTo(Edit_Tag, { targetKey: 'id', foreignKey: 'previous_edit_id' });

module.exports = Edit_Tag;