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
		const resultUsrtbl = await database.query(`
			-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS 'mydb' DEFAULT CHARACTER SET utf8 ;
USE 'mydb' ;

-- -----------------------------------------------------
-- Table 'mydb'.'usertbl'
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS 'mydb'.'usertbl' (
  'user_id' INT NOT NULL AUTO_INCREMENT,
  'email' VARCHAR(45) NOT NULL,
  'password' VARCHAR(45) NOT NULL,
  'nickname' VARCHAR(45) NOT NULL,
  'phone_number' VARCHAR(45) NULL,
  'birth_year' VARCHAR(45) NOT NULL,
  'gender' VARCHAR(45) NOT NULL,
  'role' VARCHAR(45) NOT NULL,
  'created_at' TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  'updated_at' TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  'deleted_at' TIMESTAMP NULL DEFAULT NULL,
  'login_date' VARCHAR(45) NULL,
  PRIMARY KEY ('user_id'),
  UNIQUE INDEX 'email_UNIQUE' ('email' ASC) VISIBLE,
  UNIQUE INDEX 'nickname_UNIQUE' ('nickname' ASC) VISIBLE,
  UNIQUE INDEX 'phone_number_UNIQUE' ('phone_number' ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table 'mydb'.'storetbl'
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS 'mydb'.'storetbl' (
  'id' VARCHAR(45) NOT NULL,
  'category_group_code' VARCHAR(45) NULL,
  'category_group_name' VARCHAR(45) NULL,
  'phone' VARCHAR(45) NULL,
  'place_name' VARCHAR(45) NULL,
  'place_url' VARCHAR(45) NULL,
  'road_address_name' VARCHAR(45) NULL,
  'x' VARCHAR(45) NULL,
  'y' VARCHAR(45) NULL,
  'created_at' TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  'updated_at' TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  'deleted_at' TIMESTAMP NULL DEFAULT NULL,
  'storetblcol' VARCHAR(45) NULL,
  PRIMARY KEY ('id'))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table 'mydb'.'reviewtbl'
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS 'mydb'.'reviewtbl' (
  'store_id' VARCHAR(45) NOT NULL,
  'user_id' INT NOT NULL,
  'content' VARCHAR(45) NULL,
  'rating' INT NOT NULL,
  'created_at' TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  'updated_at' TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  'deleted_at' TIMESTAMP NULL DEFAULT NULL,
  INDEX 'store_id_idx' ('store_id' ASC) VISIBLE,
  INDEX 'user_id_idx' ('user_id' ASC) VISIBLE,
  PRIMARY KEY ('user_id', 'store_id'),
  CONSTRAINT 'store_id'
    FOREIGN KEY ('store_id')
    REFERENCES 'mydb'.'storetbl' ('id')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT 'user_id'
    FOREIGN KEY ('user_id')
    REFERENCES 'mydb'.'usertbl' ('user_id')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table 'mydb'.'like_list'
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS 'mydb'.'like_list' (
  'store_id' VARCHAR(45) NOT NULL,
  'user_id' INT NOT NULL,
  'created_at' TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  'updated_at' TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  'deleted_at' TIMESTAMP NULL DEFAULT NULL,
  'like_listcol' VARCHAR(45) NULL,
  INDEX 'store_id_idx' ('store_id' ASC) VISIBLE,
  INDEX 'user_id_idx' ('user_id' ASC) VISIBLE,
  PRIMARY KEY ('store_id', 'user_id'),
  CONSTRAINT 'store_id0'
    FOREIGN KEY ('store_id')
    REFERENCES 'mydb'.'storetbl' ('id')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT 'user_id0'
    FOREIGN KEY ('user_id')
    REFERENCES 'mydb'.'usertbl' ('user_id')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table 'mydb'.'tag_storetbl'
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS 'mydb'.'tag_storetbl' (
  'id' INT NOT NULL,
  'store_id' VARCHAR(45) NOT NULL,
  'category_name' VARCHAR(45) NULL,
  PRIMARY KEY ('id'),
  INDEX 'store_id_idx' ('store_id' ASC) VISIBLE,
  UNIQUE INDEX 'store_id_UNIQUE' ('store_id' ASC) VISIBLE,
  CONSTRAINT 'store_id1'
    FOREIGN KEY ('store_id')
    REFERENCES 'mydb'.'storetbl' ('id')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table 'mydb'.'refresh_token'
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS 'mydb'.'refresh_token' (
  'id' INT NOT NULL,
  'access_token' CHAR(200) NOT NULL,
  'refresh_token' CHAR(200) NOT NULL,
  'created_at' TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  'updated_at' TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  'deleted_at' TIMESTAMP NULL DEFAULT NULL,
  'refresh_tokencol' VARCHAR(45) NULL,
  PRIMARY KEY ('id'))
ENGINE = InnoDB
KEY_BLOCK_SIZE = 1;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
`);

		return database;
	} catch (error) {
		console.log(error);
	}
};
init();
module.exports = database;
