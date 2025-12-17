import { adstoolApi } from '@/api/adstool';

describe('ADStool API', () => {
  it('should have getCampaigns method', () => {
    expect(adstoolApi.getCampaigns).toBeDefined();
  });

  it('should have createCampaign method', () => {
    expect(adstoolApi.createCampaign).toBeDefined();
  });

  it('should have getMetrics method', () => {
    expect(adstoolApi.getMetrics).toBeDefined();
  });

  it('should have syncWithGoogle method', () => {
    expect(adstoolApi.syncWithGoogle).toBeDefined();
  });
});
