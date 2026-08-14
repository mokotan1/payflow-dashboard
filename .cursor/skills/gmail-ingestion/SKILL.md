---
name: gmail-ingestion
description: Use when implementing Payflow Gmail OAuth, mail detection, subscription candidates, disconnect, or mail evidence storage.
---

# Gmail Ingestion

메일 본문을 수집하지 않는다. 결제 후보만 추출한다.

1. 사용자가 'Gmail 연결'을 누른 뒤에만 최소 범위를 요청한다.
2. 테스트는 익명화 픽스처로 한다. 실제 사용자 메일을 쓰지 않는다.
3. 저장 필드: 메시지 ID, 발신자 최소 정보, 추출 시각, 서비스명/금액/결제일 후보, 신뢰도, 검토 상태.
4. 결제와 무관한 본문은 저장하지 않는다.
5. 사용자가 후보를 수정·제외할 수 있어야 한다.
6. 연결 해제와 로컬 데이터 삭제를 같은 작업에 포함한다.
7. 토큰과 원본 본문이 로그에 없는지 테스트한다.
