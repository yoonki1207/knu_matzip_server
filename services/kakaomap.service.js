const axios = require("axios");
const sotreRepository = require("../repository/storeRepository");

const ApiURL = "https://dapi.kakao.com/v2/local/search/category.json";

/**
 *
 * @param {Object} param0 kakao api paramas
 * @returns fetch data or throws error
 */
const getFoodsWithOptions = async ({
	x = 127.126146,
	y = 37.270252,
	radius = 500,
	page = 1,
	size = 15,
	category_group_code = "FD6",
	sort = "accuracy",
}) => {
	const params = `?category_group_code=${category_group_code}&y=${y}&x=${x}&radius=${radius}&page=${page}&size=${size}&sort=${sort}`;
	try {
		const response = await axios.get(ApiURL + params, {
			headers: {
				Authorization: `KakaoAK ${process.env.API_KEY}`,
			},
		});

		// data preprocess
		const stores = response.data.documents;
		stores.map(async (store) => await sotreRepository.setStore(store));

		return response.data;
	} catch (error) {
		throw error;
	}
};

module.exports = { getFoodsWithOptions };
