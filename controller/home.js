// 메인 페이지 라우터
"use strict"; // 엄격 모드 / 디버깅이 쉬워지고 발생 가능한 에러들을 예방

const express = require("express");
const router = express.Router();

router.get("/", function(request,response){
  response.render("home/main");
});

router.get("/", function(request,response){
  response.render("home/signup");
});

router.get("/", function(request, response){
  response.render("home/login");
});

module.exports = router; // 라우터 내보내주기 위한 명령어