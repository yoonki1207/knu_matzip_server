var express = require("express");
const { userAuth } = require("../middlewares/authentication");
const { findUser } = require("../services/user.service");
var router = express.Router();

/* GET users listing. */
router.get("/", userAuth, async (req, res, next) => {
	const {
		user_id,
		nickname,
		phone_number,
		profile_url,
		login_date,
		gender,
		email,
		role,
	} = req.user;
	const user = {
		user_id,
		nickname,
		phone_number,
		profile_url,
		login_date,
		gender,
		email,
		role,
	};
	res.send(user);
});

router.get("/:user_id", async (req, res, next) => {
	const user = findUser(req.params.user_id);
});

module.exports = router;
