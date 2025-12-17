import { render, screen, fireEvent } from '@testing-library/react';
import { Switch } from '@/shared/components/ui/Switch';

describe('Switch', () => {
  it('should render switch', () => {
    render(<Switch label="Enable feature" />);

    expect(screen.getByText('Enable feature')).toBeInTheDocument();

  });

  it('should toggle on click', () => { const onChange = vi.fn();

    render(<Switch onChange={onChange } />);

    const switchElement = screen.getByRole('switch');

    fireEvent.click(switchElement);

    expect(onChange).toHaveBeenCalledWith(true);

  });

  it('should be disabled', () => {
    render(<Switch disabled />);

    expect(screen.getByRole('switch')).toBeDisabled();

  });

  it('should be checked by default', () => {
    render(<Switch defaultChecked />);

    expect(screen.getByRole('switch')).toBeChecked();

  });

});
