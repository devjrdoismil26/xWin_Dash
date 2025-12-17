import { render, fireEvent } from '@testing-library/react';
import { Input } from '@/shared/components/ui/input';

describe('UI - Input', () => {
  it('should render input', () => {
    const { getByRole } = render(<Input />);
    expect(getByRole('textbox')).toBeInTheDocument();
  });

  it('should handle value change', () => {
    const onChange = jest.fn();
    const { getByRole } = render(<Input onChange={onChange} />);
    fireEvent.change(getByRole('textbox'), { target: { value: 'test' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('should display placeholder', () => {
    const { getByPlaceholderText } = render(<Input placeholder="Enter text" />);
    expect(getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('should be disabled', () => {
    const { getByRole } = render(<Input disabled />);
    expect(getByRole('textbox')).toBeDisabled();
  });

  it('should apply type', () => {
    const { getByRole } = render(<Input type="email" />);
    expect(getByRole('textbox')).toHaveAttribute('type', 'email');
  });
});
