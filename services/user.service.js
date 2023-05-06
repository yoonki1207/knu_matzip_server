const { getUser } = require("./auth.service");

const findUser = async (user_id) => {
	return await getUser(user_id);
};

module.exports = { findUser };
