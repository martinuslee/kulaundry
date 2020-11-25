var fs = require("fs");
var ejs = require("ejs");
var express = require("express");
var bodyParser = require("body-parser");
const { request } = require("https");
var cookieParser = require("cookie-parser");
/*-----------------------------------------*/
var userLogin = require('./router/login');
var userSignup = require('./router/signin');
var userInsert = require('./router/insert');
const deleteItem = require('./router/delete');
/*-----------------------------------------*/
const mysqli = require('./database/database');
const ses = require('./config/config');
/*-----------------------------------------*/

//Server를 생성
var app = express();
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
//미들웨어 추가
app.use(express.static("Web/Login_v3"));
app.use(ses); //session정보 (config/config.js)
app.use('/',userLogin);
app.use('/signin',userSignup);
app.use('/insert',userInsert);
app.use('/delete',deleteItem); 

//서버를 실행
app.listen(52273, function () {
  console.log("server running at http://127.0.0.1:52273");
});

app.get("/list", function (req, res) {
  //파일 읽기
  var name = req.session.name;
  if (!req.session) return res.render("login");
  if (req.session.authenticate) {
    fs.readFile("./Web/list.html", "utf8", function (error, data) {
      mysqli.query(
        "SELECT s.num, s.user_id, m.LOCATION, s.roomno, date_format(time,'%Y-%m-%d %H:%i:%s')as time, date_format((date_add(time,interval 45 minute)),'%Y-%m-%d %H:%i:%s') as endtime from state s, machine m where s.num = m.MACHINE_ID",
        function (error, results) {
          //response
          res.send(ejs.render(data, { data: results, name: name }));
          console.log("data: ", results);
        }
      );
    });
  }
});



// app.get("/checkid", function (req, res) {
//   let user_id = req.body.id;

//   console.log(req.body.id);
//   let sql = "SELECT id from account where id=?";
//   client.query(sql, [user_id], function (err, data) {
//     if (data == 0) {
//       console.log("OK!!");
//     } else {
//       res.send("존재");
//     }
//   });
// });
