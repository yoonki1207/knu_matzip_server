/* The "/auth" route */
const express = require("express");
const router = express.Router();
const authService = require("../services/auth.service");

/* import middlewares */
const { userAuth, insertUserToken } = require("../middlewares/authentication");

/* User validation */
router.get("/", userAuth, authService.userValidation);

/* Login */ //TODO: 로그인 시 DB에 마지막으로 로그인한 기록 남기기
router.post(
	"/login",
	authService.loginMiddleware,
	insertUserToken,
	authService.loginSuccess
);

/* Signup */
router.post(
	"/signup",
	authService.signupMiddleware,
	insertUserToken,
	authService.signupSuccess
);

module.exports = router;
