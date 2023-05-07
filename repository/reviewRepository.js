const connection = require("../database/database");

const insertReview = async (review) => {
	const qry = `INSERT INTO reviewtbl
  (store_id, user_id, )`;
	try {
		const result = await connection.query();
	} catch (error) {
		console.error(error);
		return "Failed to insert";
	}
};
