import type { StatusFilter, Subscription } from '@payflow/contracts';
import {
  STATUS_META,
  calculateSummary,
  filterSubscriptions,
  formatMoney,
  markPaid,
} from '@payflow/domain';
import { demoSubscriptions } from '@payflow/test-fixtures';
import { useEffect, useMemo, useRef, useState } from 'react';

const BILLING_MONTH = '8월';
const DEMO_PAID_DATE = '2026-08-13';
const SYNC_DELAY_MS = 900;
const TOAST_DURATION_MS = 2600;

function StatusBadge({ status }: { status: Subscription['status'] }) {
  const meta = STATUS_META[status];
  return (
    <span className={`status ${meta.className}`}>
      <i />
      {meta.label}
    </span>
  );
}

function SubscriptionCard({
  item,
  onPay,
  onExternal,
}: {
  item: Subscription;
  onPay: (id: string) => void;
  onExternal: (item: Subscription) => void;
}) {
  return (
    <article className="wallet-item">
      <div className="wallet-top">
        <span className={`service-icon tone-${item.tone}`}>{item.icon}</span>
        <StatusBadge status={item.status} />
      </div>
      <div>
        <p className="eyebrow">{item.category}</p>
        <h3>{item.name}</h3>
        <p className="muted">{item.note}</p>
      </div>
      <div className="wallet-amount">
        <strong>{formatMoney(item.amount)}</strong>
        <span>
          {BILLING_MONTH} {item.day}일
        </span>
      </div>
      <div className="wallet-footer">
        <span>{item.method}</span>
        {item.status === 'paid' ? (
          <button type="button" className="btn btn-quiet">
            영수증 보기
          </button>
        ) : (
          <div className="row-actions">
            <button type="button" className="btn btn-quiet" onClick={() => onExternal(item)}>
              결제 페이지
            </button>
            <button type="button" className="btn btn-primary" onClick={() => onPay(item.id)}>
              바로 결제
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export function App() {
  const [subscriptions, setSubscriptions] = useState(() =>
    demoSubscriptions.map((item) => ({ ...item })),
  );
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [syncTime, setSyncTime] = useState('12분 전 동기화');
  const [isSyncing, setIsSyncing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [selected, setSelected] = useState<Subscription | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const visible = useMemo(
    () => filterSubscriptions(subscriptions, query, status),
    [subscriptions, query, status],
  );
  const summary = useMemo(() => calculateSummary(subscriptions), [subscriptions]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), TOAST_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function openPayment(id: string) {
    const item = subscriptions.find((entry) => entry.id === id);
    if (!item) return;
    setSelected(item);
    dialogRef.current?.showModal();
  }

  function closePayment() {
    dialogRef.current?.close();
    setSelected(null);
  }

  function confirmPayment() {
    if (!selected) return;
    setSubscriptions((current) => markPaid(current, selected.id, DEMO_PAID_DATE));
    closePayment();
    setToast('데모 결제가 완료 처리되었습니다');
  }

  function handleSync() {
    setIsSyncing(true);
    window.setTimeout(() => {
      setIsSyncing(false);
      setSyncTime('방금 전');
      setToast('Gmail에서 결제 메일 7건을 확인했어요');
    }, SYNC_DELAY_MS);
  }

  return (
    <div className="wallet-theme">
      <main className="wallet-shell">
        <nav className="wallet-nav">
          <a className="wallet-brand" href="/">
            <i />
            Subly
          </a>
          <div className="wallet-links">
            <a className="active" href="#">
              내 지갑
            </a>
            <a href="#">결제 내역</a>
            <a href="#">인사이트</a>
          </div>
          <div className="wallet-user">
            <span className="demo-pill">데모</span>
            <span className="avatar">민</span>
          </div>
        </nav>

        <section className="wallet-hero">
          <article className="balance-card">
            <p>{BILLING_MONTH} 정기결제 총액</p>
            <h1>{formatMoney(summary.total)}</h1>
            <small>지난달보다 8.4% 적어요 ↓</small>
            <div className="balance-bottom">
              <span>
                Gmail에서 7개 서비스 발견
                <br />
                <b>{syncTime}</b>
              </span>
              <strong>•••• 4821</strong>
            </div>
          </article>
          <article className="hero-tile">
            <span className="hero-icon">◷</span>
            <div>
              <p>앞으로 결제할 금액</p>
              <strong>{formatMoney(summary.upcoming)}</strong>
              <small>다음 결제는 내일이에요</small>
            </div>
          </article>
          <article className="hero-tile">
            <span className="hero-icon">✓</span>
            <div>
              <p>이번 달 결제 완료</p>
              <strong>{formatMoney(summary.paid)}</strong>
              <small>안전하게 처리됐어요</small>
            </div>
          </article>
        </section>

        <header className="wallet-bar">
          <div>
            <h2>나의 구독</h2>
            <p>
              Gmail 청구 메일을 바탕으로 정리했어요 · 확인 필요 <b>{summary.risk}건</b>
            </p>
          </div>
          <div className="wallet-tools">
            <label className="search-box">
              <span hidden>서비스 검색</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="구독 검색"
              />
            </label>
            <div className="filters">
              <select
                aria-label="결제 상태"
                value={status}
                onChange={(event) => setStatus(event.target.value as StatusFilter)}
              >
                <option value="all">전체 상태</option>
                <option value="upcoming">결제 예정</option>
                <option value="paid">결제 완료</option>
                <option value="attention">확인 필요</option>
                <option value="overdue">연체</option>
              </select>
            </div>
            <button
              type="button"
              className={`btn btn-outline sync-btn${isSyncing ? ' is-loading' : ''}`}
              disabled={isSyncing}
              onClick={handleSync}
            >
              <span className="spin">↻</span> Gmail 동기화
            </button>
          </div>
        </header>

        <section className="wallet-grid">
          {visible.map((item) => (
            <SubscriptionCard
              key={item.id}
              item={item}
              onPay={openPayment}
              onExternal={(entry) =>
                setToast(`${entry.name} 결제 페이지를 여는 동작입니다 (데모)`)
              }
            />
          ))}
        </section>

        {visible.length === 0 ? (
          <div className="empty">조건에 맞는 구독이 없습니다.</div>
        ) : null}
      </main>

      <dialog ref={dialogRef} onClose={() => setSelected(null)}>
        <div className="dialog-inner">
          <div className="dialog-head">
            <div>
              <h2>이 구독을 결제할까요?</h2>
              <p>결제처와 금액을 한 번 더 확인하세요.</p>
            </div>
            <button type="button" className="close-btn" aria-label="닫기" onClick={closePayment}>
              ×
            </button>
          </div>
          {selected ? (
            <div className="payment-check">
              <div>
                <span>구독 서비스</span>
                <strong>{selected.name}</strong>
              </div>
              <div>
                <span>결제수단</span>
                <strong>{selected.method}</strong>
              </div>
              <div className="total">
                <span>최종 결제금액</span>
                <strong>{formatMoney(selected.amount)}</strong>
              </div>
            </div>
          ) : null}
          <div className="safety-note">
            ⚠ 안전한 UI 데모입니다. 실제 승인 요청은 전송되지 않습니다.
          </div>
          <div className="dialog-actions">
            <button type="button" className="btn btn-quiet" onClick={closePayment}>
              다음에
            </button>
            <button type="button" className="btn btn-primary" onClick={confirmPayment}>
              확인하고 데모 결제
            </button>
          </div>
        </div>
      </dialog>

      <div className={`toast${toast ? ' show' : ''}`} role="status">
        {toast}
      </div>
    </div>
  );
}
