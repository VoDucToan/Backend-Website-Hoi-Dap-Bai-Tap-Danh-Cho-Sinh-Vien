const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');
const Role = require('./Role');

const Privilege = sequelize.define(
    'Privilege',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        privilege_type: {
            type: DataTypes.STRING,
        },
        privilege_description: {
            type: DataTypes.STRING,
        },
        privilege_reputation: {
            type: DataTypes.INTEGER,
        },
    },
    {
        tableName: 'privilege',
    },
);


module.exports = Privilege;