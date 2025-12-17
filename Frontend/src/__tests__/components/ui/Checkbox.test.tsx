import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from '@/shared/components/ui/Checkbox';

describe('Checkbox', () => {
  it('should render checkbox', () => {
    render(<Checkbox label="Accept terms" />);

    expect(screen.getByText('Accept terms')).toBeInTheDocument();

  });

  it('should toggle on click', () => { const onChange = vi.fn();

    render(<Checkbox onChange={onChange } />);

    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(checkbox);

    expect(onChange).toHaveBeenCalledWith(true);

  });

  it('should be disabled', () => {
    render(<Checkbox disabled />);

    expect(screen.getByRole('checkbox')).toBeDisabled();

  });

  it('should be checked by default', () => {
    render(<Checkbox defaultChecked />);

    expect(screen.getByRole('checkbox')).toBeChecked();

  });

});
