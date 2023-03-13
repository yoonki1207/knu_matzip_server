const mysql = require("mysql"); // load mysql library

// NODE_ENV 별 사용할 파일 세팅

const database = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

database.connect();

// usertbl 생성
database.query(
	`CREATE TABLE IF NOT EXISTS usertbl(
    user_id int AUTO_INCREMENT not null PRIMARY KEY, -- 회원 고유번호
    name varchar(24) not null, -- 실명
    birth_year Date not null,
    phone_number int(11) not null UNIQUE KEY, -- (UK)
    email varchar(30) not null UNIQUE KEY, -- email 겸 로그인 아이디(UK)
    password varchar(30) not null,
    nickname char(16) null UNIQUE KEY, -- (UK)
    gender char(4),
    role varchar(20), -- 직업 // GUEST(Not KNU Member), VAILD, ADMIN
    created_at Date, -- 가입일
    updated_at Date
  );`,
	function (err, rows) {
		if (err) throw err;
	}
);

database.query(
	`CREATE TABLE IF NOT EXISTS storetbl(
    store_id char(16) not null PRIMARY KEY, -- 가게 고유번호
    name varchar(60) not null, -- 가게이름
    category_name char(24),
    content varchar(100) -- 가게 내용(정보) e.g.
  );`,
	function (err, rows) {
		if (err) throw err;
	}
);

database.query(
	`CREATE TABLE IF NOT EXISTS reviewtbl(
    id int AUTO_INCREMENT not null PRIMARY KEY, -- 댓글 갯수(?)
    store_id char(16) not null, -- FK (storetbl)
    user_id int, -- FK (usertbl)
    nickname char(16), -- FK(usertbl)
    content varchar(100), -- 리뷰 내용
    rating float UNIQUE KEY, -- 평점 UK
    created_at date,
    updated_at time,
      
    FOREIGN KEY (store_id) REFERENCES storetbl(store_id),
    FOREIGN KEY (user_id) REFERENCES usertbl(user_id),
    FOREIGN KEY (nickname) REFERENCES usertbl(nickname)
  );`,
	function (err, rows) {
		if (err) throw err;
	}
);

database.query(
	`CREATE TABLE IF NOT EXISTS tag_storetbl(
    id int AUTO_INCREMENT not null PRIMARY KEY,
    store_id char(16) not null,
    category_name varchar(20) not null,
  
    FOREIGN KEY (store_id) REFERENCES storetbl(store_id)
  );`,
	function (err, rows) {
		if (err) throw err;
	}
);

module.exports = database;
