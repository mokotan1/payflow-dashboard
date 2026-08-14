import type { Subscription } from '@payflow/contracts';

export const demoSubscriptions: Subscription[] = [
  { id: 'netflix', name: 'Netflix', category: '엔터테인먼트', amount: 17000, day: 14, status: 'upcoming', auto: true, icon: 'N', tone: 'red', method: '현대카드 •••• 4821', note: '프리미엄 요금제' },
  { id: 'adobe', name: 'Adobe Creative Cloud', category: '디자인', amount: 61600, day: 11, status: 'attention', auto: false, icon: 'A', tone: 'coral', method: '신한카드 •••• 1904', note: '결제수단 만료 예정' },
  { id: 'notion', name: 'Notion', category: '생산성', amount: 14500, day: 18, status: 'upcoming', auto: true, icon: 'N', tone: 'ink', method: '현대카드 •••• 4821', note: 'Plus 연간 요금제' },
  { id: 'github', name: 'GitHub', category: '개발', amount: 5500, day: 3, status: 'paid', auto: true, icon: 'G', tone: 'violet', method: '카카오뱅크 •••• 7732', note: 'Pro 요금제', paidAt: '2026-08-03' },
  { id: 'chatgpt', name: 'ChatGPT Plus', category: '생산성', amount: 29000, day: 22, status: 'upcoming', auto: true, icon: 'C', tone: 'mint', method: '신한카드 •••• 1904', note: '개인 플랜' },
  { id: 'telecom', name: 'SKT 통신비', category: '생활', amount: 68420, day: 7, status: 'overdue', auto: false, icon: 'S', tone: 'orange', method: '카카오뱅크 •••• 7732', note: '8월 청구서' },
  { id: 'youtube', name: 'YouTube Premium', category: '엔터테인먼트', amount: 14900, day: 26, status: 'upcoming', auto: true, icon: 'Y', tone: 'red', method: '현대카드 •••• 4821', note: '개인 멤버십' },
];
