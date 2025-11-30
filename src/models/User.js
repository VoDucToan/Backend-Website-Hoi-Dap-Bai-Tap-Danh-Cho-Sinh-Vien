const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');
const Role = require('./Role');

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        display_name: {
            type: DataTypes.STRING,
        },
        email_address: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
        },
        about_me: {
            type: DataTypes.TEXT('medium'),
        },
        location: {
            type: DataTypes.STRING,
        },
        reputation: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            validate: {
                min: 1
            },
        },
        is_verify_email: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        verify_token: {
            type: DataTypes.STRING,
        },
        role_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Role,
                key: 'id',
            },
        },
        refresh_token: {
            type: DataTypes.STRING,
        },
        avatar_file_name: {
            type: DataTypes.STRING(2083),
            defaultValue: "avatar-default-user.jpg",
        },
    },
    {
        tableName: 'user',
    },
);


module.exports = User;