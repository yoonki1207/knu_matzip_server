const connection = require("../database/database");
const jwt = require("jsonwebtoken");

// access token으로 변경
const getUser = async (email) => {
	const qry = "SELECT * FROM usertbl WHERE email=?";
	try {
		const result = await connection.query(
			qry,
			[email],
			async (error, results, fields) => {
				if (error) throw error;
				// console.log(results);
				return await results;
			}
		);
		console.log(result[0][0]);
		return result[0][0];
	} catch {
		return null;
	}
};

const getPayloadByToken = async (access_token) => {
	try {
		const verify = jwt.verify(access_token, process.env.JWT_SECRET);
		console.log(verify);
		return verify;
	} catch (error) {
		return null;
	}
};

const createAccessToken = async (email, name) => {
	const token = jwt.sign({ email, name }, process.env.JWT_SECRET, {
		expiresIn: "5m",
	});
	return token;
};

const createUser = async (body) => {
	const qry =
		"INSERT INTO usertbl (name, birth_year, phone_number, email, password, nickname, gender) VALUES (?, ?, ?, ?, ?, ?, ?)";
	const { name, birth_year, phone_number, email, password, nickname, gender } =
		body;

	try {
		const result = connection.query(
			qry,
			[name, birth_year, phone_number, email, password, nickname, gender],
			async (error, results, fields) => {
				if (error) throw error;
				return await results;
			}
		);

		return await result[0][0];
	} catch {}
};

module.exports = { getUser, getPayloadByToken, createAccessToken, createUser };
