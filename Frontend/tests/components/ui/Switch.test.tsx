import { render, fireEvent } from '@testing-library/react';
import { Switch } from '@/shared/components/ui/switch';

describe('UI - Switch', () => {
  it('should render switch', () => {
    const { getByRole } = render(<Switch />);
    expect(getByRole('switch')).toBeInTheDocument();
  });

  it('should toggle switch', () => {
    const onCheckedChange = jest.fn();
    const { getByRole } = render(<Switch onCheckedChange={onCheckedChange} />);
    fireEvent.click(getByRole('switch'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('should be disabled', () => {
    const { getByRole } = render(<Switch disabled />);
    expect(getByRole('switch')).toBeDisabled();
  });
});
