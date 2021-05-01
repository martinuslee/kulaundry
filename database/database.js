var mysql = require("mysql2");
var db_config = require("../config/db_config.json");
var client = mysql.createConnection({
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
});

module.exports = client;
