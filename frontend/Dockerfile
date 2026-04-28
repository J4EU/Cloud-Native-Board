# 빌드 스테이지
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 실행 스테이지 (Nginx)
FROM nginx:stable-alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Nginx 설정 파일이 필요할 경우 추가 복사 가능
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
