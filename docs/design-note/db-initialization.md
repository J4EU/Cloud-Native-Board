# DB Initialization Design Note

## Background

EC2 Bootstrap 구현이 완료됨에 따라, DB 초기화 자동화도 필요해졌다.

기존의 구조는 아래와 같았다.

- `backend/setup-db.js` 파일 존재
- `script/` 디렉토리 존재

`backend/setup-db.js`는 컨테이너를 사용하지 않는 로컬 환경에서 수동으로 실행하는 파일이다.

`script/` 디렉토리는 임시로 스크립트를 모아둔 디렉토리였으나, Docker Compose와 연결되지 않은 상태였다.

즉, DB 초기화 관련 코드와 스크립트는 존재했지만, 실제 배포 흐름과는 연결되지 않은 상태였다.

---

## Problem

기존 구조에서는 Docker Compose 최초 실행 시 DB가 자동으로 초기화되지 않았다.

이로 인해 아래 과정이 필요했다.

1. 컨테이너 실행
2. DB 접속 확인
3. 수동 초기화 스크립트 실행

또한 DB 관련 파일이 여러 위치에 분산되어 있어 역할이 모호했다.

---

## Decision

MariaDB init script 방식을 사용한다.

`db/init.sql` 파일을 생성하고, Docker Compose volume mount를 통해 MariaDB 컨테이너에 주입한다.

```yaml
volumes:
  - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql
```

이를 통해 Docker Compose 최초 실행 시 DB 스키마가 자동 생성되도록 구성했다.

기존의 DB 관련 파일 및 스크립트의 역할도 다시 정리했다.

- `backend/setup-db.js`
  - 로컬 환경 수동 초기화용

- `db/init.sql`
  - Docker Compose 자동 초기화용

- `script/*`
  - 불필요해짐에 따라 삭제

---

## Notes

MariaDB init script는 DB가 최초 생성될 때만 실행된다.

기존 volume이 존재하는 경우 init script는 다시 실행되지 않는다.

초기화를 다시 수행하려면 volume 삭제가 필요하다.
