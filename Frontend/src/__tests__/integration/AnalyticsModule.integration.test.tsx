import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { AnalyticsModule } from '@/modules/Analytics';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={ queryClient }>{children}</QueryClientProvider>);

describe('AnalyticsModule Integration', () => {
  it('should render analytics dashboard', async () => {
    render(<AnalyticsModule />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/analytics/i)).toBeInTheDocument();

    });

  });

  it('should change time period', async () => {
    render(<AnalyticsModule />, { wrapper });

    const periodSelector = await screen.findByRole('button', { name: /7 dias/i });

    fireEvent.click(periodSelector);

    const option30d = screen.getByText(/30 dias/i);

    fireEvent.click(option30d);

    await waitFor(() => {
      expect(screen.getByText(/30 dias/i)).toBeInTheDocument();

    });

  });

  it('should display charts', async () => {
    render(<AnalyticsModule />, { wrapper });

    await waitFor(() => {
      expect(screen.getByTestId('analytics-chart')).toBeInTheDocument();

    });

  });

});
