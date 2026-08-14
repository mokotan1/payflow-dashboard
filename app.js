(function (root) {
  'use strict';

  const subscriptions = [
    { id: 'netflix', name: 'Netflix', category: '엔터테인먼트', amount: 17000, day: 14, status: 'upcoming', auto: true, icon: 'N', tone: 'red', method: '현대카드 •••• 4821', note: '프리미엄 요금제' },
    { id: 'adobe', name: 'Adobe Creative Cloud', category: '디자인', amount: 61600, day: 11, status: 'attention', auto: false, icon: 'A', tone: 'coral', method: '신한카드 •••• 1904', note: '결제수단 만료 예정' },
    { id: 'notion', name: 'Notion', category: '생산성', amount: 14500, day: 18, status: 'upcoming', auto: true, icon: 'N', tone: 'ink', method: '현대카드 •••• 4821', note: 'Plus 연간 요금제' },
    { id: 'github', name: 'GitHub', category: '개발', amount: 5500, day: 3, status: 'paid', auto: true, icon: 'G', tone: 'violet', method: '카카오뱅크 •••• 7732', note: 'Pro 요금제', paidAt: '2026-08-03' },
    { id: 'chatgpt', name: 'ChatGPT Plus', category: '생산성', amount: 29000, day: 22, status: 'upcoming', auto: true, icon: 'C', tone: 'mint', method: '신한카드 •••• 1904', note: '개인 플랜' },
    { id: 'telecom', name: 'SKT 통신비', category: '생활', amount: 68420, day: 7, status: 'overdue', auto: false, icon: 'S', tone: 'orange', method: '카카오뱅크 •••• 7732', note: '8월 청구서' },
    { id: 'youtube', name: 'YouTube Premium', category: '엔터테인먼트', amount: 14900, day: 26, status: 'upcoming', auto: true, icon: 'Y', tone: 'red', method: '현대카드 •••• 4821', note: '개인 멤버십' },
  ];

  const statusMeta = {
    upcoming: { label: '결제 예정', className: 'status-upcoming' },
    paid: { label: '결제 완료', className: 'status-paid' },
    attention: { label: '확인 필요', className: 'status-attention' },
    overdue: { label: '연체', className: 'status-overdue' },
  };

  const money = (amount) => new Intl.NumberFormat('ko-KR').format(amount) + '원';

  function filterSubscriptions(items, query, status) {
    const keyword = String(query || '').trim().toLocaleLowerCase('ko-KR');
    return items.filter((item) => {
      const matchesText = !keyword || `${item.name} ${item.category}`.toLocaleLowerCase('ko-KR').includes(keyword);
      return matchesText && (!status || status === 'all' || item.status === status);
    });
  }

  function calculateSummary(items) {
    return items.reduce((summary, item) => {
      summary.total += item.amount;
      if (item.status === 'paid') summary.paid += item.amount;
      else summary.upcoming += item.amount;
      if (item.status === 'attention' || item.status === 'overdue') summary.risk += 1;
      return summary;
    }, { paid: 0, upcoming: 0, risk: 0, total: 0 });
  }

  function markPaid(items, id, date) {
    return items.map((item) => item.id === id ? { ...item, status: 'paid', paidAt: date } : item);
  }

  const api = { subscriptions, filterSubscriptions, calculateSummary, markPaid, money, statusMeta };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.PaymentDemo = api;

  if (typeof document === 'undefined') return;

  let state = subscriptions.map((item) => ({ ...item }));
  let selectedId = null;
  const view = document.body.dataset.view;
  if (!view || view === 'picker') return;

  const list = document.querySelector('[data-list]');
  const search = document.querySelector('[data-search]');
  const filter = document.querySelector('[data-filter]');
  const dialog = document.querySelector('[data-payment-dialog]');
  const toast = document.querySelector('[data-toast]');

  function statusBadge(item) {
    const meta = statusMeta[item.status];
    return `<span class="status ${meta.className}"><i></i>${meta.label}</span>`;
  }

  function actionButtons(item) {
    if (item.status === 'paid') return `<button class="btn btn-quiet" data-receipt="${item.id}">영수증 보기</button>`;
    return `<div class="row-actions"><button class="btn btn-quiet" data-external="${item.id}">결제 페이지</button><button class="btn btn-primary" data-pay="${item.id}">바로 결제</button></div>`;
  }

  function renderControl(items) {
    return items.map((item) => `<article class="payment-row">
      <div class="service"><span class="service-icon tone-${item.tone}">${item.icon}</span><span><strong>${item.name}</strong><small>${item.category} · ${item.note}</small></span></div>
      <div class="date-cell"><strong>8월 ${item.day}일</strong><small>${item.auto ? '자동 결제' : '수동 결제'}</small></div>
      <div class="amount"><strong>${money(item.amount)}</strong>${statusBadge(item)}</div>
      ${actionButtons(item)}
    </article>`).join('');
  }

  function renderWallet(items) {
    return items.map((item) => `<article class="wallet-item">
      <div class="wallet-top"><span class="service-icon tone-${item.tone}">${item.icon}</span>${statusBadge(item)}</div>
      <div><p class="eyebrow">${item.category}</p><h3>${item.name}</h3><p class="muted">${item.note}</p></div>
      <div class="wallet-amount"><strong>${money(item.amount)}</strong><span>8월 ${item.day}일</span></div>
      <div class="wallet-footer"><span>${item.method}</span>${actionButtons(item)}</div>
    </article>`).join('');
  }

  function renderCalendar(items) {
    const days = Array.from({ length: 31 }, (_, index) => index + 1);
    const leading = 6;
    const cells = Array.from({ length: leading }, () => '<div class="calendar-cell muted-cell"></div>');
    days.forEach((day) => {
      const dayItems = items.filter((item) => item.day === day);
      cells.push(`<button class="calendar-cell ${day === 13 ? 'today' : ''}" data-day="${day}"><span>${day}</span>${dayItems.map((item) => `<i class="calendar-event ${statusMeta[item.status].className}">${item.name}<b>${money(item.amount)}</b></i>`).join('')}</button>`);
    });
    return cells.join('');
  }

  function renderDayPanel(day, items) {
    const panel = document.querySelector('[data-day-panel]');
    if (!panel) return;
    const dayItems = items.filter((item) => item.day === day);
    panel.innerHTML = `<div class="panel-heading"><div><span class="eyebrow">AUGUST 2026</span><h3>8월 ${day}일</h3></div><span class="count-badge">${dayItems.length}건</span></div>${dayItems.length ? dayItems.map((item) => `<div class="day-payment"><div class="service"><span class="service-icon tone-${item.tone}">${item.icon}</span><span><strong>${item.name}</strong><small>${item.method}</small></span></div><strong>${money(item.amount)}</strong>${actionButtons(item)}</div>`).join('') : '<div class="empty-state">예정된 결제가 없어요.<small>여유 있는 하루입니다.</small></div>'}`;
  }

  function updateSummary() {
    const summary = calculateSummary(state);
    document.querySelectorAll('[data-summary="upcoming"]').forEach((node) => node.textContent = money(summary.upcoming));
    document.querySelectorAll('[data-summary="paid"]').forEach((node) => node.textContent = money(summary.paid));
    document.querySelectorAll('[data-summary="risk"]').forEach((node) => node.textContent = summary.risk + '건');
    document.querySelectorAll('[data-summary="total"]').forEach((node) => node.textContent = money(summary.total));
  }

  function render() {
    const items = filterSubscriptions(state, search?.value, filter?.value);
    if (view === 'control') list.innerHTML = renderControl(items);
    if (view === 'wallet') list.innerHTML = renderWallet(items);
    if (view === 'calendar') {
      list.innerHTML = renderCalendar(items);
      renderDayPanel(14, items);
    }
    const empty = document.querySelector('[data-empty]');
    if (empty) empty.hidden = items.length > 0;
    updateSummary();
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2600);
  }

  function openPayment(id) {
    const item = state.find((entry) => entry.id === id);
    if (!item || !dialog) return;
    selectedId = id;
    dialog.querySelector('[data-dialog-name]').textContent = item.name;
    dialog.querySelector('[data-dialog-amount]').textContent = money(item.amount);
    dialog.querySelector('[data-dialog-method]').textContent = item.method;
    dialog.showModal();
  }

  list?.addEventListener('click', (event) => {
    const payButton = event.target.closest('[data-pay]');
    const externalButton = event.target.closest('[data-external]');
    const dayButton = event.target.closest('[data-day]');
    if (payButton) openPayment(payButton.dataset.pay);
    if (externalButton) {
      const item = state.find((entry) => entry.id === externalButton.dataset.external);
      showToast(`${item.name} 결제 페이지를 여는 동작입니다 (데모)`);
    }
    if (dayButton) renderDayPanel(Number(dayButton.dataset.day), filterSubscriptions(state, search?.value, filter?.value));
  });

  document.querySelector('[data-day-panel]')?.addEventListener('click', (event) => {
    const payButton = event.target.closest('[data-pay]');
    const externalButton = event.target.closest('[data-external]');
    if (payButton) openPayment(payButton.dataset.pay);
    if (externalButton) showToast('서비스 결제 페이지를 여는 동작입니다 (데모)');
  });

  search?.addEventListener('input', render);
  filter?.addEventListener('change', render);
  document.querySelector('[data-sync]')?.addEventListener('click', (event) => {
    const button = event.currentTarget;
    button.classList.add('is-loading');
    button.disabled = true;
    window.setTimeout(() => {
      button.classList.remove('is-loading');
      button.disabled = false;
      document.querySelectorAll('[data-sync-time]').forEach((node) => node.textContent = '방금 전');
      showToast('Gmail에서 결제 메일 7건을 확인했어요');
    }, 900);
  });
  document.querySelectorAll('[data-dialog-close]').forEach((button) => button.addEventListener('click', () => dialog.close()));
  document.querySelector('[data-confirm-pay]')?.addEventListener('click', () => {
    state = markPaid(state, selectedId, '2026-08-13');
    dialog.close();
    render();
    showToast('데모 결제가 완료 처리되었습니다');
  });

  render();
})(typeof window !== 'undefined' ? window : globalThis);
