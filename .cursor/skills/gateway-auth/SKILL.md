---
name: gateway-auth
description: Use when changing Payflow Google login, sessions, device routing, pairing, or the central HTTPS gateway.
---

# Gateway Auth

중앙 서비스는 라우팅만 한다. 구독 데이터를 저장하지 않는다.

1. 사용자 ID, 기기 ID, 세션을 모두 통과한 뒤에만 릴레이한다.
2. 중앙 DB 허용 필드: 사용자 ID, 기기 공개키, 연결 상태, 터널 라우팅 ID, 감사 메타데이터.
3. 만료 세션, 다른 사용자 기기, 재전송 요청을 거부하는 테스트를 만든다.
4. Google 로그인과 Gmail 권한 부여를 분리한다.
5. PC 인바운드 공개 포트를 열지 않는다. 아웃바운드 인증 터널만 수락한다.

실제 OAuth·외부 터널은 단계 C 보안 검토 후에만 연결한다.
