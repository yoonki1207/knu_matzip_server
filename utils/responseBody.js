/**
 *
 * @param {number} statusCode 응답 코드
 * @param {string} msg 응답 메시지
 * @param {object} data 응답 객체
 * @returns
 */
const responseBody = (statusCode, msg, data) => {
	const result = { status: statusCode, message: msg, data };
	return result;
};

module.exports = responseBody;
