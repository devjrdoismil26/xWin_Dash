import { render } from '@testing-library/react';
import { CampaignList } from '@/modules/EmailMarketing/components/CampaignList';
import { CampaignForm } from '@/modules/EmailMarketing/components/CampaignForm';
import { EmailEditor } from '@/modules/EmailMarketing/components/EmailEditor';

describe('EmailMarketing Module Snapshots', () => {
  it('should match CampaignList snapshot', () => {
    const { container } = render(<CampaignList campaigns={[]} />);
    expect(container).toMatchSnapshot();
  });

  it('should match CampaignForm snapshot', () => {
    const { container } = render(<CampaignForm onSubmit={jest.fn()} />);
    expect(container).toMatchSnapshot();
  });

  it('should match EmailEditor snapshot', () => {
    const { container } = render(<EmailEditor onChange={jest.fn()} />);
    expect(container).toMatchSnapshot();
  });
});
