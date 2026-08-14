import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { calculateSummary } from '@payflow/domain';
import { demoSubscriptions } from '@payflow/test-fixtures';
import { App } from './App';

function renderWallet() {
  const view = render(<App />);
  return {
    ...view,
    ui: within(view.container),
  };
}

describe('Wallet dashboard', () => {
  it('renders the monthly summary from demo subscriptions', () => {
    const summary = calculateSummary(demoSubscriptions);
    const { ui } = renderWallet();

    expect(ui.getByRole('heading', { name: `${summary.total.toLocaleString('ko-KR')}원` })).toBeInTheDocument();
    expect(ui.getByText(`${summary.risk}건`)).toBeInTheDocument();
  });

  it('filters subscriptions by search keyword', async () => {
    const user = userEvent.setup();
    const { ui } = renderWallet();

    await user.type(ui.getByPlaceholderText('구독 검색'), '생산성');

    expect(ui.getByRole('heading', { name: 'Notion' })).toBeInTheDocument();
    expect(ui.getByRole('heading', { name: 'ChatGPT Plus' })).toBeInTheDocument();
    expect(ui.queryByRole('heading', { name: 'Netflix' })).not.toBeInTheDocument();
  });

  it('filters subscriptions by payment status', async () => {
    const user = userEvent.setup();
    const { ui } = renderWallet();

    await user.selectOptions(ui.getByLabelText('결제 상태'), 'attention');

    expect(ui.getByRole('heading', { name: 'Adobe Creative Cloud' })).toBeInTheDocument();
    expect(ui.queryByRole('heading', { name: 'Netflix' })).not.toBeInTheDocument();
  });

  it('marks a subscription as paid through the demo payment dialog', async () => {
    const user = userEvent.setup();
    const { container, ui } = renderWallet();

    const netflixCard = ui.getByRole('heading', { name: 'Netflix' }).closest('.wallet-item');
    expect(netflixCard).not.toBeNull();

    await user.click(within(netflixCard as HTMLElement).getByRole('button', { name: '바로 결제' }));
    await user.click(within(container).getByRole('button', { name: '확인하고 데모 결제' }));

    expect(within(netflixCard as HTMLElement).getByText('결제 완료')).toBeInTheDocument();
    expect(within(container).getByRole('status')).toHaveTextContent('데모 결제가 완료 처리되었습니다');
  });
});
