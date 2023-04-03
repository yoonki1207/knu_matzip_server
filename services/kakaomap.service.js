const axios = require("axios");
const cheerio = require("cheerio");
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

/**
 *
 * @param {string} place_url
 */
const getImageUrl = async (place_url) => {
	const URL = `https://place.map.kakao.com/main/v/`;
	var place_number = 0;
	try {
		place_number = parseInt(place_url);
	} catch (error) {
		console.log(error);
		return `Error: Cannot parse to Integer with ${place_url}`;
	}
	const result = await axios.get(URL + place_number);
	const image_url = result.data.basicInfo.mainphotourl;
	return image_url;
};

module.exports = { getFoodsWithOptions, getImageUrl };
