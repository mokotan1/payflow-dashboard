import { describe, expect, it } from 'vitest';
import { demoSubscriptions } from '@payflow/test-fixtures';
import {
  calculateSummary,
  filterSubscriptions,
  markPaid,
} from './index';

describe('filterSubscriptions', () => {
  it('matches Korean category without caring about letter case', () => {
    const results = filterSubscriptions(demoSubscriptions, '생산성', 'all');
    expect(results.map((item) => item.name)).toEqual(['Notion', 'ChatGPT Plus']);
  });

  it('returns only items with the selected status', () => {
    const results = filterSubscriptions(demoSubscriptions, '', 'attention');
    expect(results.map((item) => item.name)).toEqual(['Adobe Creative Cloud']);
  });
});

describe('calculateSummary', () => {
  it('separates paid money from upcoming money and counts risks', () => {
    const summary = calculateSummary([
      { amount: 10000, status: 'paid' },
      { amount: 20000, status: 'upcoming' },
      { amount: 30000, status: 'attention' },
      { amount: 40000, status: 'overdue' },
    ]);

    expect(summary).toEqual({
      paid: 10000,
      upcoming: 90000,
      risk: 2,
      total: 100000,
    });
  });
});

describe('markPaid', () => {
  it('returns a new collection and updates only the selected subscription', () => {
    const source = demoSubscriptions.slice(0, 2).map((item) => ({ ...item }));
    const updated = markPaid(source, source[1].id, '2026-08-13');

    expect(updated).not.toBe(source);
    expect(updated[1]).toMatchObject({ status: 'paid', paidAt: '2026-08-13' });
    expect(source[1].status).not.toBe('paid');
  });
});
