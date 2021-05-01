var fs = require("fs");
var ejs = require("ejs");
var express = require("express");
var bodyParser = require("body-parser");
const { request } = require("https");
var cookieParser = require("cookie-parser");
/*-----------------------------------------*/
var userLogin = require("./router/login");
var userSignup = require("./router/signin");
var userInsert = require("./router/insert");
const deleteItem = require("./router/delete");
const changePw = require("./router/changePw");
const mypage = require("./router/mypage");
/*-----------------------------------------*/
const mysqli = require("./database/database");
const ses = require("./config/config");
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
app.use("/", userLogin);
app.use("/signin", userSignup);
app.use("/insert", userInsert);
app.use("/delete", deleteItem);
app.use("/changepw", changePw);
// app.use("/mypage", mypage);

//서버를 실행

const PORT = process.env.PORT ? process.env.PORT : 3000;

app.listen(PORT, function () {
  console.log("server running at http://127.0.0.1:", PORT);
});


app.get("/list", function (req, res) {
  //파일 읽기
  var name = req.session.name; //세션이름을 변수에 저장
  var sql =
    "SELECT s.num, s.user_id, m.LOCATION, s.roomno, date_format(time,'%Y-%m-%d %H:%i:%s')as time, date_format((date_add(time,interval 45 minute)),'%Y-%m-%d %H:%i:%s') as endtime from state s, machine m where s.num = m.MACHINE_ID";
  var del =
    "DELETE FROM STATE WHERE time < DATE_ADD(now(), INTERVAL -45 MINUTE);"; //45 분뒤에 자동으로 삭제
  if (!req.session) return res.render("login");
  if (req.session.authenticate) {
    fs.readFile("./Web/list.html", "utf8", function (error, data) {
      mysqli.query(sql, function (error, results) {
        //response
        mysqli.query(del, function () {
          //response
          res.send(ejs.render(data, { data: results, name: name }));
          console.log("data: ", results);
        });
      });
    });
  }
});

app.post("/mypage", function (req, res) {
  //파일 읽기
  let id = req.session.userID;
  console.log(id);
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