import { render } from '@testing-library/react';
import { LeadsList } from '@/modules/Leads/components/LeadsList';
import { LeadForm } from '@/modules/Leads/components/LeadForm';
import { LeadCard } from '@/modules/Leads/components/LeadCard';

describe('Leads Module Snapshots', () => {
  it('should match LeadsList snapshot', () => {
    const { container } = render(<LeadsList leads={[]} />);
    expect(container).toMatchSnapshot();
  });

  it('should match LeadForm snapshot', () => {
    const { container } = render(<LeadForm onSubmit={jest.fn()} />);
    expect(container).toMatchSnapshot();
  });

  it('should match LeadCard snapshot', () => {
    const lead = { id: '1', name: 'John', email: 'john@test.com', status: 'new' };
    const { container } = render(<LeadCard lead={lead} />);
    expect(container).toMatchSnapshot();
  });
});
