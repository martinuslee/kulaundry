const express = require("express");
const mysqli = require("../database/database");
const router = express.Router();


router.get("/:num", function (request, response) {

    //데이터베이스 쿼리 실행
    mysqli.query(
      "DELETE FROM state where num = ?",
      [request.params.num],
      function () {
        //쿼리문에 대한 응답
        response.redirect("/list");
        //response.send("delete complete!");
        //데이터베이스에서 데이터를 제거하고 원래 페이지로 강제이동
      }
    );
    console.log("delete complete!");
  });

  module.exports = router;