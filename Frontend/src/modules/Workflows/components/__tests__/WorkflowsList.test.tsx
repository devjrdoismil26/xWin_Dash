import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const WorkflowsList = ({ workflows, onEdit, onDelete, onExecute }: unknown) => (
  <div>
           
        </div>{workflows.length === 0 ? <p>No workflows</p> : null}
    {workflows.map((w: unknown) => (
      <div key={w.id} data-testid={`workflow-${w.id}`}>
           
        </div><span>{w.name}</span>
        <button onClick={ () => onEdit(w.id) }>Edit</button>
        <button onClick={ () => onDelete(w.id) }>Delete</button>
        <button onClick={ () => onExecute(w.id) }>Execute</button>
      </div>
    </>
  ))}
  </div>);

describe('WorkflowsList', () => {
  const mockWorkflows = [
    { id: 1, name: 'Workflow 1' },
    { id: 2, name: 'Workflow 2' },
  ];

  it('should render all workflows', () => {
    render(<WorkflowsList workflows={mockWorkflows} onEdit={vi.fn()} onDelete={vi.fn()} onExecute={ vi.fn() } />);

    expect(screen.getByText('Workflow 1')).toBeInTheDocument();

  });

  it('should show empty state', () => {
    render(<WorkflowsList workflows={[]} onEdit={vi.fn()} onDelete={vi.fn()} onExecute={ vi.fn() } />);

    expect(screen.getByText('No workflows')).toBeInTheDocument();

  });

  it('should call onEdit', () => {
    const onEdit = vi.fn();

    render(<WorkflowsList workflows={mockWorkflows} onEdit={onEdit} onDelete={vi.fn()} onExecute={ vi.fn() } />);

    fireEvent.click(screen.getAllByText('Edit')[0]);

    expect(onEdit).toHaveBeenCalledWith(1);

  });

  it('should call onDelete', () => {
    const onDelete = vi.fn();

    render(<WorkflowsList workflows={mockWorkflows} onEdit={vi.fn()} onDelete={onDelete} onExecute={ vi.fn() } />);

    fireEvent.click(screen.getAllByText('Delete')[0]);

    expect(onDelete).toHaveBeenCalledWith(1);

  });

  it('should call onExecute', () => {
    const onExecute = vi.fn();

    render(<WorkflowsList workflows={mockWorkflows} onEdit={vi.fn()} onDelete={vi.fn()} onExecute={ onExecute } />);

    fireEvent.click(screen.getAllByText('Execute')[0]);

    expect(onExecute).toHaveBeenCalledWith(1);

  });

});
