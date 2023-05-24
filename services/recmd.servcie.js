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
	const URL = `http://place.map.kakao.com/main/v/`;
	var place_number = 0;
	const urls = [];
	for (let i = 0; i < images.length; i++) {
		const getMainphotourl = async (place_url) => {
			try {
				place_number = parseInt(place_url);
			} catch (error) {
				console.log(error);
				return `Error: Cannot parse to Integer with ${place_url}`;
			}
			const result = await axios.get(URL + place_number, {
				headers: {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',},
			}
			);
			const basicInfo = result.data.basicInfo;
			return await basicInfo.mainphotourl;
		};
		const url = await getMainphotourl(images[i]);
		urls.push(url);
	}
	return urls;
};

module.exports = { getPopular };
