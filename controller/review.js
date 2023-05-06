const express = require("express");
const { userAuth } = require("../middlewares/authentication");
const router = express.Router();

/* Comments a review */
router.post("/:store_id", userAuth, async (req, res, next) => {});

/* Get reviews from a borad */
router.get("/:store_id", async (req, res, next) => {});
