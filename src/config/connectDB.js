const { Sequelize } = require('sequelize');
require('dotenv').config();
const fs = require("fs");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    // dialectOptions: {
    //     ssl: {
    //         ca: fs.readFileSync(process.env.DB_SSL_CA),
    //     },
    // },
});

module.exports = sequelize;