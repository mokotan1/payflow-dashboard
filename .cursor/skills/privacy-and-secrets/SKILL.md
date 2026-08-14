---
name: privacy-and-secrets
description: Use when changing Payflow data models, logs, analytics, fixtures, env files, or anything that might store tokens, mail, or payment details.
---

# Privacy and Secrets

저장 위치를 먼저 적는다. 그다음 코드를 바꾼다.

| 데이터 | 허용 위치 | 금지 |
| --- | --- | --- |
| 구독 상세 | 로컬 DB | 중앙 DB, 로그 |
| Gmail 토큰 | OS 키체인 | 저장소 커밋, 로그, 픽스처 |
| 메일 본문 | 저장하지 않음 | 모든 곳 |
| 카드번호/CVC | 저장하지 않음 | 모든 곳 |
| 기기 공개키 | 중앙 메타데이터 | 구독 상세와 혼합 |

- `.env`에 실제 값을 넣지 않는다. 예시 파일은 더미만.
- 오류 메시지에 토큰·메일·카드 원문을 넣지 않는다.
- 완료 전에 비밀정보 문자열을 검색한다.
