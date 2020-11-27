var express = require("express");
var session = require("express-session");
var db_config  = require('./db_config.json');
var MySQLStore = require("express-mysql-session")(session);

var usrSession = session({
    key: "session_cookie_name",
    secret: "session_cookie_secret",
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore({
      host: db_config.host,
      port: db_config.port,
      user: db_config.user,
      password: db_config.password,
      database: db_config.database,
    })
});

module.exports = usrSession;