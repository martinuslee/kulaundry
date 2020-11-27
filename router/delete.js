const express = require("express");
const mysqli = require("../database/database");
const router = express.Router();

router.get("/:num", function (request, response) {
  var user_id = request.session.userID;

  //데이터베이스 쿼리 실행
  mysqli.query(
    "DELETE FROM state where num = ? and user_id = ?",
    [request.params.num, user_id],
    // 세션 아이디와 비교해서 내가 등록하지 않은 정보는 삭제 불가능
    function () {
      //쿼리문에 대한 응답
      response.redirect("/list");
      //데이터베이스에서 데이터를 제거하고 원래 페이지로 강제이동
    }
  );
  console.log("delete complete!");
});

module.exports = router;
