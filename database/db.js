const { Sequelize } = require('sequelize');

const db = new Sequelize('app_users', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = db;
