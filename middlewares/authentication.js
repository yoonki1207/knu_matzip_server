const authModel = require("../models/auth.model");

/**
 *
 * @param {Request<ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>} req
 * @param {Response<any, Record<string, any>, number>} res
 * @param {NextFunction} next
 */
const userAuth = async (req, res, next) => {
	console.log(req.headers);
	try {
		const access_token = req.headers.authorization.split("Bearer ")[1];
		const verify = await authModel.getPayloadByToken(access_token);
		if (verify) {
			next();
		} else {
			throw new Error();
		}
	} catch (error) {
		console.log(error);
		res.status(400).send("Invalid access token. Request refresh token.");
	}
};

module.exports = { userAuth };
