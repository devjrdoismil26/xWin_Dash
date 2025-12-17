import { render, fireEvent } from '@testing-library/react';
import { DatePicker } from '@/shared/components/calendar/DatePicker';

describe('Calendar - DatePicker', () => {
  it('should render date picker', () => {
    const { getByRole } = render(<DatePicker />);
    expect(getByRole('button')).toBeInTheDocument();
  });

  it('should open calendar on click', () => {
    const { getByRole, getByText } = render(<DatePicker />);
    fireEvent.click(getByRole('button'));
    expect(getByText(new Date().getFullYear())).toBeInTheDocument();
  });

  it('should select date', () => {
    const onSelect = jest.fn();
    const { getByRole, getByText } = render(<DatePicker onSelect={onSelect} />);
    
    fireEvent.click(getByRole('button'));
    fireEvent.click(getByText('15'));
    
    expect(onSelect).toHaveBeenCalled();
  });

  it('should display selected date', () => {
    const date = new Date('2025-12-15');
    const { getByText } = render(<DatePicker value={date} />);
    expect(getByText(/Dec 15, 2025/)).toBeInTheDocument();
  });
});
