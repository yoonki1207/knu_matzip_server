const express = require("express");
const bcrypt = require("bcrypt");
const { printML } = require("../utils/matFac");
const router = express.Router();
const authModel = require("../models/auth.model");
const logToFile = require("../utils/logToFile");

/* The "/auth" route */

router.use(function (req, res, next) {
	const ip = req.headers["x-forwared-for"] || req.connection.remoteAddress;
	logToFile(`request '/auth' from  ip '${ip}'`);
	next();
});

router.get("/", function (req, res, next) {
	res.send("Requested route /auth");
});

// TODO: 임시 route입니다. 수정 및 보안 수정이 필요합니다.
router.post("/login", async (req, res, next) => {
	const user = await authModel.getUser(req.body.email);

	if (!user) {
		res.send("Not found user");
	}

	res.send(user);
});

router.post("/signup", async (req, res, next) => {
	const { password } = req.body;
	const encrypt = await bcrypt.hash(password, process.env.BCRYPT_SALT);
	req.body.password = encrypt;
	const isVaild = await authModel.createUser(req.rbody);
});

module.exports = router;
