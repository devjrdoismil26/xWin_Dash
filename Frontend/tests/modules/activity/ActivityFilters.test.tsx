import { render, fireEvent } from '@testing-library/react';
import { ActivityFilters } from '@/modules/Activity/components/ActivityFilters';

describe('Activity - ActivityFilters', () => {
  it('should render filter options', () => {
    const { getByLabelText } = render(<ActivityFilters onFilter={jest.fn()} />);
    expect(getByLabelText(/type/i)).toBeInTheDocument();
    expect(getByLabelText(/user/i)).toBeInTheDocument();
  });

  it('should apply filters', () => {
    const onFilter = jest.fn();
    const { getByLabelText } = render(<ActivityFilters onFilter={onFilter} />);
    fireEvent.change(getByLabelText(/type/i), { target: { value: 'create' } });
    expect(onFilter).toHaveBeenCalledWith({ type: 'create' });
  });

  it('should reset filters', () => {
    const onFilter = jest.fn();
    const { getByRole } = render(<ActivityFilters onFilter={onFilter} />);
    fireEvent.click(getByRole('button', { name: /reset/i }));
    expect(onFilter).toHaveBeenCalledWith({});
  });
});
