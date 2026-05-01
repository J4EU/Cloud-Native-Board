# Cloud-Native F1 Board

F1 게시판 애플리케이션을 대상으로, 단일 EC2 배포부터 고가용성 AWS 인프라까지 단계적으로 확장하는 클라우드 인프라 프로젝트입니다.

> 애플리케이션 코드는 인프라 실습을 위한 최소 기능 구현체이며, 본 프로젝트의 핵심은 배포 구조, 네트워크 설계, 보안 접근 방식, IaC, 운영 자동화입니다.

## Project Roadmap

- [x] Vue 3 + Vite 기반 Frontend 구조 파악
- [x] Node.js / Express Backend 구조 파악
- [ ] Local Docker Compose 실행

---

### v1. Single EC2 Deployment

- [ ] Single EC2 배포
- [ ] Docker Compose 기반 서비스 실행
- [ ] Nginx Reverse Proxy 구성

### v2. Managed Database Separation

- [ ] RDS 분리
- [ ] 애플리케이션 서버와 데이터베이스 책임 분리

### v3. Operational Access

- [ ] SSM 기반 운영 접근
- [ ] SSH 접근 최소화

### v4. Deployment Automation

- [ ] GitHub Actions 배포 자동화
- [ ] 수동 배포 과정 제거

### v5. Load Balancing & Auto Scaling

- [ ] ALB / Auto Scaling 적용
- [ ] 부하 테스트 기반 확장성 검증

### v6. Monitoring

- [ ] CloudWatch 모니터링
- [ ] CPU / Memory / ALB Target 상태 / 애플리케이션 로그 관측

---

> 이 프로젝트는 처음부터 완성형 아키텍처를 구성하는 것이 아니라, 단일 EC2 배포에서 시작해 운영상 문제를 발견하고, 이를 해결하는 방식으로 인프라를 **점진적**으로 개선하는 것을 목표로 함
