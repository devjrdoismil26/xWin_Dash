import { render, fireEvent, waitFor } from '@testing-library/react';
import { LeadForm } from '@/modules/Leads/components/LeadForm';

describe('Leads - LeadForm', () => {
  it('should render form fields', () => {
    const { getByLabelText } = render(<LeadForm />);
    expect(getByLabelText(/name/i)).toBeInTheDocument();
    expect(getByLabelText(/email/i)).toBeInTheDocument();
    expect(getByLabelText(/phone/i)).toBeInTheDocument();
  });

  it('should validate email format', async () => {
    const { getByLabelText, getByRole, getByText } = render(<LeadForm />);
    fireEvent.change(getByLabelText(/email/i), { target: { value: 'invalid-email' } });
    fireEvent.click(getByRole('button', { name: /save/i }));
    await waitFor(() => {
      expect(getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it('should submit valid lead', async () => {
    const onSubmit = jest.fn();
    const { getByLabelText, getByRole } = render(<LeadForm onSubmit={onSubmit} />);
    
    fireEvent.change(getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(getByLabelText(/email/i), { target: { value: 'john@test.com' } });
    fireEvent.click(getByRole('button', { name: /save/i }));
    
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  });
});
