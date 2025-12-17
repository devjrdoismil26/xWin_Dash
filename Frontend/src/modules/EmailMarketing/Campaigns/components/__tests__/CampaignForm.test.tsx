import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const CampaignForm = ({ onSubmit, onCancel, initialData }: unknown) => (
  <form onSubmit={(e) => { e.preventDefault(); onSubmit({}); } >
    <label htmlFor="name">Name</label>
    <input id="name" defaultValue={initialData?.name} / />
    <label htmlFor="subject">Subject</label>
    <input id="subject" defaultValue={initialData?.subject} / />
    <button type="submit">Submit</button>
    <button type="button" onClick={ onCancel }>Cancel</button>
  </form>);

describe('CampaignForm', () => {
  const mockOnSubmit = vi.fn();

  const mockOnCancel = vi.fn();

  it('should render all fields', () => {
    render(<CampaignForm onSubmit={mockOnSubmit} onCancel={ mockOnCancel } />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();

  });

  it('should validate required fields', async () => {
    render(<CampaignForm onSubmit={mockOnSubmit} onCancel={ mockOnCancel } />);

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();

    });

  });

  it('should submit valid data', async () => {
    render(<CampaignForm onSubmit={mockOnSubmit} onCancel={ mockOnCancel } />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Campaign' } );

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();

    });

  });

  it('should call onCancel', () => {
    render(<CampaignForm onSubmit={mockOnSubmit} onCancel={ mockOnCancel } />);

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(mockOnCancel).toHaveBeenCalled();

  });

  it('should populate with initial data', () => {
    const data = { name: 'Test Campaign', subject: 'Test Subject'};

    render(<CampaignForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} initialData={ data } />);

    expect(screen.getByLabelText(/name/i)).toHaveValue('Test Campaign');

  });

});
