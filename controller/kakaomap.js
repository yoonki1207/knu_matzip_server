const axios = require("axios");
const express = require("express");
const router = express.Router();
const kakaoService = require("../services/kakaomap.service");
const responseBody = require("../utils/responseBody");

// Deprecated
router.get("/map/:address", async (req, res) => {
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
});

router.get("/cate/:category_group_code", async function (req, res, next) {
	try {
		const data = await kakaoService.getFoodsWithOptions(req.query);
		res.send(responseBody("카테고리 지점 결과를 반환합니다.", data));
	} catch (error) {
		console.error(error);
		res.status(500).send(responseBody("Internal Server Error", false));
	}
});

/* 이미지 응답 라우터 */
router.get("/place/:id", async (req, res, next) => {
	const place_url = req.params.id;
	const result = await kakaoService.getImageUrl(place_url);
	res.send(responseBody("이미지 응답 완료.", result));
});

module.exports = router;
