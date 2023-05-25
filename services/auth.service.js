const connection = require("../database/database");
const jwt = require("jsonwebtoken");
const database = require("../database/database");
const bcrypt = require("bcrypt");
const responseBody = require("../utils/responseBody");

/**
 * 유저 토큰이 유효한지 테스트합니다.
 * @param {Request} req
 * @param {Response} res
 * @param {*} next
 */
const userValidation = async (req, res, next) => {
	const access_token = req.headers.authorization.split("Bearer ")[1];
	res.send(responseBody(`Verified! Hello, ${req.user.nickname}!`, true));
};

/**
 * 로그인 성공시 next, 실패시 500을 response함.
 * @param {Request} req
 * @param {Reponse} res
 * @param {*} next 성공하면 next()를 호출함.
 * @returns
 */
const loginMiddleware = async (req, res, next) => {
	// user data DB에서 가져오기 - getUser 참고
	const user = await getUser(req.body.email);
	if (!user) {
		res.send("Not found user.");
		return;
	}
	const isValid = await bcrypt.compare(req.body.password, user.password);
	if (!isValid) res.status(400).send(responseBody("Invalid password.", false));
	else {
		// 다음 미들웨어
		req.user = user;
		next();
	}
};

/**
 * 로그인 성공 메시지
 * @param {Request} req
 * @param {Response} res
 */
const loginSuccess = async (req, res) => {
	res.send(responseBody("Login Success!", true));
};

/**
 * 회원가입 미들웨어입니다.
 * 유효한 body가 요구됩니다.
 * 필수로 birth_year, phone_number, email, password, nickname, gender 가 요구됩니다.
 * @param {Request} req
 * @param {Reponse} res
 * @param {*} next
 * @returns
 */
const signupMiddleware = async (req, res, next) => {
	// 패스워드 가져오기
	const { password } = req.body;
	// bcrypt 모듈로 패스워드 암호화
	console.log(req.body, +process.env.BCRYPT_SALT);
	const encrypt = await bcrypt.hash(password, +process.env.BCRYPT_SALT);
	// req 객체에 암호화된 패스워드를 삽입
	req.body.password = encrypt;
	// DB에 user 삽입. DB로직은 서.
	const user = await createUser(req.body);

	// 예외처리
	if (!user) {
		res.status(400).send(responseBody("Invalid body.", false));
		return;
	}
	const newUser = await getUser(req.body.email);

	// 예외처리
	if (!newUser) {
		res.status(500).send(responseBody("Cannot find user.", false));
		return;
	}
	//다음 미들웨어
	req.user = newUser;
	next();
};

/**
 * 회원가입 성공 메시지
 * @param {Request} req
 * @param {Response} res
 */
const signupSuccess = async (req, res) => {
	res.send(responseBody("Signup successed!", true));
};

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
	loginMiddleware,
	loginSuccess,
	signupMiddleware,
	signupSuccess,
	userValidation,
};
