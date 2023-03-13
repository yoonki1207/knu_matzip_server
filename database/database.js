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
	role varchar(20), -- 직업
	created_at Date, -- 가입일
	updated_at Date
);`,
	function (err, rows) {
		if (err) throw err;
		console.log(rows);
	}
);

module.exports = database;
