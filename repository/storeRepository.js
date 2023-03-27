const connection = require("../database/database");

/**
 *
 * @param {string} store_id
 * @param {string} name
 * @param {string} category_name
 * @param {string} content
 */
const setStore = async (store_id, name, category_name, content) => {
	const qry = `INSERT INTO storetbl (store_id, name, category_name, content) VALUES (?, ?, ?, ?);`;
	try {
		const result = await connection.query(qry, [
			store_id,
			name,
			category_name,
			content,
		]);
		return result;
	} catch {
		return "Failed to insert";
	}
};

module.exports = { setStore };
