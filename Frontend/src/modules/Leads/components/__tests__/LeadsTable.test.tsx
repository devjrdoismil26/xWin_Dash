import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const LeadsTable = ({ leads, onEdit, onDelete, onSort }: unknown) => (
  <table />
    <thead />
      <tr />
        <th onClick={ () => onSort('name') }>Name</th>
        <th>Email</th>
        <th>Actions</th></tr></thead>
    <tbody />
      { leads.map((l: unknown) => (
        <tr key={l.id } />
          <td>{l.name}</td>
          <td>{l.email}</td>
          <td />
            <button onClick={ () => onEdit(l.id) }>Edit</button>
            <button onClick={ () => onDelete(l.id) }>Delete</button></td></tr>
      ))}
    </tbody>
  </table>);

describe('LeadsTable', () => {
  const mockLeads = [
    { id: 1, name: 'John', email: 'john@test.com' },
    { id: 2, name: 'Jane', email: 'jane@test.com' },
  ];

  it('should render all leads', () => {
    render(<LeadsTable leads={mockLeads} onEdit={vi.fn()} onDelete={vi.fn()} onSort={ vi.fn() } />);

    expect(screen.getByText('John')).toBeInTheDocument();

    expect(screen.getByText('Jane')).toBeInTheDocument();

  });

  it('should call onEdit', () => {
    const onEdit = vi.fn();

    render(<LeadsTable leads={mockLeads} onEdit={onEdit} onDelete={vi.fn()} onSort={ vi.fn() } />);

    fireEvent.click(screen.getAllByText('Edit')[0]);

    expect(onEdit).toHaveBeenCalledWith(1);

  });

  it('should call onDelete', () => {
    const onDelete = vi.fn();

    render(<LeadsTable leads={mockLeads} onEdit={vi.fn()} onDelete={onDelete} onSort={ vi.fn() } />);

    fireEvent.click(screen.getAllByText('Delete')[0]);

    expect(onDelete).toHaveBeenCalledWith(1);

  });

  it('should call onSort', () => {
    const onSort = vi.fn();

    render(<LeadsTable leads={mockLeads} onEdit={vi.fn()} onDelete={vi.fn()} onSort={ onSort } />);

    fireEvent.click(screen.getByText('Name'));

    expect(onSort).toHaveBeenCalledWith('name');

  });

  it('should render table headers', () => {
    render(<LeadsTable leads={mockLeads} onEdit={vi.fn()} onDelete={vi.fn()} onSort={ vi.fn() } />);

    expect(screen.getByText('Name')).toBeInTheDocument();

    expect(screen.getByText('Email')).toBeInTheDocument();

  });

});
