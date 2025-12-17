import { render, screen, fireEvent } from '@testing-library/react';
import { Dropdown } from '@/shared/components/ui/Dropdown';

describe('Dropdown', () => {
  const items = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
  ];

  it('should render dropdown', () => {
    render(<Dropdown items={items} placeholder="Select" />);

    expect(screen.getByText('Select')).toBeInTheDocument();

  });

  it('should open on click', () => { render(<Dropdown items={items } />);

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('Option 1')).toBeVisible();

    expect(screen.getByText('Option 2')).toBeVisible();

  });

  it('should select item', () => {
    const onChange = vi.fn();

    render(<Dropdown items={items} onChange={ onChange } />);

    fireEvent.click(screen.getByRole('button'));

    fireEvent.click(screen.getByText('Option 1'));

    expect(onChange).toHaveBeenCalledWith('1');

  });

});
