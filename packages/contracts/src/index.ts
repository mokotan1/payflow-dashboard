export type SubscriptionStatus = 'upcoming' | 'paid' | 'attention' | 'overdue';

export type SubscriptionTone = 'red' | 'coral' | 'ink' | 'violet' | 'mint' | 'orange';

export interface Subscription {
  id: string;
  name: string;
  category: string;
  amount: number;
  day: number;
  status: SubscriptionStatus;
  auto: boolean;
  icon: string;
  tone: SubscriptionTone;
  method: string;
  note: string;
  paidAt?: string;
}

export interface PaymentSummary {
  paid: number;
  upcoming: number;
  risk: number;
  total: number;
}

export type StatusFilter = SubscriptionStatus | 'all';

export interface StatusMeta {
  label: string;
  className: string;
}
