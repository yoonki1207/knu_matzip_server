const authService = require("../services/auth.service");
/**
 *
 * @param {Request<ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>} req
 * @param {Response<any, Record<string, any>, number>} res
 * @param {NextFunction} next
 */
const userAuth = async (req, res, next) => {
	const access_token = req.headers.authorization.split("Bearer ")[1];
	const verify = await authService.verifyToken(access_token);
	if (!verify) {
		// AT is invalid. It can be expried or not a token.
		const isExpired = await authService.isExpriedToken(access_token);
		console.log(isExpired);
		if (!isExpired || isExpired === null) {
			res.status(400).send("Valid access token requried.");
			return;
		} else {
			// AT is valid and expried.
			const refresh_token = req.headers["refresh_token"];
			if (!refresh_token) {
				res.status(400).send("Try request with refresh_token again.");
			}
			const result = await authService.findTokenWithRT(refresh_token);
			if (result.access_token === access_token) {
				// re-authorization.
				const payload = authService.getPayloadByToken(refresh_token);
				const nat = authService.createAccessToken(
					payload.email,
					payload.nickname
				);
				res.cookie("access_token", nat);
				req.user = await authService.getUser(payload.email);
				console.log("RT", payload);
				next();
			} else {
				// TODO: return false and drop the record. Client should to login again.
			}
			return;
		}
	} else {
		// AT is valid.
		const payload = authService.getPayloadByToken(access_token);
		req.user = await authService.getUser(payload.email);
		console.log("AT", payload);
		next();
	}
	return;
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
		user.nickname
	);
	const refreshToken = await authService.createRefreshToken(
		user.email,
		user.nickname
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
