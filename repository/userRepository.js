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

module.exports = { getUser };
