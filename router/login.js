const express = require("express");
const mysqli = require('../database/database');
const router = express.Router();


//로그인
router.get("/", function (req, res) {
  // res.sendFile("./Login_v3/index.html");
  res.render("Web/Login_v3/index");
});

router.post("/login", function (request, response) {
  var id = request.body.id;
  var password = request.body.password;

  var sql = "SELECT * FROM account WHERE id=?";
  var params = [id];
  mysqli.query(sql, params, function (err, rows, fields) {
    var user = rows[0];
    if (!id || !password) {
      return;
    }
    if (!user) {
      response.send(`
        <script>alert('Check your User ID');location.href='/'</script>
      `);
    } else if (user.password == password) {
      // response.send(user.name + '  Welcome!');
      request.session.authenticate = true;
      request.session.userID = user.id;
      request.session.name = user.name;
      request.session.pw = user.password;
      request.session.save(() => {
        response.redirect("/list");
      });
    } else {
      response.send(`
              <script>alert('Check your Password');location.href='/'</script>
            `);
    }
  });
});

router.get('/logout', function (req, res) {
  req.session.destroy(function (err) {
    res.redirect("/");
  })
});


module.exports = router;
