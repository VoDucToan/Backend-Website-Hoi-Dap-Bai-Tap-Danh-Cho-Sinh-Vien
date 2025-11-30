const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');

const Vote_Type = sequelize.define(
    'vote_type',
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
        tableName: 'vote_type',
    },
);

module.exports = Vote_Type;