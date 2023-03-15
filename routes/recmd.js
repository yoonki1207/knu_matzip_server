const axios = require("axios");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get("/popular", async function (req, res) {
	try {
		const access_token = req.headers.authorization.split("Bearer ")[1];

		// TODO: token -> get user -> send response items of stores using ALS algorithm in matFac.js.
	} catch (error) {}
});

module.exports = router;
