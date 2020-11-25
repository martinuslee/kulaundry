const express = require("express");
const mysqli = require("../database/database");
const router = express.Router();
var fs = require("fs");

//회원가입
router.get("/", function (request, response) {
  fs.readFile("Web/signin.html", "utf8", function (error, data) {
    response.send(data);
  });
});

router.post("/", function (request, response) {
  var id = request.body.id;
  var password = request.body.password;
  var name = request.body.name;
  var email = request.body.email;

  if (!id || !password || !name || !email) {
    response.send(
      `<script>alert('Please Input all information');location.href='/signin'</script>`
    );
    return;
  }
  var sql = "INSERT INTO account (id, password, name, email) VALUES(?,?,?,?)";
  var params = [id, password, name, email];

  mysqli.query(sql, params, function (err, data, fields) {
    if (err) console.log(err);
    else {
      console.log(data);
      request.session.name = name;
      request.session.authenticate = true;
      request.session.save(() => {
        response.redirect("/");
      });
    }
  });
});

module.exports = router;
