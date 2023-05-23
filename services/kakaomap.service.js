const axios = require("axios");
const cheerio = require("cheerio");
const sotreRepository = require("../repository/storeRepository");
const responseBody = require("../utils/responseBody");

const ApiURL = "https://dapi.kakao.com/v2/local/search/category.json";

/**
 * 검색어로 검색한 결과를 응답합니다.
 */
const searchWithQuery = async (req, res) => {
	const address = req.params.address; // 요청 주소에서 검색어를 가져옵니다.
	const apiUrl = `https://dapi.kakao.com/v2/local/search/address.json?query=${address}`;

	try {
		const response = await axios.get(apiUrl, {
			headers: {
				Authorization: `KakaoAK ${process.env.API_KEY}`, // API 키를 헤더에 넣어서 요청합니다.
			},
		});

		res.send(responseBody("검색 결과를 반환합니다.", response.data)); // 검색 결과를 JSON 형태로 반환합니다.
	} catch (error) {
		console.error(error);
		res.status(500).send(responseBody("Internal Server Error", false)); // 에러 발생 시 500 에러를 반환합니다.
	}
};

const getStores = async (req, res) => {
	try {
		const data = await getFoodsWithOptions(req.query);
		res.send(responseBody("식당 정보 응답 성공.", data));
	} catch (error) {
		res.status(500).send("Internal Service Error", false); // TODO: Refactor kakaopmap files and test
	}
};

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
 * 이미지 url을 응답합니다.
 * @param {Request} req
 * @param {Response} res
 */
const getImageUrl = async (req, res) => {
	const place_url = req.params.id;
	const basicInfo = await getBasicInfo(place_url);
	const image_url = basicInfo.mainphotourl;
	res.send(responseBody("이미지 응답 완료", image_url));
};

/**
 * 이미지 url을 응답합니다.
 * @param {Request} req
 * @param {Response} res
 */
const getBasicInfo = async (req, res) => {
	try {
		const result = await _getBasicInfo(req.params.id);
		res.send(result);
	} catch (error) {
		res
			.status(500)
			.send("Kakaomap API를 불러오는 중 에러가 발생했습니다.", false);
	}
	return;
};

const _getBasicInfo = async (place_url) => {
	const URL = `https://place.map.kakao.com/main/v/`;
	var place_number = 0;
	try {
		place_number = parseInt(place_url);
	} catch (error) {
		console.log(error);
		return `Error: Cannot parse to Integer with ${place_url}`;
	}
	const result = await axios.get(URL + place_number);
	const basicInfo = result.data.basicInfo;
	return basicInfo;
};

module.exports = {
	searchWithQuery,
	getStores,
	getImageUrl,
	getBasicInfo,
};
