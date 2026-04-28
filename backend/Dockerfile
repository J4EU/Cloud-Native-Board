# 1. Base 이미지 설정
FROM node:18-alpine

# 2. 작업 디렉토리 생성
WORKDIR /usr/src/app

# 3. 의존성 파일 복사 및 설치 (캐싱 최적화)
COPY package*.json ./
RUN npm install --production

# 4. 소스 코드 복사
COPY . .

# 5. 포트 설정
EXPOSE 3000

# 6. 실행 명령
CMD ["node", "index.js"]
