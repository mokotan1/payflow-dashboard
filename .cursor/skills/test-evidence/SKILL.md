---
name: test-evidence
description: Use before claiming a Payflow task is complete, fixed, or ready to merge. Requires running verification and reporting what was not tested.
---

# Test Evidence

통과를 추측하지 않는다. 명령을 실행하고 출력을 근거로 남긴다.

1. 변경에 해당하는 단위·계약·UI 테스트를 실행한다.
2. 테스트 러너가 아직 없으면 그 사실을 명시하고, 수동 수용 기준만으로 완료라고 하지 않는다.
3. 실패한 테스트를 고치거나, 고치지 못한 이유를 적는다.
4. 실제 외부 호출이 필요한 검증은 승인 없이 건너뛰고 미검증으로 표시한다.

보고 필수: 실행 명령, 결과, 미검증 영역.
