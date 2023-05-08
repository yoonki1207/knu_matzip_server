/* 데이터 테이블이 생성이 되면, 받아온 정보를 데이터베이스(ex. MySQL)에 저장하고 조회하는 기능을 수행 */
// database 불러오기
const connection = require("../database/database");

// review 작성(Create)
const createReview = async (review) => {
	const qry = `INSERT INTO reviewtbl
  (store_id, user_id, content, rating)
	VALUES(?, ?, ?, ?);`;
	try {
		const result = await connection.query(qry, [review]);
		return result;
	} catch (error) {
		console.error(error);
		return "Query incorrect - Failed to insert";
	}
};

// review 조회하기(Read)
const readReview = async (review) => {
	const qry = `SELECT * FROM reviewtbl WHERE store_id = ?`;
	// 예외 처리
	try{
		// DB에 있는 정보를 review에 저장 및 리턴
		const result = await connection.query(qry, [review]);
		return result;
	} catch (error){
		console.error(error);
		return "Query incorrect - Failed to Read review"
	}
};

// review 업데이트(Update)
const updateReview = async (review) => {
	const qry = `UPDATE reviewtbl
  SET content = ?, rating = ?
	WHERE store_id = ? AND user_id = ?`;
	try {
		const result = await connection.query(qry, [review]);
		return result;
	} catch (error) {
		console.error(error);
		return "Query incorrect - Failed to update";
	}
};

// review 삭제(Delete)
const deleteReview = async (review) => {
	const qry = `DELETE FROM reviewtbl 
	WHERE store_id = ? AND user_id = ?`;
	try {
		const result = await connection.query(qry, [review]);
		return result;
	} catch (error) {
		console.error(error);
		return "Query incorrect - Failed to delete";
	}
};

module.exports = { createReview };
module.exports = { readReview };
module.exports = { updateReview };
module.exports = { deleteReview };