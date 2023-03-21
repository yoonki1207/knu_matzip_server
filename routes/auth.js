/* The "/auth" route */
const express = require("express");
const bcrypt = require("bcrypt");
const { printML } = require("../utils/matFac");
const router = express.Router();
const authModel = require("../models/auth.model");
const logToFile = require("../utils/logToFile");
const requestIp = require("request-ip");

/* import middlewares */
const { userAuth } = require("../middlewares/authentication");

/* Middlewares */
router.use((req, res, next) => {
	const user_ip =
		req.headers["X-Forwarded-For"] ||
		req.connection.address ||
		req.ip ||
		req.ips;
	logToFile(`request '/auth' from  ip '${user_ip}'`);
	next();
});

/* Routes */
router.get("/", userAuth, async (req, res, next) => {
	const access_token = req.headers.authorization.split("Bearer ")[1];
	const verify = await authModel.getPayloadByToken(access_token);
	res.send(verify);
});

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
	res.send({ accessToken, refreshToken });
});

router.post("/signup", async (req, res, next) => {
	const { password } = req.body;
	const encrypt = await bcrypt.hash(password, +process.env.BCRYPT_SALT);
	req.body.password = encrypt;
	const user = await authModel.createUser(req.body);
	res.send(user);
});

module.exports = router;
