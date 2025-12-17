import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Table } from '@/shared/components/ui/Table';

describe('Table Component', () => {
  const mockData = [
    { id: '1', name: 'John Doe', email: 'john@example.com', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
  ];

  const mockColumns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status' },
  ];

  it('should render table with data', () => {
    render(<Table data={mockData} columns={ mockColumns } />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();

    expect(screen.getByText('jane@example.com')).toBeInTheDocument();

  });

  it('should render column headers', () => {
    render(<Table data={mockData} columns={ mockColumns } />);

    expect(screen.getByText('Name')).toBeInTheDocument();

    expect(screen.getByText('Email')).toBeInTheDocument();

    expect(screen.getByText('Status')).toBeInTheDocument();

  });

  it('should render empty state when no data', () => {
    render(<Table data={[]} columns={mockColumns} emptyMessage="No data found" />);

    expect(screen.getByText('No data found')).toBeInTheDocument();

  });

  it('should handle row click', async () => {
    const handleRowClick = vi.fn();

    const user = userEvent.setup();

    render(<Table data={mockData} columns={mockColumns} onRowClick={ handleRowClick } />);

    const firstRow = screen.getByText('John Doe').closest('tr');

    await user.click(firstRow!);

    expect(handleRowClick).toHaveBeenCalledWith(mockData[0]);

  });

  it('should render custom cell content', () => {
    const customColumns = [
      {
        key: 'name',
        label: 'Name',
        render: (value: string) => <strong>{value}</strong>,
      },
    ];

    render(<Table data={mockData} columns={ customColumns } />);

    const nameCell = screen.getByText('John Doe');

    expect(nameCell.tagName).toBe('STRONG');

  });

  it('should handle sorting', async () => {
    const handleSort = vi.fn();

    const user = userEvent.setup();

    render(
      <Table
        data={ mockData }
        columns={ mockColumns }
        sortable
        onSort={ handleSort }
      / />);

    const nameHeader = screen.getByText('Name');

    await user.click(nameHeader);

    expect(handleSort).toHaveBeenCalledWith('name', 'asc');

  });

  it('should show loading state', () => {
    render(<Table data={[]} columns={mockColumns} loading />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

  });

  it('should render row actions', () => {
    const actions = (row: unknown) => (
      <div>
           
        </div><button>Edit {row.name}</button>
        <button>Delete</button>
      </div>);

    render(<Table data={mockData} columns={mockColumns} actions={ actions } />);

    expect(screen.getByText('Edit John Doe')).toBeInTheDocument();

    expect(screen.getAllByText('Delete')).toHaveLength(2);

  });

});
