var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
	res.send("Knu matzip RESTApi from Express. 0.0.1");
});

module.exports = router;
