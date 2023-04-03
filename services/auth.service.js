// 데이터베이스에 대한 로직 
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

const isValidRefreshToken = async (refresh_token) => {
	const qry = "SELECT * FROM refresh_token WHERE refresh_token=?";
	const result = await database.query(qry, [refresh_token]);
	return result[0][0];
};

const createAccessToken = async (email, name) => {
	const token = jwt.sign({ email, name }, process.env.JWT_SECRET, {
		expiresIn: "1m",
	});
	return token;
};

const createRefreshToken = async (email, name) => {
	const token = jwt.sign({ email, name }, process.env.JWT_SECRET, {
		expiresIn: "1w",
	});
	return token;
};

const setToken = async (user_id, access_token, refresh_token) => {
	try {
		const user = await getUserById(user_id);
		const qry =
			"INSERT INTO refresh_token (access_token, refresh_token) VALUES (?, ?);";
		const token_id = user.token_id;
		if (token_id) {
			await database.query("DELETE FROM refresh_token WHERE id=?", [token_id]);
		}
		const result = await database.query(qry, [access_token, refresh_token]);
		const insertId = result[0].insertId;
		await database.query("UPDATE usertbl SET token_id=? WHERE user_id=?", [
			insertId,
			user_id,
		]);
	} catch (error) {
		console.error(error);
	}
};
const createUser = async (body) => {
	const qry =
		"INSERT INTO usertbl (name, birth_year, phone_number, email, password, nickname, gender) VALUES (?, ?, ?, ?, ?, ?, ?)";
	const { name, birth_year, phone_number, email, password, nickname, gender } =
		body;
	console.log(name, birth_year);

	try {
		await connection.query(
			qry,
			[name, birth_year, phone_number, email, password, nickname, gender],
			async (error, results, fields) => {
				console.error(results);
				if (error) {
					throw error;
				}
			}
		);

		return true;
	} catch (error) {
		console.log(error);
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
};
