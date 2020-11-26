const express = require("express");
const mysqli = require("../database/database");
const router = express.Router();

router.post("/", function (req, res) {
  var user_id = req.body.id;
  var param = [user_id];
  console.log(req.body.id);
  var sql = "SELECT id from account where id=?";
  mysqli.query(sql, param, function (err, data) {
    if (data.length == 0) {
      res.send(
        `<script>alert('you can use this ID!');location.href='/signin'</script>`
      );
    } else {
      res.send(
        `<script>alert('This ID already exists!! Try another');location.href='/signin'</script>`
      );
    }
  });
});

module.exports = router;
