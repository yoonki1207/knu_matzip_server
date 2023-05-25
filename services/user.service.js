const { getUser } = require("./auth.service");
const responseBody = require("../utils/responseBody");
const userRepository = require("../repository/userRepository");

const findUser = async (user_id) => {
	return await getUser(user_id);
};

/**
 * 토큰으로 유저 정보를 반환합니다.
 * @param {Request} req
 * @param {Reponse} res
 * @param {*} next
 */
const getUserInfo = async (req, res, next) => {
	if (req.user === undefined) {
		res.status(400).send(responseBody("잘못된 요청입니다.", false));
		return;
	} else {
		const {
			user_id,
			nickname,
			phone_number,
			profile_url,
			login_date,
			gender,
			email,
			role,
		} = req.user;
		const user = {
			user_id,
			nickname,
			phone_number,
			profile_url,
			login_date,
			gender,
			email,
			role,
		};
		res.send(responseBody(true, user));
	}
	return;
};

/**
 * 유저 정보를 업데이트합니다. 토큰이 필요합니다.
 * @param {Request} req
 * @param {Response} res
 */
const updateUserInfo = async (req, res, next) => {
	var { nickname, phone_number, gender, intro, profile_url } = req.user;
	const id = req.user.user_id;
	if (req.body.nickname !== undefined) {
		nickname = req.body.nickname;
	}
	if (req.body.phone_number !== undefined) {
		phone_number = req.body.phone_number;
	}
	if (req.body.gender !== undefined) {
		gender = req.body.gender;
	}
	if (req.body.intro !== undefined) {
		intro = req.body.intro;
	}
	if (req.body.profile_url !== undefined) {
		profile_url = req.body.profile_url;
	}

	try {
		console.log(id, nickname, phone_number, gender, intro, profile_url);
		const result = await userRepository.updateUser(
			id,
			nickname,
			phone_number,
			gender,
			intro,
			profile_url
		);
		if (result[0].changedRows === 1)
			res.send(responseBody("유저 정보 수정 성공", true));
		else {
			res.send(responseBody("유저 정보 유지", false));
		}
	} catch (error) {
		console.error(error);
		res.status(400).send(responseBody("Invalid body.", false));
	}
};

module.exports = { findUser, getUserInfo, updateUserInfo };
