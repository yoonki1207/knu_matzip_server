/* The "/auth" route */
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const authModel = require("../models/auth.model");

/* import middlewares */
const { userAuth } = require("../middlewares/authentication");

/* Routes */
router.get("/", userAuth, async (req, res, next) => {
	const access_token = req.headers.authorization.split("Bearer ")[1];
	const verify = await authModel.getPayloadByToken(access_token);
	res.send(`Verified! Hello, ${verify.name}!`);
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
	await authModel.setToken(user.user_id, accessToken, refreshToken);
	res.cookie("access_token", accessToken);
	res.cookie("refresh_token", refreshToken);
	res.send("Login Success!");
});

router.post("/signup", async (req, res, next) => {
	const { password } = req.body;
	const encrypt = await bcrypt.hash(password, +process.env.BCRYPT_SALT);
	req.body.password = encrypt;
	const user = await authModel.createUser(req.body);
	res.send(user);
});

module.exports = router;
