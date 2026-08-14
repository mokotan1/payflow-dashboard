---
name: security-review
description: Use when Payflow auth, OAuth, tunnels, local binding, payments, or external exposure changes, and before claiming those changes are safe.
---

# Security Review

제품 코드를 수정하지 않는다. 확인된 위험만 보고한다.

1. 위협: 권한 우회, 토큰 유출, 공개 바인딩, 메일 본문 저장, 타 기기 릴레이.
2. 거부 경로와 실패 경로 테스트가 있는지 본다.
3. 실제 Gmail·결제·공개 네트워크 호출이 코드에 들어갔는지 본다.
4. 직접 결제는 이 프로토타입 범위 밖이다. 구현되어 있으면 Critical.

보고: Critical / High / Medium / Low, 파일, 재현, 권장 수정.
추측으로 목록을 채우지 않는다.
