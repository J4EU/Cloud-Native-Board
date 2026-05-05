# 1. Base 이미지 설정
# node:22-alpine 이미지를 사용
FROM node:22-alpine

# 2. 작업 디렉토리 생성
WORKDIR /usr/src/app

# 3. 의존성 파일 복사 및 설치 (캐싱 최적화)
# package*.json 파일을 작업 디렉토리로 복사
COPY package*.json ./

# npm install 명령을 실행하여 의존성 설치 (--production 옵션을 사용하여 개발 의존성 제외하고 설치)
RUN npm install --production

# 4. 소스 코드 복사
# 현재 디렉토리의 모든 파일을 작업 디렉토리로 복사
COPY . .

# 5. 포트 설정
EXPOSE 3000

# 6. 실행 명령
CMD ["node", "index.js"]
