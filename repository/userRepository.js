const connection = require("../database/database");

const getUser = async (user_id) => {
	const qry = `SELECT 
  user_id, nickname, profile_url, gender, role
  FROM usertbl WHERE user_id=?`;
	try {
		const result = await connection.query(qry, [user_id]);
		return result;
	} catch (error) {
		console.error(error);
		return "Failed to select";
	}
};

/**
 *
 * @param {string} id 유저 테이블 PK
 * @param {string} column_name 유저 테이블 컬럼 이름
 * @param {string} value 바뀔 값
 * @returns
 */
const updateUser = async (
	id,
	nickname,
	phone_number,
	gender,
	intro,
	profile_url
) => {
	// const cols = ["nickname", "phone_number", "gender", "intro", "profile_url"];
	// if (value === undefined) return null;
	const qry = `UPDATE usertbl SET 
	nickname=?,
	phone_number=?,
	gender=?,
	intro=?,
	profile_url=?
	WHERE user_id=?`;
	try {
		const result = await connection.query(qry, [
			nickname,
			phone_number,
			gender,
			intro,
			profile_url,
			id,
		]);
		return result;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

module.exports = { getUser, updateUser };
