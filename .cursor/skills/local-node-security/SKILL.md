---
name: local-node-security
description: Use when changing Payflow local API, SQLite or encrypted storage, keychain access, loopback binding, or device pairing on the PC node.
---

# Local Node Security

사용자 PC 노드의 기본 규칙이다.

1. 리슨 주소가 `127.0.0.1`인지 확인한다. `0.0.0.0`을 추가하지 않는다.
2. 요청마다 입력 검증과 사용자·기기·세션 권한을 다시 본다.
3. 토큰·키는 OS 키체인 추상화를 통한다. DB/로그/스택에 평문 금지.
4. 구독 상세와 메일 근거는 로컬에만 둔다.
5. 민감 로그 탐지 테스트와 권한 거부 테스트를 추가한다.

검증: 바인딩 테스트, 스키마 테스트, 401/403 경로.
