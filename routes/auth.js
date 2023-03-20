const express = require("express");
const bcrypt = require("bcrypt");
const { printML } = require("../utils/matFac");
const router = express.Router();
const authModel = require("../models/auth.model");
const logToFile = require("../utils/logToFile");
const requestIp = require("request-ip");

/* The "/auth" route */

router.use((req, res, next) => {
	console.log(requestIp.getClientIp(req));
	console.log(req.connection.remoteAddress);
	console.log(
		"IP: ",
		req.headers["X-Forwarded-For"] || req.headers["x-forwarded-for"]
	);
	const user_ip = req.ip || req.ips;
	logToFile(`request '/auth' from  ip '${user_ip}'`);
	next();
});

router.get("/", async (req, res, next) => {
	const access_token = req.headers.authorization.split("Bearer ")[1];
	const verify = await authModel.getPayloadByToken(access_token);
	console.log(verify);
	res.send(verify);
});

// TODO: 임시 route입니다. 수정 및 보안 수정이 필요합니다.
router.post("/login", async (req, res, next) => {
	const user = await authModel.getUser(req.body.email);

	if (!user) res.send("Not found user");

	const token = await authModel.createAccessToken(user.email, user.name);
	res.send(token);
});

router.post("/signup", async (req, res, next) => {
	const { password } = req.body;
	const encrypt = await bcrypt.hash(password, process.env.BCRYPT_SALT);
	req.body.password = encrypt;
	const isVaild = await authModel.createUser(req.rbody);
});

module.exports = router;
