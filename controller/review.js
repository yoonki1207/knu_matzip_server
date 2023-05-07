const express = require("express");
const { userAuth } = require("../middlewares/authentication");
const reviewService = require("../services/review.service")
const router = express.Router();

/* Comments a review */
/* Create review */
router.post("/:store_id", userAuth, async (req, res, next) => {
	const review = await reviewService.writeReview(req.body.store_id, req.body.user_id, req.body.content, req.body.rating);
	if (!review) { res.send("failed")}
});

/* Get reviews from a borad */
/* Read review */
router.get("/:store_id", async (req, res, next) => {});

/* Update reviews by id */
/* Update review */
router.put("/:store_id", async (req, res, next) => {});

/* delete reviews */
router.delete("/:store_id", async (req, res, next) => {});