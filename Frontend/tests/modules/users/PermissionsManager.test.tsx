import { render, fireEvent } from '@testing-library/react';
import { PermissionsManager } from '@/modules/Users/components/PermissionsManager';

describe('Users - PermissionsManager', () => {
  const mockPermissions = [
    { id: '1', name: 'products.create', granted: true },
    { id: '2', name: 'products.delete', granted: false },
    { id: '3', name: 'users.manage', granted: true },
  ];

  it('should render permissions list', () => {
    const { getByText } = render(<PermissionsManager permissions={mockPermissions} />);
    expect(getByText('products.create')).toBeInTheDocument();
    expect(getByText('products.delete')).toBeInTheDocument();
    expect(getByText('users.manage')).toBeInTheDocument();
  });

  it('should show granted permissions as checked', () => {
    const { container } = render(<PermissionsManager permissions={mockPermissions} />);
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[2]).toBeChecked();
  });

  it('should toggle permission', () => {
    const onChange = jest.fn();
    const { container } = render(
      <PermissionsManager permissions={mockPermissions} onChange={onChange} />
    );
    const checkbox = container.querySelectorAll('input[type="checkbox"]')[1];
    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledWith('2', true);
  });
});
