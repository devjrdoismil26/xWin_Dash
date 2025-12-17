import { render } from '@testing-library/react';
import { LeadCard } from '@/modules/Leads/components/LeadCard';

describe('Edge Cases: Leads Module', () => {
  it('should handle leads without contact info', () => {
    const lead = { id: '1', name: 'Test', email: null, phone: null, status: 'new' };
    const { getByText } = render(<LeadCard lead={lead} />);
    expect(getByText(/no contact/i)).toBeInTheDocument();
  });

  it('should handle duplicate leads', () => {
    const lead = { id: '1', name: 'Test', email: 'test@test.com', status: 'duplicate' };
    const { getByText } = render(<LeadCard lead={lead} />);
    expect(getByText(/duplicate/i)).toBeInTheDocument();
  });
});
