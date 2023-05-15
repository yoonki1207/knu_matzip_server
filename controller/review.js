const express = require("express");
const { userAuth } = require("../middlewares/authentication");
const reviewService = require("../services/review.service")
const router = express.Router();

/* Comments a review */
/* Create review */
router.post("/:store_id", userAuth, async (req, res, next) => {
	const review = await reviewService.writeReview(req.body.store_id, req.user.user_id, req.body.content, req.body.rating);
	if (!review) { 
		console.log('failed')
		res.status(400).send("failed create review")
		return; 
	}
	// 로그인된 회원만 리뷰 입력 가능
	// const user = user.find(u => u.user_id === parseInt(req.params.user_id))
	// if(!user){
	// 	res.status(404).send('Please login - only member can review')
	// 	return;
	// }
	res.send(review);
});

/* Get reviews from a borad */
/* Read review */
router.get("/", async (req, res, next) => {
	const review = await reviewService.getReview(req.body.store_id);
	if (!review) { 
		console.log('failed')
		res.status(400);
		res.send("failed read review")
		return; 
	}
	// 리뷰를 볼 html 파일 링크 - render
	res.send(review);
});

/* Update reviews by id */
/* Update review */
router.put("/:store_id", async (req, res, next) => {
	const review = await reviewService.rewriteReview(req.content, req.body.rating, req.body.store_id, req.body.user_id);
	if (!review) { 
		console.log('failed')
		res.status(400);
		res.send("failed update review")
		return; 
	}
	res.send(review);
});

/* delete reviews */
router.delete("/:store_id", async (req, res, next) => {
	if (!review) { 
		console.log('failed')
		res.status(400);
		res.send("failed delete review")
		return; 
	}
	res.send(review);
});

module.exports = router;