const connection = require("../database/database");

/**
 *
 * @param {string} store_id
 * @param {string} name
 * @param {string} category_name
 * @param {string} content
 */
const setStore = async (store) => {
	const qry = `INSERT INTO storetbl (id, category_group_code, category_group_name, phone, place_name, place_url, road_address_name, x, y) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;
	try {
		const result = await connection.query(qry, [
			store.id,
			store.category_group_code,
			store.category_group_name,
			store.phone,
			store.place_name,
			store.place_url,
			store.road_address_name,
			store.x,
			store.y,
		]);
		return result;
	} catch (error) {
		console.error(error);
		return "Failed to insert";
	}
};

module.exports = { setStore };
