const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');

const Role = sequelize.define(
    'Role',
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
        tableName: 'Role',
    },
);

module.exports = Role;