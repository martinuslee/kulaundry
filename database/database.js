var mysql = require("mysql2");
var client = mysql.createConnection({
    user: "root",
    password: "1234",
    database: "dbproject",
  });

  module.exports = client;