const express = require('express');
const mysqli = require("../database/database");
const router = express.Router();
var fs = require("fs");


router.get("/", function (request, response) {
    fs.readFile("Web/changepw.html", "utf8", function (error, data) {
      response.send(data);
    });
  });

router.post('/', function (req, res) {
    var userId = req.body.id;
    var userPw = req.body.password;
    var userPwNew = req.body.newpw;
    mysqli.query('select * from account where id=? and password=?', [userId, userPw], function (err, rows, fields) {
        if (!err) {
            if (rows[0] != undefined) {
                mysqli.query('update account set password=? where id=?', [userPwNew, userId], function (err, rows, fields) {
                    if (!err) {
                        res.send(
                            `<script>alert('Password change success!');location.href='/'</script>`
                          );
                    } else {
                        res.send('error : ' + err);
                    }
                });
            } else {
                res.send('no data');
            }

        } else {
            res.send('error : ' + err);
        }
    });

});

module.exports = router;