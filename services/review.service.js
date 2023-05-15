// reviewRepository.js 에서 얻어온 정보를 바탕으로 가공후 controller인 review.js에게 보냄.

const {
	createReview,
	readReview,
	updateReview,
	deleteReview,
} = require("../repository/reviewRepository");

/**
 *
 * @param {string} store_id primary key from storetbl
 * @param {int} user_id primary key from usertbl
 * @param {string} content Content for store review
 * @param {int} rating 1 to 10. 0 is not allow
 */

// Review 작성
const writeReview = async (store_id, user_id, content, rating) => {
	return await createReview(store_id, user_id, content, rating);
};

// Review 불러오기
const getReview = async (store_id) => {
	return await readReview(store_id);
};

// Review 수정
const rewriteReview = async (content, rating, store_id, user_id) => {
	if (rating > 10 || rating < 1) {
		return "Rating range exception.";
	}
	return await updateReview(content, rating, store_id, user_id);
};

// Review 삭제
const delReview = async (store_id, user_id) => {
	return await deleteReview(store_id, user_id);
};

module.exports = {
	writeReview,
	getReview,
	rewriteReview,
	delReview,
	readReview,
};
