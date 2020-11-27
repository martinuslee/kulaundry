const express = require("express");
const mysqli = require("../database/database");
const fs = require("fs");
var ejs = require("ejs");
const ses = require("../config/config");
const router = express.Router();



router.post("/", function (req, res) {
  //파일 읽기
  var id = req.session.id;
  var sql = "select * from account where id = ?";
  if (!req.session) return res.render("mypage");
  if (req.session.authenticate) {
    fs.readFile("./Web/mypage.html", "utf8", function (error, data) {
      mysqli.query(sql, [id], function (error, results) {
        //response

        //response
        res.send(ejs.render(data, { data: results }));
        console.log("data: ", results);
      });
    });
  }
});

module.exports = router;
