const authModel = require("../services/auth.service");
const authService = require("../services/auth.service");

/**
 *
 * @param {Request<ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>} req
 * @param {Response<any, Record<string, any>, number>} res
 * @param {NextFunction} next
 */
const userAuth = async (req, res, next) => {
	try {
		const refresh_token = req.headers["refresh_token"];
		if (refresh_token) {
			const verifyToken = await authModel.verifyToken(refresh_token);
			const isValidRefreshToken = await authModel.isValidRefreshToken(
				refresh_token
			);
			if (verifyToken && isValidRefreshToken) {
				console.log("VALID REFRESH:", isValidRefreshToken);
				console.log(verifyToken.email, verifyToken.name);
				const access_token = await authModel.createAccessToken(
					verifyToken.email,
					verifyToken.name
				);
				const user = authService.getUser(email);
				await authService.setToken(user.user_id, access_token, refresh_token);
				res.cookie("access_token", access_token);
			}
			next();
		} else {
			const access_token = req.headers.authorization.split("Bearer ")[1];
			const verify = await authModel.verifyToken(access_token);
			if (verify) {
				console.log(verify);
				next();
			} else {
				const payload = authModel.getPayloadByToken(access_token);
				if (payload) {
					res
						.status(400)
						.send("Token is expired. Request the refresh token to server.");
				} else {
					throw new Error();
				}
			}
		}
	} catch (error) {
		console.log(error);
		res.status(400).send("Invalid access token. Request refresh token.");
	}
};

/**
 *
 * @param {Request<ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>} req
 * @param {Response<any, Record<string, any>, number>} res
 * @param {NextFunction} next
 */
const insertUserToken = async (req, res, next) => {
	const user = req.user;
	if (!user) res.status(500).send("Server error");
	const accessToken = await authService.createAccessToken(
		user.email,
		user.name
	);
	const refreshToken = await authService.createRefreshToken(
		user.email,
		user.name
	);
	try {
		await authService.setToken(user.user_id, accessToken, refreshToken);
		res.cookie("access_token", accessToken);
		res.cookie("refresh_token", refreshToken);
		next();
	} catch (e) {
		console.error(e);
		res.status(500).send("Server token error");
	}
};

module.exports = { userAuth, insertUserToken };
