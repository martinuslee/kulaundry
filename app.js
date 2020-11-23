var fs = require("fs");
var ejs = require("ejs");
var mysql = require("mysql2");
var login = require("body-parser");
var url = require("url");
var express = require("express");
var bodyParser = require("body-parser");
const { response, Router } = require("express");
const { request } = require("https");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);

//데이터베이스와 연결
var client = mysql.createConnection({
  user: "root",
  password: "1234",
  database: "dbproject",
});
//Server를 생성
var app = express();
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(express.static("Login_v3"));
app.use(express.static("Table_Responsive_v1"));
app.use(
  session({
    key: "session_cookie_name",
    secret: "session_cookie_secret",
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "1234",
      database: "dbproject",
    }),
  })
);

//서버를 실행
app.listen(52273, function () {
  console.log("server running at http://127.0.0.1:52273");
});

app.get("/list", function (req, res) {
  //파일 읽기
  var name = req.session.name;
  if (!req.session) return res.render("login");
  if (req.session.authenticate) {
    fs.readFile("list.html", "utf8", function (error, data) {
      client.query(
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

app.get("/delete/:num", function (request, response) {
  var pw = request.pw;

  //데이터베이스 쿼리 실행
  client.query(
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

app.get("/insert", function (request, response) {
  fs.readFile("insert.html", "utf8", function (error, data) {
    response.send(data);
  });
});

app.post("/insert", function (request, response) {
  //변수 선언
  var body = request.body;
  // 데이터베이스 쿼리 실행
  
  client.query(
    "INSERT INTO state (num, user_id, roomno) values (?,?,?)",
    [body.num, request.session.userID, body.roomno],
    function () {
      response.redirect("/list");
    }
  );
  console.log(request.session.userID + " insert complete!");
});

//회원가입
app.get("/signin", function (request, response) {
  fs.readFile("signin.html", "utf8", function (error, data) {
    response.send(data);
  });
});

app.post("/signin", function (request, response) {
  var id = request.body.id;
  var password = request.body.password;
  var name = request.body.name;
  var email = request.body.email;

  if (!id || !password || !name || !email) {
    response.send("please input all information..");
    return;
  }
  var sql = "INSERT INTO account (id, password, name, email) VALUES(?,?,?,?)";
  var params = [id, password, name, email];

  client.query(sql, params, function (err, rows, fields) {
    const user = rows[0];
    if (err) console.log(err);
    else {
      console.log(user);
      request.session.name = name;
      request.session.authenticate = true;
      request.session.save(() => {
        response.redirect("/list")
      })
    }
  })
});

app.post("/checkid", function (req, res) {
  let user_id = req.body.id;

  console.log(req.body.id);
  let sql = "SELECT id from account where id=?";
  client.query(sql, [user_id], function (err, data) {
    if (data == 0) {
      console.log("OK!!");
    } else {
      res.send("존재");
    }
  });
});
//로그인
app.get("/", function (req, res) {
  // res.sendFile("./Login_v3/index.html");
  res.render("Login_v3/index");
});

app.post("/login", function (request, response) {
  var id = request.body.id;
  var password = request.body.password;

  var sql = "SELECT * FROM account WHERE id=?";
  var params = [id];
  client.query(sql, params, function (err, rows, fields) {
    var user = rows[0];
    if (!id || !password) {
      response.send(`
      <button onclick="window.location.href='/';">Back</button>
      <h2>please input all information..</h2>
  `);
      return;
    }
    if (!user) {
      response.send(`
      <button onclick="window.location.href='/';">Back</button>
      <h1>please check your id</h1>
  `);
    } else if (user.password == password) {
      // response.send(user.name + '  Welcome!');
      request.session.authenticate = true;
      request.session.userID = user.id;
      request.session.name = user.name;
      request.session.save(() => {
        response.redirect("/list");
      });
    } else {
      response.send(`
      <button onclick="window.location.href='/';">Back</button>
      <h1>Please Check your Password</h1>
  `);
    }
  });
});
app.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    res.redirect("/");
  });
});
