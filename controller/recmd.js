// 추천 모델 컨트롤러.
const express = require("express");
const { userAuth } = require("../middlewares/authentication");
const responseBody = require("../utils/responseBody");
const recmdService = require("../services/recmd.servcie");
const router = express.Router();

// 인기 있는 모듈 api
router.get("/popular", recmdService.getPopular);

// 사용자별 맞춤 아이템 api
router.get("/user-recommend", async (req, res) => {
	const access_token = req.headers.authorization.split("Bearer ")[1];
	const user = getUserByToken(access_token);
});

module.exports = router;
