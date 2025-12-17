import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select from '@/shared/components/ui/Select';

describe('Select Component', () => {
  const options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ];

  it('should render with options', () => { render(<Select options={options } />);

    const select = screen.getByRole('combobox');

    expect(select).toBeInTheDocument();

  });

  it('should handle selection', async () => {
    const handleChange = vi.fn();

    const user = userEvent.setup();

    render(<Select options={options} onChange={ handleChange } />);

    const select = screen.getByRole('combobox');

    await user.selectOptions(select, '2');

    expect(handleChange).toHaveBeenCalledWith('2');

  });

  it('should display placeholder', () => {
    render(<Select options={options} placeholder="Select an option" />);

    expect(screen.getByText('Select an option')).toBeInTheDocument();

  });

  it('should show selected value', () => {
    render(<Select options={options} value="2" />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('2');

  });

  it('should be disabled', () => {
    render(<Select options={options} disabled />);

    const select = screen.getByRole('combobox');

    expect(select).toBeDisabled();

  });

  it('should show error state', () => {
    render(<Select options={options} error="This field is required" />);

    expect(screen.getByText('This field is required')).toBeInTheDocument();

  });

  it('should support multiple selection', async () => {
    const handleChange = vi.fn();

    const user = userEvent.setup();

    render(<Select options={options} multiple onChange={ handleChange } />);

    const select = screen.getByRole('listbox');

    const option1 = screen.getByRole('option', { name: 'Option 1' });

    const option2 = screen.getByRole('option', { name: 'Option 2' });

    await user.click(option1);

    await user.click(option2);

    expect(handleChange).toHaveBeenCalled();

  });

});
