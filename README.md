# knu_matzip_server

강대맛집팀플 - 벡엔드 코드입니다.

# Install

`package.json`에 있는 모듈을 설치합니다.

```shell
npm i
```

# Environment Variables

개발 단계에서는 `.env.dev`파일을 최상위 폴더에 추가합니다. 내용은 다음과 같습니다.

```env
DB_HOST = mysql_hostname
DB_PORT = mysql_port
DB_USERNAME = mysql_username
DB_NAME = mysql_db_name
DB_PASSWORD = your_mysql_pwd
API_KEY = kakaomap_api_rest_api
BCRYPT_SALT = custom_salt
JWT_SECRET = jsonwebtoken_secret_key
```

프로덕트 단계에서는 파일 이름을 `.env.production`로 변경합니다.

# DATABASE

Mysql을 사용합니다.

## Error: ER_NOT_SUPPORTED_AUTH_MODE

MySQL 8 을 사용할 경우 새로운 인증 정책을 도입해서 기본 인증이 mysql_native_password 에서 caching_sha2_password 로 변경되었습니다.

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'MY_MYSQL_PWD';
FLUSH PRIVILEGES;
```

# Run
Node의 버전은 v14.21.3입니다. 최신 노드는 `final_renegotiate:unsafe legacy renegotiation disabled`버그가 납니다.

```
npm run dev
```

# stop running

```
ctrl + c
```
