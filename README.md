# Cloud-Native F1 Board

F1 게시판 애플리케이션을 대상으로, 단일 EC2 배포에서 시작해 운영 과정에서 발생하는 보안, 데이터 영속성, 배포 자동화, 확장성, 모니터링 문제를 하나씩 해결해가는 클라우드 인프라 프로젝트입니다.

> 애플리케이션 코드는 인프라 실습을 위한 최소 기능 구현체이며, 본 프로젝트의 핵심은 배포 구조, 네트워크 설계, 보안 접근 방식, IaC, 운영 자동화입니다.

## Project Progress

### Preparation

- [x] Vue 3 + Vite 기반 Frontend 구조 파악
- [x] Node.js / Express Backend 구조 파악
- [x] Local Docker Compose 실행

### v1. Single EC2 Deployment

- [x] Single EC2 배포
- [x] Docker Compose 기반 서비스 실행
- [x] Nginx Reverse Proxy 구성

### Next Improvements

- [ ] SSM 기반 운영 접근 개선
- [ ] RDS 분리를 통한 데이터베이스 책임 분리
- [ ] GitHub Actions 기반 배포 자동화
- [ ] ALB / Auto Scaling을 통한 확장성 검증
- [ ] CloudWatch 기반 모니터링

---

> 이 프로젝트는 처음부터 완성형 아키텍처를 구성하는 것이 아니라, 단일 EC2 배포에서 시작해 운영상 문제를 발견하고 이를 해결하는 방식으로 인프라를 **점진적으로 개선**하는 것을 목표로 합니다.
