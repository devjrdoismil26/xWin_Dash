import { render, fireEvent, waitFor } from '@testing-library/react';
import { CampaignForm } from '@/modules/EmailMarketing/components/CampaignForm';

describe('EmailMarketing - CampaignForm', () => {
  it('should render form fields', () => {
    const { getByLabelText } = render(<CampaignForm />);
    expect(getByLabelText(/campaign name/i)).toBeInTheDocument();
    expect(getByLabelText(/subject/i)).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    const { getByRole, getByText } = render(<CampaignForm />);
    fireEvent.click(getByRole('button', { name: /save/i }));
    await waitFor(() => {
      expect(getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  it('should submit valid form', async () => {
    const onSubmit = jest.fn();
    const { getByLabelText, getByRole } = render(<CampaignForm onSubmit={onSubmit} />);
    
    fireEvent.change(getByLabelText(/campaign name/i), { target: { value: 'Test Campaign' } });
    fireEvent.change(getByLabelText(/subject/i), { target: { value: 'Test Subject' } });
    fireEvent.click(getByRole('button', { name: /save/i }));
    
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  });
});
