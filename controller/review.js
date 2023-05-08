const express = require("express");
const { userAuth } = require("../middlewares/authentication");
const reviewService = require("../services/review.service")
const router = express.Router();

/* Comments a review */
/* Create review */
router.post("/:store_id", userAuth, async (req, res, next) => {
	const review = await reviewService.writeReview(req.body.store_id, req.body.user_id, req.body.content, req.body.rating);
	if (!review) { 
		console.log('failed')
		res.send("failed create review")
		return; 
	}
	// 로그인된 회원만 리뷰 입력 가능
	if(review){
		if(review[1] == userAuth){
			res.render('');
		}
		else{
			res.send("로그인된 회원만 리뷰 쓰기 가능")
		}
	}
});

/* Get reviews from a borad */
/* Read review */
router.get("/:store_id", async (req, res, next) => {
	const review = await reviewService.getReview(req.body.store_id);
	if (!review) { 
		console.log('failed')
		res.send("failed read review")
		return; 
	}
	
});

/* Update reviews by id */
/* Update review */
router.put("/:store_id", async (req, res, next) => {});

/* delete reviews */
router.delete("/:store_id", async (req, res, next) => {});