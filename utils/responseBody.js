/**
 *
 * @param {number} statusCode 응답 코드
 * @param {string} msg 응답 메시지
 * @param {object} data 응답 객체
 * @returns
 */
const responseBody = (msg, data) => {
	const result = { message: msg, data };
	return result;
};

module.exports = responseBody;
