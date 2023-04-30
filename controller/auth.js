/* The "/auth" route */
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const authService = require("../services/auth.service");

/* import middlewares */
const { userAuth, insertUserToken } = require("../middlewares/authentication");

/* User validation */
router.get("/", userAuth, async (req, res, next) => {
	const access_token = req.headers.authorization.split("Bearer ")[1];
	const verify = await authService.getPayloadByToken(access_token);
	res.send(`Verified! Hello, ${verify.name}!`);
});

/* Login */
router.post(
	"/login",
	async (req, res, next) => {
		const user = await authService.getUser(req.body.email);
		if (!user) {
			res.send("Not found user.");
			return;
		}
		const isValid = await bcrypt.compare(req.body.password, user.password);
		if (!isValid) res.status(400).send("Invalid password.");
		else {
			// 다음 미들웨어
			req.user = user;
			next();
		}
	},
	insertUserToken,
	async (req, res) => {
		res.send("Login Success!");
	}
);

/* Signup */
router.post(
	"/signup",
	async (req, res, next) => {
		// 패스워드 가져오기
		const { password } = req.body;
		// bcrypt 모듈로 패스워드 암호화
		const encrypt = await bcrypt.hash(password, +process.env.BCRYPT_SALT);
		// req 객체에 암호화된 패스워드를 삽입
		req.body.password = encrypt;
		// DB에 user 삽입. DB로직은 authService에서.
		const user = await authService.createUser(req.body);

		// 예외처리
		if (!user) res.status(400).send("Invalid body.");
		const newUser = await authService.getUser(req.body.email);

		// 예외처리
		if (!newUser) res.status(500).send("Cannot find user.");
		//다음 미들웨어
		req.user = newUser;
		next();
	},
	insertUserToken,
	async (req, res) => {
		res.send("Signup successed!");
	}
);

module.exports = router;
