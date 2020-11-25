const express = require("express");
const mysqli = require("../database/database");
const fs = require("fs");
const router = express.Router();

router.get("/", function (request, response) {
  fs.readFile("Web/insert.html", "utf8", function (error, data) {
    response.send(data);
  });
});

router.post("/", function (req, res) {
  //변수 선언
  var body = req.body;
  // 데이터베이스 쿼리 실행

  mysqli.query(
    "INSERT INTO state (num, user_id, roomno) values (?,?,?)",
    [body.num, req.session.userID, body.roomno],
    function () {
      res.redirect("/list");
    }
  );
  console.log(req.session.userID + " insert complete!");
});

module.exports = router;
