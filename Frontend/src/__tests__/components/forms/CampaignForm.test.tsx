import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CampaignForm } from '@/modules/EmailMarketing/components/CampaignForm';

describe('CampaignForm', () => { const mockOnSubmit = vi.fn();

  it('should render form fields', () => {
    render(<CampaignForm onSubmit={mockOnSubmit } />);

    expect(screen.getByLabelText(/assunto/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/conteúdo/i)).toBeInTheDocument();

  });

  it('should validate required fields', async () => { render(<CampaignForm onSubmit={mockOnSubmit } />);

    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

    await waitFor(() => {
      expect(screen.getByText(/assunto é obrigatório/i)).toBeInTheDocument();

    });

  });

  it('should submit campaign', async () => { render(<CampaignForm onSubmit={mockOnSubmit } />);

    fireEvent.change(screen.getByLabelText(/assunto/i), { target: { value: 'Test Campaign' } );

    fireEvent.change(screen.getByLabelText(/conteúdo/i), { target: { value: 'Content' } );

    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();

    });

  });

});
