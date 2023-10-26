const mysql = require('mysql2/promise');

const configDB = {
  host: process.env.MYSQL_HOSTNAME || 'db',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'TalkerDB',
};

const connection = mysql.createPool(configDB);

module.exports = connection;