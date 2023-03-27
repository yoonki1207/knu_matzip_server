/* HTTP메소드 함수 안에 있는 콜백함수
서버에 요청이 가기 전에 작업들을 처리(프런트, 백엔드 서로 다른 어플리케이션이 통신하는데 사용됨)
*/
const authModel = require("../models/auth.model");

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
				res.cookie(
					"access_token",
					await authModel.createAccessToken(verifyToken.email, verifyToken.name)
				);
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

module.exports = { userAuth };
