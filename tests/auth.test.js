const request = require("supertest");
const app = require("../app");
const responseBody = require("../utils/responseBody");

describe("Test", () => {
	it("Test for signup", async () => {
		const response = await request(app).post("/auth/signup").send({
			birth_year: "2000-12-12",
			phone_number: "010-0000-0001",
			email: "test_user1@gmail.com",
			nickname: "test_user1",
			password: "asdasd",
			gender: "MALE",
		}); // TODO: 모델 객체 만들어서 DB값 초기화하는 코드 생성할 것
		console.log("RESPONSE", response.body);
		expect(response.body).toStrictEqual(
			responseBody("Signup successed!", true)
		);
	});
});
