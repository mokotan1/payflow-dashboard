---
name: payment-dashboard-ui
description: Use when implementing Payflow dashboard screens, wallet cards, search, filters, empty/error states, or the root HTML demo.
---

# Payment Dashboard UI

화면만 바꾼다. 저장소와 인증은 건드리지 않는다.

1. 로딩 / 빈 화면 / 오류 / 연결 끊김 / 권한 거부를 정의한다.
2. 데모 여부, 동기화 시각, 연결 상태를 항상 보이게 한다.
3. 검색·상태 필터·요약 금액은 기존 도메인 함수로 계산한다.
4. 키보드, 레이블, 포커스, 대비를 확인한다.
5. 결제 버튼은 확인 다이얼로그만. 실제 승인을 보내지 않는다.
6. UI 테스트로 요약·필터·상태 변경을 검증한다.

현재 파일: `wallet-cards.html`, `styles.css`, `app.js`. 이후 `apps/web`.
