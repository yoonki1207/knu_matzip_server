const mysql = require("mysql"); // load mysql library

// NODE_ENV 별 사용할 파일 세팅
require("dotenv").config({
	path: process.env.NODE_ENV === "dev" ? ".env.dev" : ".env.production",
});

const database = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

database.connect();

module.exports = database;
