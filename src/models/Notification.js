const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');
const User = require('./User');

const Notification = sequelize.define(
    'notification',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        belonged_by_user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id',
            },
        },
        notification_type: {
            type: DataTypes.STRING,
        },
        notification_summary: {
            type: DataTypes.STRING,
        },
        notification_resource: {
            type: DataTypes.STRING,
        },
        id_target_answer: {
            type: DataTypes.INTEGER,
        },
        is_read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        tableName: 'notification',
    },
);

module.exports = Notification;