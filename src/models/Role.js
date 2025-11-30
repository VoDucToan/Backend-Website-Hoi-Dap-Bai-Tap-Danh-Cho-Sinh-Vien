const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');

const Role = sequelize.define(
    'role',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        role_name: {
            type: DataTypes.STRING,
            unique: true,
        },
    },
    {
        tableName: 'role',
    },
);

module.exports = Role;