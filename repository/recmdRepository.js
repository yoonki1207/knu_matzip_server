const connection = require("../database/database");

const getStoreIds = async () => {
	const qry = `SELECT id, place_name FROM storetbl limit 5;`;
	try {
		const result = await connection.query(qry);
		return result[0];
	} catch (error) {
		throw error;
	}
};

module.exports = { getStoreIds };
