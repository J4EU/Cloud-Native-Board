# Cloud-Native F1 Board

F1 게시판 애플리케이션을 대상으로, 단일 EC2 환경에서 Docker Compose 기반 배포 구조를 구성하고 운영 흐름을 검증한 클라우드 인프라 프로젝트입니다.

애플리케이션 자체는 인프라 실습을 위한 최소 기능 게시판이며, 이 프로젝트의 핵심은 웹 기능 구현보다 배포 구조, 네트워크 구성, 컨테이너 실행 환경, IaC, 서버 초기 설정 자동화, DB 초기화 흐름을 직접 구성하는 데 있습니다.

목표는 단일 EC2 인스턴스에서 프론트엔드, 백엔드, 데이터베이스를 Docker Compose로 실행하고, Terraform과 EC2 `user_data`를 이용해 배포 환경을 재현 가능하게 만드는 것입니다.

## Architecture

```text
Client
  |
  | HTTP :80
  v
EC2 Instance
  |
  v
Frontend Container (Nginx)
  ├── serves Vue static files
  └── proxies /api requests
          |
          v
    Backend Container (Express)
          |
          v
    MariaDB Container
```

Frontend는 빌드된 Vue 정적 파일을 Nginx로 서빙하며, `/api` 요청은 Nginx 설정을 통해 Backend 컨테이너로 프록시합니다.

## Tech Stack

### Application

- Frontend: Vue 3, Vite
- Backend: Node.js, Express
- Database: MariaDB

### Infrastructure

- AWS EC2
- Terraform
- Docker / Docker Compose
- Nginx
- EC2 user_data

## What I Implemented

- Single EC2 기반 배포 환경 구성
- Docker Compose 기반 frontend / backend / db 컨테이너 분리
- Production / Development Compose 설정 분리
- Nginx 기반 프론트엔드 서빙 및 API 요청 라우팅
- Terraform을 이용한 EC2 인프라 생성
- EC2 user_data를 이용한 서버 초기 설정 자동화
- Docker / Docker Compose / Buildx 설치 자동화
- Repository clone 및 환경 변수 템플릿 생성 자동화
- MariaDB init script 기반 DB 테이블 초기화
- 컨테이너 재시작 정책 설정

## Deployment

### Production

`v1.0.0` 기준 배포 흐름은 다음과 같습니다.

1. `terraform/terraform.tfvars.sample` 파일을 검토합니다.
2. `terraform.tfvars` 파일을 생성하고 환경에 맞게 값을 수정합니다.
   - 접근 허용 IP
   - Repository URL / Branch
   - Frontend Origin
   - Frontend API URL
   - DB 이름 / 사용자 이름
3. `terraform apply`로 AWS 인프라를 생성합니다.
4. EC2 생성 과정에서 `user_data`가 초기 서버 설정을 수행합니다.
   - Docker 설치
   - Docker Compose / Buildx 설치
   - 애플리케이션 디렉토리 생성
   - Repository clone
   - `.env`, `backend/.env`, `frontend/.env` 템플릿 생성
5. EC2에 접속해 `user_data` 실행 로그를 확인합니다.

```bash
tail -f /var/log/user-data.log
```

6. 로그 마지막에 Docker / Compose / Buildx 버전이 출력되는지 확인합니다.

```bash
docker --version
docker compose version
docker buildx version
```

7. `backend/.env` 파일을 수정해 수동 입력이 필요한 secret 값을 채웁니다.
   - `DB_PASSWORD`
   - `JWT_SECRET`

8. 프로젝트 루트의 `.env` 파일을 수정해 DB 관련 secret 값을 채웁니다.
   - `DB_PASSWORD`
   - `MARIADB_ROOT_PASSWORD`
   - `MARIADB_PASSWORD`

9. Docker Compose로 서비스를 빌드하고 실행합니다.

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

10. MariaDB 컨테이너 최초 실행 시 `db/init.sql`을 통해 기본 테이블이 생성됩니다.

## Run

### Development

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

### Production

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

> 실행 전 `.env` 파일에 필요한 환경 변수를 먼저 설정해야 합니다.

## Environment Variables

이 프로젝트는 `.env` 파일을 통해 DB 접속 정보와 JWT secret 값을 주입합니다.

```env
MARIADB_ROOT_PASSWORD=
MARIADB_DATABASE=
MARIADB_USER=
MARIADB_PASSWORD=

DB_USER=
DB_PASSWORD=
DB_NAME=

JWT_SECRET=
```

실제 secret 값은 Repository에 포함하지 않습니다.

## Known Issues

### 업로드 이미지 영속성 미지원

현재 업로드 이미지는 백엔드 컨테이너 내부에 저장되므로, 컨테이너 재생성 시 이미지가 손실될 수 있습니다.
`v1.0.0`에서는 Known Issue로 관리하며, 장기 운영 시 Docker Volume 또는 외부 스토리지 적용을 검토합니다.

### 게시글 수정 시 이미지 제거 API 미연결

게시글 수정 화면에서는 이미지 제거 버튼이 보이지만, 현재 `v1.0.0`에서는 기존 이미지를 실제로 삭제하는 API 동작까지 연결되어 있지 않습니다.
따라서 이미지를 제거한 뒤 저장해도 기존 이미지가 유지될 수 있으며, 이 문제는 Known Issue로 관리합니다.

## Project Status

이 프로젝트는 `v1.0.0` 기준으로 단일 EC2 + Docker Compose 기반 배포 흐름의 재현성을 확인하는 단계까지를 범위로 삼았습니다.

현재는 학습 및 포트폴리오 목적의 단기 운영 프로젝트로 마무리하며, RDS 분리, CI/CD, ALB/Auto Scaling, 모니터링 구성 등은 후속 개선 과제로 남겨둡니다.
