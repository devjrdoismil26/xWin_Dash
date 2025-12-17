import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WorkflowForm } from '@/modules/Workflows/components/WorkflowForm';

describe('WorkflowForm', () => { const mockOnSubmit = vi.fn();

  it('should render workflow form', () => {
    render(<WorkflowForm onSubmit={mockOnSubmit } />);

    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/trigger/i)).toBeInTheDocument();

  });

  it('should validate workflow name', async () => { render(<WorkflowForm onSubmit={mockOnSubmit } />);

    fireEvent.click(screen.getByRole('button', { name: /criar/i }));

    await waitFor(() => {
      expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument();

    });

  });

  it('should submit workflow data', async () => { render(<WorkflowForm onSubmit={mockOnSubmit } />);

    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'New Workflow' } );

    fireEvent.click(screen.getByRole('button', { name: /criar/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();

    });

  });

});
