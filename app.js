// server settting
// 라우팅(routing) - 클라이언트가 URL로 접근하는 경로를 안내해주는 행위 / 클라이언트가 접근하는 경로에 따라 서버가 알맞는 동작을 처리할 수 있도록 만들어주는 것

var createError = require("http-errors");
var express = require("express"); // express 서버 사용
var path = require("path"); // 입력해야 할 경로명을 줄일 때 사용
var cookieParser = require("cookie-parser");
var winston = require("winston");
var morgan = require("morgan");
const logToFile = require("./utils/logToFile");

// login, signUp settings - Cretima
const session = require('express-session');
const mysql = require("mysql2/promise"); // load mysql library
const static = require('serve-static') // 부모 경로 설정
const FileStore = require('session-file-store')(session); // 세션을 파일에 저장
const bodyParser = require('body-parser'); // body parser (client에서 넘어오는 body 데이터를 사용하기 쉽게 파싱해주는 모듈)
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser');


// node env settings
require("dotenv").config({
	path: process.env.NODE_ENV === "dev" ? ".env.dev" : ".env.production",
});

// database settings
var database = require("./database/database");

// import routers
var indexRouter = require("./controller/index");
var usersRouter = require("./controller/users");
var authRouter = require("./controller/auth");
var mapsRouter = require("./controller/kakaomap");
var recmdRouter = require("./controller/recmd");

// import routers for login, signUp - Cretima
var loginRouter = require("./controller/login")
var signupRouter = require("./controller/signup")

var app = express(); // 웹 서버 지정

app.set("trust proxy", true);
// view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "jade");

// views page(e.g. home folder) template rendering - Cretima
// view로 경로 설정
app.set("views", "./views");
app.set("view engine", "ejs");

app.use((req, res, next) => {
	req.headers["x-forwarded-for"] = req.connection.remoteAddress;
	next();
});

// log middleware
app.use(
	morgan({
		format:
			":req[X-Forwarded-For] (:remote-addr) :status :method :url :referrer :response-time ms :user-agent",
		stream: {
			write: (message) => {
				winston.info(message);
				logToFile(message);
			},
		},
	})
);
app.use(express.urlencoded({ extended: false })); // 웹 브라우저에 url를 인코딩 형태로 날리기에 그것을 처리하는 환경설정
app.use(express.json()); // 받은 형태를 JSON으로 읽기
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public"))); // 정적 파일 경로 설정(미들웨이) - 내가 사용할 style, img등 파일들을 연결

// use routers
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/maps", mapsRouter);
app.use("/recmd", recmdRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	console.log(req.headers["x-forwarded-for"] || req.ip);
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "dev" ? err : {};

	// render the error page
	res.status(err.status || 500).send(err.message);
	// res.render("error");
});



// // 서버 실행 테스트 - Cretima / $ node app.js - cretima
// app.listen(3000, ()=>{
// 	console.log("Listening on port 3000");
// })

// // 메인 페이지 불러오기 - Cretima
// //res.render('화면 이름', 화면에 전달할 값 {key : 'value'});
// // views 경로 설정은 위에 설정해줌.
// app.get('/', function(req, res){
// 	console.log('메인 페이지 작동')
// 	res.render("./home/main")
// })

// // 로그인 페이지 불러오기 - Cretima
// app.get('/', function(req, res){
// 	console.log('메인 페이지 작동')
// 	res.render("./home/login")
// })

module.exports = app;
