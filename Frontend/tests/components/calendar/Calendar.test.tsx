import { render, fireEvent } from '@testing-library/react';
import { Calendar } from '@/shared/components/calendar/Calendar';

describe('Calendar - Calendar', () => {
  it('should render calendar grid', () => {
    const { container } = render(<Calendar />);
    expect(container.querySelector('[data-testid="calendar-grid"]')).toBeInTheDocument();
  });

  it('should navigate months', () => {
    const { getByRole, getByText } = render(<Calendar />);
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    
    expect(getByText(currentMonth)).toBeInTheDocument();
    
    fireEvent.click(getByRole('button', { name: /next/i }));
    expect(getByText(currentMonth)).not.toBeInTheDocument();
  });

  it('should select date', () => {
    const onSelect = jest.fn();
    const { getByText } = render(<Calendar onSelect={onSelect} />);
    
    fireEvent.click(getByText('15'));
    expect(onSelect).toHaveBeenCalled();
  });
});
