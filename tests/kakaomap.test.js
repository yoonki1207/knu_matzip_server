const request = require("supertest");
const app = require("../app");
const responseBody = require("../utils/responseBody");

describe("Test for Kakaomap routes", () => {
	it("Should be map stores", async () => {
		const response = await request(app).get("/maps/stores");
		expect(response.body.message).toBe("식당 정보 응답 성공.");
	});
});
