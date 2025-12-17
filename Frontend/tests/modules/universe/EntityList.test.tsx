import { render, fireEvent } from '@testing-library/react';
import { EntityList } from '@/modules/Universe/components/EntityList';

describe('Universe - EntityList', () => {
  const mockEntities = [
    { id: '1', name: 'Entity 1', type: 'customer', status: 'active' },
    { id: '2', name: 'Entity 2', type: 'product', status: 'inactive' },
  ];

  it('should render entities', () => {
    const { getByText } = render(<EntityList entities={mockEntities} />);
    expect(getByText('Entity 1')).toBeInTheDocument();
    expect(getByText('Entity 2')).toBeInTheDocument();
  });

  it('should filter by type', () => {
    const { getByRole, queryByText } = render(<EntityList entities={mockEntities} />);
    fireEvent.change(getByRole('combobox'), { target: { value: 'customer' } });
    expect(queryByText('Entity 2')).not.toBeInTheDocument();
  });

  it('should select entity', () => {
    const onSelect = jest.fn();
    const { getByText } = render(<EntityList entities={mockEntities} onSelect={onSelect} />);
    fireEvent.click(getByText('Entity 1'));
    expect(onSelect).toHaveBeenCalledWith('1');
  });
});
