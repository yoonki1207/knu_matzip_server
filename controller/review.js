const express = require("express");
const { userAuth } = require("../middlewares/authentication");
const reviewService = require("../services/review.service");
const responseBody = require("../utils/responseBody");
const router = express.Router();

/* Comments a review */
/* Create review */
router.post("/:store_id", userAuth, async (req, res, next) => {
	const review = await reviewService.writeReview(
		req.body.store_id,
		req.user.user_id,
		req.body.content,
		req.body.rating
	);
	if (!review) {
		console.log("failed"); // DEBUG:
		res.status(400).send(responseBody(400, "리뷰 생성 실패.", false));
		return;
	}
	res.send(responseBody(200, "성공", review));
});

/* Get reviews from a borad */
/* Read review */
router.get("/", async (req, res, next) => {
	const review = await reviewService.getReview(req.body.store_id);
	if (!review) {
		console.log("failed"); // DEBUG:
		res.status(400);
		res.send(responseBody(400, "리뷰 읽기 실패.", false));
		return;
	}
	// 리뷰를 볼 html 파일 링크 - render
	res.send(responseBody(200, "성공", review));
});

/* Update reviews by id */
/* Update review */
router.put("/:store_id", userAuth, async (req, res, next) => {
	const review = await reviewService.rewriteReview(
		req.content,
		req.body.rating,
		req.body.store_id,
		req.user.user_id
	);
	if (!review) {
		console.log("failed"); // DEBUG:
		res.status(400);
		res.send(responseBody(400, "리뷰 업데이트에 실패.", false));
		return;
	}
	res.send(responseBody(200, "성공", review));
});

/* delete reviews */
router.delete("/:store_id", userAuth, async (req, res, next) => {
	if (!review) {
		console.log("failed"); // DEBUG:
		res.status(400);
		res.send(responseBody(400, "리뷰 삭제 실패.", false));
		return;
	}
	res.send(responseBody(200, "성공", review));
});

module.exports = router;
