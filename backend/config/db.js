const mysql = require('mysql2');
require('dotenv').config(); // .env 파일의 내용 불러오기

// 환경변수를 사용하여 DB에 연결
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db.promise();
