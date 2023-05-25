var express = require("express");
const { userAuth } = require("../middlewares/authentication");
const userService = require("../services/user.service");
var router = express.Router();

/* GET user info */
router.get("/", userAuth, userService.getUserInfo);

/* Patch user info */
router.patch("/", userAuth, userService.updateUserInfo);

module.exports = router;
