const connection = require("../database/database");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const database = require("../database/database");
const { getStoreIds } = require("../repository/recmdRepository");
const responseBody = require("../utils/responseBody");

const getPopular = async (req, res) => {
	const urls = await getStoreIds();
	const result = await _getImageUrls([...urls.map((val) => val.id)]);
	const data = urls.map((val, index) => {
		return { ...val, image_url: result[index] };
	});
	res.send(responseBody("응답 성공.", data));
};

/**
 *
 * @param {string[]} images
 * @returns
 */
const _getImageUrls = async (images) => {
	const URL = `https://place.map.kakao.com/main/v/`;
	var place_number = 0;
	const result = await Promise.all(
		images.map(async (place_url) => {
			try {
				place_number = parseInt(place_url);
			} catch (error) {
				console.log(error);
				return `Error: Cannot parse to Integer with ${place_url}`;
			}
			const result = await axios.get(URL + place_number);
			const basicInfo = result.data.basicInfo;
			return await basicInfo.mainphotourl;
		})
	);
	return result;
};

module.exports = { getPopular };
