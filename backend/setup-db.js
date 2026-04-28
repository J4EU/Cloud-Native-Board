const mysql = require('mysql2/promise');
require('dotenv').config();

const config = {
  host: process.env.DB_HOST, 
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

async function setup() {
  try {
    const connection = await mysql.createConnection(config);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`);
    await connection.query(`USE ${process.env.DB_NAME};`);

    // 1. 게시글 테이블 생성 (image_url 컬럼 포함)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT NOT NULL AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        author VARCHAR(100) NOT NULL,
        image_url VARCHAR(255), -- 이미지 경로 저장용
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      );
    `);

    // 회원 및 댓글 테이블은 기존과 동일하게 유지
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT NOT NULL AUTO_INCREMENT,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100),
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      );
    `);
    
    // role 컬럼 migration
    try {
      const [cols] = await connection.query(`SHOW COLUMNS FROM users LIKE 'role'`);
      if (cols.length === 0) await connection.query(`ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user' AFTER email`);
    } catch (err) {}

    await connection.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT NOT NULL AUTO_INCREMENT,
        post_id INT NOT NULL,
        author VARCHAR(100) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
      );
    `);

    console.log('✅ 모든 DB 설정이 완료되었습니다.');
    await connection.end();
  } catch (err) {
    console.error('❌ 설정 중 에러 발생:', err.message);
  }
}

setup();
