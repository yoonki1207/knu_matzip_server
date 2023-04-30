// database 연결 및 테이블 만들기 부분
const mysql = require("mysql2/promise"); // load mysql library

// NODE_ENV 별 사용할 파일 세팅
const database = mysql.createPool({
	connectionLimit: 10, // 데이터 연결 통로를 한번에 10개로 제한함 - 지워도 되는 코드
	host: process.env.DB_HOST,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

const init = async () => {
	console.log("Create Database Tables...");
	try {
		// 	const resultUsrtbl = await database.query(
		// 		`CREATE TABLE IF NOT EXISTS refresh_token(
		//       id int AUTO_INCREMENT not null PRIMARY KEY,
		//       access_token char(200) not null,
		//       refresh_token char(200) not null,
		//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- 가입일
		//       updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		//       deleted_at DATETIME
		//     );`
		// 	);
		// 	// 유저
		// 	await database.query(
		// 		`CREATE TABLE IF NOT EXISTS usertbl(
		//       user_id int AUTO_INCREMENT not null PRIMARY KEY comment '회원 고유번호', -- 회원 고유번호
		//       name varchar(24) not null comment '회원 실명', -- 실명
		//       birth_year Date not null comment '회원 태어난 년도',
		//       phone_number varchar(20) not null UNIQUE KEY comment '회원 전화번호', -- (UK)
		//       email varchar(30) not null UNIQUE KEY comment 'email 겸 로그인 아이디', -- email 겸 로그인 아이디(UK)
		//       password varchar(200) not null comment '비밀번호',
		//       nickname char(16) null UNIQUE KEY comment '별명', -- (UK)
		//       gender char(4) comment '성별',
		//       role varchar(20) comment '직업', -- 직업 // GUEST(Not KNU Member), VAILD, ADMIN
		//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- 가입일
		//       updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		//       deleted_at DATETIME,
		//       token_id int,
		//       FOREIGN KEY (token_id) REFERENCES refresh_token(id)
		//     );`
		// 	);

		// 	// 가게정보
		// 	await database.query(
		// 		`CREATE TABLE IF NOT EXISTS storetbl(
		//       id char(16) not null PRIMARY KEY, -- 가게 고유번호
		//       category_group_code varchar(10) not null,
		//       category_group_name varchar(100) not null,
		//       phone varchar(15) not null,
		//       place_name varchar(100) not null,
		//       place_url varchar(100) not null,
		//       road_address_name varchar(100) not null,
		//       x varchar(100) not null,
		//       y varchar(100) not null,
		//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- 가입일
		//       updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		//       deleted_at DATETIME
		//     );`
		// 	);

		// 	// 리뷰
		// 	await database.query(
		// 		`CREATE TABLE IF NOT EXISTS reviewtbl(
		//       id int AUTO_INCREMENT not null PRIMARY KEY, -- 댓글 갯수(?)
		//       store_id char(16) not null, -- FK (storetbl)
		//       user_id int, -- FK (usertbl)
		//       nickname char(16), -- FK(usertbl)
		//       content varchar(100), -- 리뷰 내용
		//       rating float UNIQUE KEY, -- 평점 UK
		//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- 가입일
		//       updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		//       deleted_at DATETIME,

		//       FOREIGN KEY (store_id) REFERENCES storetbl(id),
		//       FOREIGN KEY (user_id) REFERENCES usertbl(user_id),
		//       FOREIGN KEY (nickname) REFERENCES usertbl(nickname)
		//   );`
		// 	);

		// 	// 가게 태그
		// 	await database.query(
		// 		`CREATE TABLE IF NOT EXISTS tag_storetbl(
		//       id int AUTO_INCREMENT not null PRIMARY KEY,
		//       store_id char(16) not null,
		//       category_name varchar(20) not null,

		//       FOREIGN KEY (store_id) REFERENCES storetbl(id)
		//       );`
		// 	);

		// 	// 찜 목록
		// 	await database.query(
		// 		`CREATE TABLE IF NOT EXISTS like_list(
		//       id int AUTO_INCREMENT not null PRIMARY KEY,
		//       store_id char(16) not null,
		//       user_id int not null,
		//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- 가입일
		//       updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		//       deleted_at DATETIME,

		//       FOREIGN KEY (store_id) REFERENCES storetbl(id),
		//       FOREIGN KEY (user_id) REFERENCES usertbl(user_id)
		//   );`
		// 	);

		return database;
	} catch (error) {
		console.log(error);
	}
};
init();
module.exports = database;
