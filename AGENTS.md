# Payflow: Cursor 작업 규약

이 파일은 루트 오케스트레이터(메인 에이전트)의 작업 규약이다. 구현은 아래 서브에이전트에 위임한다.

| 역할 | 파일 | 수정 범위 |
| --- | --- | --- |
| Orchestrator | `.cursor/agents/orchestrator.md` | 작업 분해, 계약 변경 기록 |
| Dashboard UI | `.cursor/agents/dashboard-ui.md` | `apps/web`, 현재는 루트 HTML 데모 |
| Local Node | `.cursor/agents/local-node.md` | `apps/local-node` |
| Gateway/Auth | `.cursor/agents/gateway-auth.md` | `apps/gateway` |
| Security/Test | `.cursor/agents/security-test.md` | 읽기 전용 검토 |
| Release | `.cursor/agents/release.md` | CI, 통합, 릴리스 문서 |

## 시작 전

1. `docs/cursor-prototype-guide.md`를 읽고 현재 단계와 수용 기준을 확인한다.
2. 현재 작업에 맞는 `.cursor/rules/*.mdc`와 `.cursor/skills/*/SKILL.md`를 적용한다.
3. 한 에이전트는 한 경계만 수정한다. 다른 경계의 계약 변경은 먼저 명시하고 오케스트레이터에게 전달한다.
4. 기능이 여러 경계를 건드리면 Orchestrator 서브에이전트를 먼저 호출한다.

## 현재 저장소 상태

- 기획 문서, 정적 HTML 데모, Cursor 에이전트 세팅이 있다.
- `apps/web` React 앱과 `packages/domain` 테스트가 있다. 새 UI 작업은 `apps/web`을 사용한다.
- 루트 `wallet-cards.html`은 초기 HTML 데모(레거시)다.
- 실제 Gmail, 결제대행사, 공개 터널은 연결하지 않는다.

## 제품 경계

- 제품은 여러 사용자가 각자의 PC에 데이터를 보관하는 결제·구독 정보 대시보드다.
- 사용자 PC의 로컬 노드는 `127.0.0.1:8000`에서만 수신한다. 인터넷 인바운드 포트를 열지 않는다.
- 휴대폰은 우리 도메인의 HTTPS 게이트웨이로 접속하고, 인증된 아웃바운드 터널을 통해 자신의 로컬 노드에만 연결한다.
- Google 로그인(OIDC)과 Gmail 권한 부여는 서로 다른 흐름이다. Gmail 범위는 기능을 요청한 시점에 최소 범위로 요청한다.
- 구독·메일 근거·Gmail 토큰은 기본적으로 사용자 PC에 저장한다. 중앙 서비스는 라우팅과 최소 운영 메타데이터만 가진다.

## 절대 금지

- 카드 번호, CVC, Gmail 토큰, 원본 메일 본문을 로그·테스트 픽스처·분석 도구·중앙 DB에 평문으로 저장하지 않는다.
- 승인된 설계와 별개로 직접 결제, 공개 포트포워딩, 임의의 Gmail 전체 권한, 실제 사용자 데이터 수집을 구현하지 않는다.
- 비밀값을 저장소에 커밋하거나 `.env` 예시 파일에 실제 값을 넣지 않는다.
- 테스트·린트·타입 검증 없이 완료라고 말하지 않는다.

## 작업 방식

- 작은 단위로 구현하고, 변경 전에 실패하는 테스트 또는 명확한 수용 기준을 만든다.
- 경계를 넘는 데이터는 공유 계약 타입 또는 버전이 있는 API 스키마로 정의한다.
- API 입력은 서버에서 검증하고, 권한 확인은 게이트웨이와 로컬 노드 양쪽에서 수행한다.
- 기능 완료 시 변경 파일, 실행한 검증, 남은 위험을 짧게 보고한다.

## 서브에이전트 호출

병렬 작업은 `packages/contracts`가 확정된 뒤에만 한다. 계약 변경은 Orchestrator와 Security/Test를 함께 거친다.

작업 전달 형식:

```text
목표: [검증 가능한 한 문장]
담당 경계: [수정 가능한 폴더]
입력 계약: [타입/API/문서 경로]
수용 기준: [테스트 가능한 조건 2~4개]
금지사항: [민감 데이터, 타 경계, 실제 외부 호출]
검증 명령: [정확한 명령 또는 아직 없는 이유]
```
