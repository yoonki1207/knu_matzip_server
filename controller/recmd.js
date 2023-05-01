// 추천 모델 컨트롤러.
const express = require("express");
const { userAuth } = require("../middlewares/authentication");
const router = express.Router();

// 인기 있는 모듈 api
router.get("/popular", userAuth, async (req, res) => {
	// prototype은 매 request마다 db에서 꺼내온 결과를 연산하는 식으로,
	// release할 때는 유저와 식당의 interaction마다 db의 점수를 update하는 식.
	// 초기 버전은 그냥 평균 별점 순, 조회수 순
});

// 사용자별 맞춤 아이템 api
router.get("/user-recommend", async (req, res) => {
	const access_token = req.headers.authorization.split("Bearer ")[1];
	const user = getUserByToken(access_token);
});

module.exports = router;
