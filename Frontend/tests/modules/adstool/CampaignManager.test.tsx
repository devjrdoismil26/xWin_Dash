import { render, fireEvent, waitFor } from '@testing-library/react';
import { CampaignManager } from '@/modules/ADStool/components/CampaignManager';

describe('ADStool - CampaignManager', () => {
  const mockCampaigns = [
    { id: '1', name: 'Campaign 1', status: 'active', budget: 1000, clicks: 500 },
    { id: '2', name: 'Campaign 2', status: 'paused', budget: 2000, clicks: 1000 },
  ];

  it('should render campaigns list', () => {
    const { getByText } = render(<CampaignManager campaigns={mockCampaigns} />);
    expect(getByText('Campaign 1')).toBeInTheDocument();
    expect(getByText('Campaign 2')).toBeInTheDocument();
  });

  it('should display campaign metrics', () => {
    const { getByText } = render(<CampaignManager campaigns={mockCampaigns} />);
    expect(getByText('500')).toBeInTheDocument();
    expect(getByText('1000')).toBeInTheDocument();
  });

  it('should pause campaign', async () => {
    const onPause = jest.fn();
    const { getAllByRole } = render(<CampaignManager campaigns={mockCampaigns} onPause={onPause} />);
    fireEvent.click(getAllByRole('button', { name: /pause/i })[0]);
    await waitFor(() => expect(onPause).toHaveBeenCalledWith('1'));
  });
});
