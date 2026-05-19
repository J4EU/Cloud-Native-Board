# DB Initialization Design Note

## Background

EC2 Bootstrap 구현이 완료됨에 따라, DB 초기화 자동화도 필요해졌다.

기존 구조는 아래와 같았다.

- `backend/setup-db.js` 파일 존재
- `script/` 디렉토리 존재

`backend/setup-db.js`는 컨테이너를 사용하지 않는 로컬 환경에서 수동으로 실행하는 파일이다.

`script/` 디렉토리는 Compose 기반 DB 초기화를 검토하면서 만든 임시 스크립트 모음이었지만, 실제 Docker Compose 흐름과는 연결되지 않은 상태였다.

즉, DB 초기화 관련 코드와 스크립트는 존재했지만, 실제 배포 흐름과는 연결되지 않은 상태였다.

---

## Problem

기존 구조에서는 Docker Compose 최초 실행 시 DB가 자동으로 초기화되지 않았다.

이로 인해 아래 과정이 필요했다.

1. 컨테이너 실행
2. DB 접속 확인
3. 수동 초기화 스크립트 실행

또한 DB 관련 파일이 여러 위치에 분산되어 있어 역할이 모호했다.

추가로 아래 상황에서 문제가 발생했다.

```bash
docker compose down -v
docker compose up
```

DB volume 삭제 후 다시 실행하면 DB 자체는 생성되지만 테이블은 생성되지 않았다.

원인:

- Compose 흐름에 테이블 초기화 단계가 존재하지 않음
- `backend/setup-db.js`는 수동 실행 스크립트이며 자동 실행 대상이 아님

---

## Decision

MariaDB init script 방식을 사용한다.

`db/init.sql` 파일을 생성하고, Docker Compose volume mount를 통해 MariaDB 컨테이너에 주입한다.

```yaml
volumes:
  - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql
```

이를 통해 Docker Compose 최초 실행 시 DB 스키마가 자동 생성되도록 구성했다.

DB 관련 파일의 역할도 다시 정리했다.

- `backend/setup-db.js`
  - 로컬 환경 수동 초기화용

- `db/init.sql`
  - Docker Compose 자동 초기화용

- `script/*`
  - 불필요해짐에 따라 삭제

---

## Result

빈 DB volume 상태에서도 Compose 실행 시 기본 테이블이 자동 생성된다.

```bash
docker compose down -v
docker compose up
```

위 과정을 수행해도 DB 초기화가 자동으로 진행된다.

---

## Notes

- MariaDB init script는 DB가 최초 생성될 때만 실행된다.
- 기존 volume이 존재하는 경우 init script는 다시 실행되지 않는다.
- 초기화를 다시 수행하려면 volume 삭제가 필요하다.
- 운영 중에는 기존 volume 유지 여부를 먼저 확인해야 한다.
