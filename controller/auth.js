/* 회원 정보 데이터 처리하는 라우터(chackout) */
/* The "/auth" route */
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const authModel = require("../services/auth.service");
const bodyParser = require("body-parser")
// 로그인 및 회원가입 필수 라이브러리
// sign up 할때 refresh 토큰 access token 받을 수 있게 구현하기


/* import middlewares */
.prototype
const { userAuth } = require("../middlewares/authentication");

/* Routes */
// 유저 토큰 받는 부분
router.get("/", userAuth, async (req, res, next) => {
	const access_token = req.headers.authorization.split("Bearer ")[1];
	const verify = await authModel.getPayloadByToken(access_token);
	res.send(`Verified! Hello, ${verify.name}!`);
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


// 회원가입 라우터
router.post("/signup", async (req, res, next) => {
	// 유저 이메일 생성 및 중복 체크 - 23.03.27
	const user = await authModel.createUser(req.body.email);
	if (!user) res.status(400), res.send("이미 아이디가 존재 합니다");
	
	// 비밀번호 암호화
	const { password } = req.body.password;
	const encrypt = await bcrypt.hash(password, +process.env.BCRYPT_SALT);
	req.body.password = encrypt;
	
	// 유저에게 accessToken, refreshToken 부여
	const accessToken = await authModel.createAccessToken(user.email, user.name);
	const refreshToken = await authModel.createRefreshToken(user.email, user.name);
	res.cookie("access_token", accessToken);
	res.cookie("refresh_token", refreshToken);
	res.send("Sign Up and Login Success!")
});

module.exports = router;
