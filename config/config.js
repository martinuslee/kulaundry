var express = require("express");
var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);

var usrSession = session({
    key: "session_cookie_name",
    secret: "session_cookie_secret",
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "1234",
      database: "dbproject",
    })
});

module.exports = usrSession;