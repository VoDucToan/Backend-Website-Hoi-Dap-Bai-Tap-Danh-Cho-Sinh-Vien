const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');

const Vote_Type = sequelize.define(
    'Vote_Type',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        vote_type: {
            type: DataTypes.BOOLEAN,
        },
    },
    {
        tableName: 'Vote_Type',
    },
);

module.exports = Vote_Type;