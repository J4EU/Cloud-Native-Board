# 베이스 이미지 설정
FROM node:22-alpine AS build-stage

# 작업 디렉토리 생성
WORKDIR /app

# 의존성 파일 복사 및 설치
COPY package*.json ./

RUN npm install

# 소스 코드 복사
COPY . .

# 빌드 명령 실행
RUN npm run build

# 실행 스테이지 (Nginx) 이미지 설정 
FROM nginx:stable-alpine

# 빌드 스테이지에서 생성된 빌드 결과물을 Nginx 컨테이너에 복사
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 포트 설정
EXPOSE 80

# 실행 명령
CMD ["nginx", "-g", "daemon off;"]
