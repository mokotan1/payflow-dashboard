---
name: integration-release
description: Use when preparing Payflow integration, CI, deployment, rollback, or a release checklist after feature work has passed review.
---

# Integration Release

기능 사양을 바꾸지 않는다. 통과한 변경만 묶는다.

1. 각 경계 변경이 계약과 맞는지 확인한다.
2. 마이그레이션이 있으면 적용·롤백 순서를 적는다.
3. 적용 가능한 테스트를 실행한다.
4. 아티팩트에 비밀정보·실데이터가 없는지 확인한다.
5. 체크리스트: 테스트, 보안 검토, 롤백, 남은 위험, 배포 여부.

보안 검토 전의 실제 OAuth·터널·결제를 켜지 않는다.
