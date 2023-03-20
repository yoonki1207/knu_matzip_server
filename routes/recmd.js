// 추천 모델 컨트롤러.
const axios = require("axios");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authModel = require("../models/auth.model");

// 인기 있는 모듈 api
router.get("/popular", async (req, res) => {
	try {
		const access_token = req.headers.authorization.split("Bearer ")[1];

		// TODO: token -> get user -> send response items of stores using ALS algorithm in matFac.js.
	} catch (error) {}
});

// 사용자별 맞춤 아이템 api
router.get("/user-recommend", async (req, res) => {
	const access_token = req.headers.authorization.split("Bearer ")[1];
	const user = getUserByToken(access_token);
});

module.exports = router;
