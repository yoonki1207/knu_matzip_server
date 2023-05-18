var express = require("express");
const responseBody = require("../utils/responseBody");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
	res.send(responseBody(200, "Knu matzip RESTApi from Express. 0.0.1", true));
});

module.exports = router;
