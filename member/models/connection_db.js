// DataBase
const config = require('../config/development_config');
const mysqlt = require("mysql");

const connection = mysqlt.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'testing',
  password: 'nccutest',
  database: 'member'
  // host: config.mysql.host,
  // user: config.mysql.user,
  // password: config.mysql.password,
  // database: config.mysql.database
});

connection.connect(err => {
  if (err) {
    console.log(err);
  } else {
    console.log('connecting success');
  }
});

module.exports = connection;