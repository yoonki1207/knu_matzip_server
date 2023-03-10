const express = require("express");
const router = express.Router();

/* The "/auth" route */

router.use(function (req, res, next) {
	const ip = req.headers["x-forwared-for"] || req.connection.remoteAddress;
	next();
});

router.get("/", function (req, res, next) {
	res.send("Requested route /auth");
});

module.exports = router;
