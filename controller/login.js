// 로그인 라우터 분리 예정

var express = require("express"); // express 서버 사용
var path = require("path"); // 입력해야 할 경로명을 줄일 때 사용
var cookieParser = require("cookie-parser");
const session = require('express-session');
// const mysql = require("mysql2/promise"); // load mysql library
const static = require('serve-static') // 부모 경로 설정
const FileStore = require('session-file-store')(session); // 세션을 파일에 저장
const bodyParser = require('body-parser'); // body parser (client에서 넘어오는 body 데이터를 사용하기 쉽게 파싱해주는 모듈)
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser');

// database settings
var database = require("./database/database");
const { router } = require("../app");

// 웹 서버 지정
var router = express();

// views page(e.g. home folder) template rendering - Cretima
// view로 경로 설정
router.set("views", "./views");
router.set("view engine", "ejs");

/* 회원 가입 페이지 로직 구현 - Cretima */
// 웹브라우저(회원가입)에서 post로 들어오는 것을 해당 경로로 보내 처리 하겠다는 의미.
router.post('/controller/signup',(req, res) => {
	console.log('/routcontrolleres/signup 호출됨' %{req});
	
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
router.post('/controller/signup',(req, res) => {
	console.log('/controller/signup 호출됨' %{req});
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

// 유저 로그인 라우터 + 쿠키 제공
// next:  다음 미들웨어 보내는 매개변수
router.post("/login", async (req, res, next) => {
	const user = await authModel.getUser(req.body.email);
	if (!user) res.send("Not found user.");
	const isValid = await bcrypt.compare(req.body.password, user.password);
	if (!isValid) res.status(400).send("Invalid password.");

	const accessToken = await authModel.createAccessToken(user.email, user.name);
	const refreshToken = await authModel.createRefreshToken(
		user.email,
		user.name
	);
	await authModel.setToken(user.user_id, accessToken, refreshToken);
	res.cookie("access_token", accessToken);
	res.cookie("refresh_token", refreshToken);
	res.send("Login Success!");
});

module.exports = router;