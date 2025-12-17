import { render, fireEvent } from '@testing-library/react';
import { Checkbox } from '@/shared/components/ui/checkbox';

describe('UI - Checkbox', () => {
  it('should render checkbox', () => {
    const { getByRole } = render(<Checkbox />);
    expect(getByRole('checkbox')).toBeInTheDocument();
  });

  it('should handle check', () => {
    const onCheckedChange = jest.fn();
    const { getByRole } = render(<Checkbox onCheckedChange={onCheckedChange} />);
    fireEvent.click(getByRole('checkbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('should be disabled', () => {
    const { getByRole } = render(<Checkbox disabled />);
    expect(getByRole('checkbox')).toBeDisabled();
  });
});
