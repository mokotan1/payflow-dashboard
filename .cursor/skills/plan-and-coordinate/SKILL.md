---
name: plan-and-coordinate
description: Use when a Payflow change touches more than one app or boundary, needs a shared contract, or the user asks to split work across subagents.
---

# Plan and Coordinate

여러 경계를 한 번에 구현하지 않는다. 계약을 먼저 고정한다.

1. `docs/cursor-prototype-guide.md`에서 현재 단계(A~D)를 확인한다.
2. 영향 경계를 나눈다: UI / local-node / gateway / contracts / tests.
3. 경계를 넘는 필드·에러 코드를 `packages/contracts` 변경으로 먼저 적는다.
4. 계약이 없으면 병렬 구현을 시작하지 않는다.
5. 각 서브에이전트에 `AGENTS.md` 작업 템플릿으로 전달한다.
6. 인증·데이터 보관 변경은 `security-test` 검토를 넣는다.
7. 통합 순서를 `release`에 넘긴다.

금지: 개별 기능 대량 구현, 직접 결제 승인, 공개 포트 허용.
