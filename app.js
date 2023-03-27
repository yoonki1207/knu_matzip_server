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
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");
var mapsRouter = require("./routes/kakaomap");
var recmdRouter = require("./routes/recmd");

// import routers for login, signUp - Cretima
var loginRouter = require("")
var loginCheak = require("")
var template = require("") // 로그인 페이지 템플릿

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

/* 회원 가입 페이지 로직 구현 - Cretima */
// 웹브라우저(회원가입)에서 post로 들어오는 것을 해당 경로로 보내 처리 하겠다는 의미.
// 라우터 경로 바꿔야 할 필요가 있음.
app.post('/routes/signup',(req, res) => {
	console.log('/routes/signup 호출됨' %{req});
	
	// 회원가입 했던 정보들은 req.body에 저장, 그 정보를 뽑아온다. - urlencoded, JSON 덕분에 필요 정보들끼리 분류해줌.
	const paramId = req.body.email; 
	const paramPassword = req.body.password;
	const paramNickname = req.body.nickname;
	const paramAge = req.body.age;
	
	// 정보를 가져왔으니 데이터베이스에 넣는 과정 - req 처리
	// 데이터베이스로 보내는 연결 통로 할당 / error: 연결 실패, connection: 연결 성공
	database.getConnection((error, connection)=>{
		
		if(error){
			connection.release();
			console.log("MySQL getConnection error. aborted"); // SQL 연결 실패
			return;
		}
		console.log('success getConnection.. ready to send to the database')
		
			// 회원정보들을 데이터베이스에 생성하는 과정 / 쿼리문 작성
			const exec = connection.query('insert into users(id, password, nickname, age) values (?, ?, ?, ?);',
				[paramId, paramPassword, paramNickname, paramAge],
				(error, result)=>{
					connection.release(); // 연결 끊기(pool에게 돌려주기
					console.log('실행된 SQL: '+exec.sql);
					
					if (error) {
						console.log('SQL 실행시 오류 발생.. 실행 실패');
						console.dir(error); // 에러 내용 출력
						res.writeHead('200', {'Content-Type' : 'text/html; charset=utf-8'})
						res.write('<h1>이메일 중복</h1>')
						res.end(); // 답변 종료
						return;
					}
					
					// res 처리 부분
					if (result) {
						console.dir(result);
						console.log('Inserted 성공');
						
						// 성공  및 메세지 타입 종류 설정 / 사용자에게 회원가입 성공 메세지 보내기
						res.writeHead('200', {'Content-Type' : 'text/html; charset=utf-8'})
						res.write('<h2>회원가입 성공</h2>')
						res.end(); // 답변 종료
					}
					else {
						console.dir(result);
						console.log('Inserted 실패');
						
						// 실패
						res.writeHead('200', {'Content-Type' : 'text/html; charset=utf-8'})
						res.write('<h1>회원가입 실패</h1>')
						res.end(); // 답변 종료
					}
				}
			)
		
	})
});

/* 로그인 페이지 로직 구현 - Cretima */
app.post('/routes/signup',(req, res) => {
	console.log('/routes/signup 호출됨' %{req});
	const paramId = req.body.email; 
	const paramPassword = req.body.password;
	
	database.getConnection((error, connection) => {
		if (error){
			connection.release();
			console.log('MySQL getConnection error. aborted');
			return;
		}
		// 데이버베이스에서 id, name 가져오기
		connection.query('select `email` from `usertbl` where `id`=? and `password`=?',
				[paramId, paramPassword],
				(error, rows) => {
					connection.release();
					console.log('실행된 SQL query:' +exec.sql);
					
					if(error){
						console.dir(error);
						res.writeHead('200', {'Content-Type' : 'text/html; charset=utf-8'});
						res.write('<h1>SQL query 실행 실패</h1>');
						res.end();
						return;
					}
					if(rows.lenght > 0) {
						console.log('아이디 [%s], 패스워드가 일치함', paramId);
						res.writeHead('200', {'Content-Type' : 'text/html; charset=utf-8'});
						res.write('<h1>로그인 성공</h1>');
						res.end();
						return;
					}
					else {
						console.log('아이디 [%s], 패스워드가 일치하지 않음', paramId);
						res.writeHead('200', {'Content-Type' : 'text/html; charset=utf-8'});
						res.write('<h1>로그인 실패, 아이디와 패스워드를 확인하세요.</h1>');
						res.end();
						return;
					}
				}
			)
	})
});

// // 서버 실행 테스트 - Cretima / $ node app.js
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
