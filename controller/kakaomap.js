const axios = require("axios");
const express = require("express");
const router = express.Router();
const kakaoService = require("../services/kakaomap.service");

// Deprecated
router.get("/map/:address", kakaoService.searchWithQuery);

router.get("/stores", kakaoService.getStores);

/* 이미지 응답 라우터 */
router.get("/place/:id", kakaoService.getImageUrl);

router.get("/basic", kakaoService.getBasicInfo);

module.exports = router;
