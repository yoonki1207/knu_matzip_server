const axios = require("axios");
const express = require("express");
const router = express.Router();

router.get("/map/:address", async (req, res) => {
	const address = req.params.address; // 요청 주소에서 검색어를 가져옵니다.
	const apiUrl = `https://dapi.kakao.com/v2/local/search/address.json?query=${address}`;

	try {
		const response = await axios.get(apiUrl, {
			headers: {
				Authorization: `KakaoAK ${process.env.API_KEY}`, // API 키를 헤더에 넣어서 요청합니다.
			},
		});

		const { documents } = response.data;
		res.send(response.data); // 검색 결과를 JSON 형태로 반환합니다.
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error"); // 에러 발생 시 500 에러를 반환합니다.
	}
});

router.get("/cate/:category", async function (req, res, next) {
	//  37.270252 127.126146
	const category_code = req.params.category;
	const { x, y, radius, page, size, sort } = req.query;
	console.log(x, y, radius, page, size, sort ?? "s");
	const apiUrl = `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=${category_code}&y=${
		y ?? 37.270252
	}&x=${x ?? 127.126146}&radius=${radius ?? 500}&page=${page ?? 1}&size${
		size ?? 15
	}&sort=${sort ?? "accuracy"}`;

	try {
		const response = await axios.get(apiUrl, {
			headers: {
				Authorization: `KakaoAK ${process.env.API_KEY}`,
			},
		});
		res.send(response.data);
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});

module.exports = router;
