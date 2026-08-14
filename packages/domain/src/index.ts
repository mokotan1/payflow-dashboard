import type {
  PaymentSummary,
  StatusFilter,
  StatusMeta,
  Subscription,
  SubscriptionStatus,
} from '@payflow/contracts';

export const STATUS_META: Record<SubscriptionStatus, StatusMeta> = {
  upcoming: { label: '결제 예정', className: 'status-upcoming' },
  paid: { label: '결제 완료', className: 'status-paid' },
  attention: { label: '확인 필요', className: 'status-attention' },
  overdue: { label: '연체', className: 'status-overdue' },
};

export function formatMoney(amount: number): string {
  return `${new Intl.NumberFormat('ko-KR').format(amount)}원`;
}

export function filterSubscriptions(
  items: Subscription[],
  query: string,
  status: StatusFilter = 'all',
): Subscription[] {
  const keyword = String(query ?? '').trim().toLocaleLowerCase('ko-KR');

  return items.filter((item) => {
    const haystack = `${item.name} ${item.category}`.toLocaleLowerCase('ko-KR');
    const matchesText = !keyword || haystack.includes(keyword);
    const matchesStatus = status === 'all' || item.status === status;
    return matchesText && matchesStatus;
  });
}

export function calculateSummary(items: Pick<Subscription, 'amount' | 'status'>[]): PaymentSummary {
  return items.reduce<PaymentSummary>(
    (summary, item) => {
      summary.total += item.amount;
      if (item.status === 'paid') {
        summary.paid += item.amount;
      } else {
        summary.upcoming += item.amount;
      }
      if (item.status === 'attention' || item.status === 'overdue') {
        summary.risk += 1;
      }
      return summary;
    },
    { paid: 0, upcoming: 0, risk: 0, total: 0 },
  );
}

export function markPaid(items: Subscription[], id: string, date: string): Subscription[] {
  return items.map((item) =>
    item.id === id ? { ...item, status: 'paid', paidAt: date } : item,
  );
}
