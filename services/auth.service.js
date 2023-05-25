const connection = require("../database/database");
const jwt = require("jsonwebtoken");
const database = require("../database/database");

// access token으로 변경
const getUser = async (email) => {
	const qry = "SELECT * FROM usertbl WHERE email=?";
	try {
		const result = await connection.query(qry, [email]);
		return result[0][0];
	} catch {
		return null;
	}
};

const getUserById = async (user_id) => {
	const qry = "SELECT * FROM usertbl WHERE user_id=?";
	try {
		const result = await connection.query(qry, [user_id]);
		return result[0][0];
	} catch {
		return null;
	}
};

/**
 * It returns json like {"email": string,"nickname": string, "iat": number, "exp": number}
 * @param {string} token
 * @returns string|jwt.JwtPayload|null
 */
const getPayloadByToken = (token) => {
	try {
		const payload = jwt.decode(token);
		return payload;
	} catch (error) {
		return null;
	}
};

const verifyToken = async (token) => {
	try {
		const verify = jwt.verify(token, process.env.JWT_SECRET);
		return verify;
	} catch (error) {
		return null;
	}
};

/**
 * It returns true when token is expired,
 * It returns false when token is not expred,
 * It returns null when invalud token.
 * @param {string} token access token.
 * @returns boolean
 */
const isExpriedToken = async (token) => {
	const payload = await getPayloadByToken(token);
	if (!payload) {
		console.error("Invalid token from isExpriedToken().");
		return null;
	}
	const exp = payload.exp;
	const now = (new Date().getTime() + 1) / 1000;
	return exp < now;
};

const isValidRefreshToken = async (refresh_token) => {
	const qry = "SELECT * FROM refresh_token WHERE refresh_token=?";
	const result = await database.query(qry, [refresh_token]);
	return result[0][0];
};

const createToken = (email, nickname, expiresIn) => {
	const token = jwt.sign({ email, nickname }, process.env.JWT_SECRET, {
		expiresIn,
	});
	return token;
};

const createAccessToken = (email, nickname) => {
	return createToken(email, nickname, "30m");
};

const createRefreshToken = (email, nickname) => {
	return createToken(email, nickname, "1w");
};

const setToken = async (user_id, access_token, refresh_token) => {
	try {
		const user = await getUserById(user_id);
		if (!user) throw new Error("Not foun user.");
		const qry =
			"INSERT INTO refresh_token (access_token, refresh_token) VALUES (?, ?);";
		const token_id = user.token_id;
		if (token_id) {
			await database.query("DELETE FROM refresh_token WHERE id=?", [token_id]);
		}
		const result = await database.query(qry, [access_token, refresh_token]);
		const insertId = result[0].insertId;
		// await database.query("UPDATE usertbl SET token_id=? WHERE user_id=?", [
		// 	insertId,
		// 	user_id,
		// ]);
		return result;
	} catch (error) {
		console.error(error);
		return "Failed to insert token pair.";
	}
};
const createUser = async (body) => {
	const qry = `INSERT INTO usertbl 
			(birth_year, phone_number, email, password, nickname, gender) 
			VALUES (?, ?, ?, ?, ?, ?)`;
	const { birth_year, phone_number, email, password, nickname, gender } = body;
	console.log(birth_year);

	try {
		await connection.query(
			qry,
			[birth_year, phone_number, email, password, nickname, gender],
			async (error, results, fields) => {
				console.error(results);
				if (error) {
					throw error;
				}
			}
		);

		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
};

const findTokenWithRT = async (token) => {
	const qry = `SELECT * FROM refresh_token WHERE refresh_token=?`;
	try {
		const result = await connection.query(
			qry,
			[token],
			async (error, results, fileds) => {}
		);
		return result[0][0];
	} catch (error) {
		console.error(error);
		return false;
	}
};

module.exports = {
	getUser,
	getUserById,
	getPayloadByToken,
	verifyToken,
	isValidRefreshToken,
	createAccessToken,
	createRefreshToken,
	setToken,
	createUser,
	isExpriedToken,
	findTokenWithRT,
};
