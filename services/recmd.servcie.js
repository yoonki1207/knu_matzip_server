const axios = require("axios");
const authService = require("../services/auth.service");
const { getStoreIds } = require("../repository/recmdRepository");
const responseBody = require("../utils/responseBody");

const getPopular = async (req, res) => {
	const data = await getInfos();
	res.send(responseBody("응답 성공.", data));
};

/**
 * It returns dummy infos
 * @returns {Promise<{id: string, title: string, image_url: string}>}
 */
const getInfos = async () => {
	const urls = await getStoreIds();
	const result = await _getImageUrls([...urls.map((val) => val.id)]);
	const data = urls.map((val, index) => {
		return { ...val, image_url: result[index] };
	});
	return data;
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
				headers: {
					"User-Agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
				},
			});
			const basicInfo = result.data.basicInfo;
			return await basicInfo.mainphotourl;
		};
		const url = await getMainphotourl(images[i]);
		urls.push(url);
	}
	return urls;
};

/**
 * 유저별 맞춤형 추천 데이터 제공.
 * @param {Request} req
 * @param {Response} res
 */
const userRecommend = async (req, res) => {
	const access_token = req.headers.authorization.split("Bearer ")[1];
	const paylaod = authService.getPayloadByToken(access_token);
	const user = await authService.getUser(paylaod.email);
	console.log(user);
	if (user.email !== null || user.email !== undefined) {
		// 유저 맞춤형 추천
		const data = await getInfos();
		console.log(data);
		res.send(responseBody(`${user.nickname} 맞춤형 추천.`, data));
	} else {
		// 비회원 유저 맞춤형 추천
		const data = await getInfos();
		res.send(responseBody(`비회원 추천`, data));
	}
	return;
};

module.exports = { getPopular, userRecommend };
