/**
 * Mock do ADStool Service para testes
 */
export const mockAdsService = {
  accounts: {
    getAccounts: jest.fn().mockResolvedValue({
      success: true,
      data: [
        {
          id: '1',
          name: 'Test Account 1',
          platform: 'Google Ads',
          status: 'ACTIVE',
          balance: 1000,
          created_at: '2024-01-01'
        },
        {
          id: '2',
          name: 'Test Account 2',
          platform: 'Facebook Ads',
          status: 'ACTIVE',
          balance: 2000,
          created_at: '2024-01-02'
        }
      ]
    }),
    createAccount: jest.fn().mockResolvedValue({
      success: true,
      data: {
        id: '3',
        name: 'New Account',
        platform: 'Google Ads',
        status: 'ACTIVE',
        balance: 0,
        created_at: '2024-01-03'
      }
    }),
    updateAccount: jest.fn().mockResolvedValue({
      success: true,
      data: {
        id: '1',
        name: 'Updated Account',
        platform: 'Google Ads',
        status: 'ACTIVE'
      }
    }),
    deleteAccount: jest.fn().mockResolvedValue({
      success: true,
      message: 'Account deleted successfully'
    })
  },

  campaigns: {
    getCampaigns: jest.fn().mockResolvedValue({
      success: true,
      data: [
        {
          id: '1',
          name: 'Test Campaign 1',
          status: 'ACTIVE',
          platform: 'Google Ads',
          daily_budget: 100,
          total_spend: 1000,
          impressions: 10000,
          clicks: 500,
          conversions: 25,
          created_at: '2024-01-01'
        },
        {
          id: '2',
          name: 'Test Campaign 2',
          status: 'PAUSED',
          platform: 'Facebook Ads',
          daily_budget: 200,
          total_spend: 2000,
          impressions: 20000,
          clicks: 1000,
          conversions: 50,
          created_at: '2024-01-02'
        }
      ]
    }),
    createCampaign: jest.fn().mockResolvedValue({
      success: true,
      data: {
        id: '3',
        name: 'New Campaign',
        status: 'ACTIVE',
        platform: 'Google Ads',
        daily_budget: 150,
        total_spend: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        created_at: '2024-01-03'
      }
    }),
    updateCampaign: jest.fn().mockResolvedValue({
      success: true,
      data: {
        id: '1',
        name: 'Updated Campaign',
        status: 'ACTIVE',
        platform: 'Google Ads'
      }
    }),
    deleteCampaign: jest.fn().mockResolvedValue({
      success: true,
      message: 'Campaign deleted successfully'
    })
  },

  creatives: {
    getCreatives: jest.fn().mockResolvedValue({
      success: true,
      data: [
        {
          id: '1',
          name: 'Test Creative 1',
          type: 'IMAGE',
          status: 'ACTIVE',
          platform: 'Google Ads',
          impressions: 5000,
          clicks: 250,
          ctr: 5.0,
          created_at: '2024-01-01'
        }
      ]
    }),
    createCreative: jest.fn().mockResolvedValue({
      success: true,
      data: {
        id: '2',
        name: 'New Creative',
        type: 'VIDEO',
        status: 'ACTIVE',
        platform: 'Facebook Ads',
        impressions: 0,
        clicks: 0,
        ctr: 0,
        created_at: '2024-01-03'
      }
    })
  },

  analytics: {
    getAnalytics: jest.fn().mockResolvedValue({
      success: true,
      data: {
        total_spend: 3000,
        total_impressions: 30000,
        total_clicks: 1500,
        total_conversions: 75,
        average_ctr: 5.0,
        average_cpc: 2.0,
        average_cpa: 40.0,
        roi: 150.0
      }
    }),
    getCampaignAnalytics: jest.fn().mockResolvedValue({
      success: true,
      data: {
        campaign_id: '1',
        spend: 1000,
        impressions: 10000,
        clicks: 500,
        conversions: 25,
        ctr: 5.0,
        cpc: 2.0,
        cpa: 40.0
      }
    })
  },

  templates: {
    getTemplates: jest.fn().mockResolvedValue({
      success: true,
      data: [
        {
          id: '1',
          name: 'E-commerce Template',
          type: 'campaign',
          platform: 'Google Ads',
          category: 'ecommerce',
          description: 'Template for e-commerce campaigns',
          is_public: true
        }
      ]
    }),
    createTemplate: jest.fn().mockResolvedValue({
      success: true,
      data: {
        id: '2',
        name: 'New Template',
        type: 'creative',
        platform: 'Facebook Ads',
        category: 'social',
        description: 'New creative template',
        is_public: false
      }
    })
  },

  getDashboard: jest.fn().mockResolvedValue({
    success: true,
    data: {
      accounts: [
        {
          id: '1',
          name: 'Test Account',
          platform: 'Google Ads',
          status: 'ACTIVE'
        }
      ],
      campaigns: [
        {
          id: '1',
          name: 'Test Campaign',
          status: 'ACTIVE',
          platform: 'Google Ads'
        }
      ],
      analytics: {
        total_spend: 1000,
        total_impressions: 10000,
        total_clicks: 500
      }
    }
  }),

  getStats: jest.fn().mockResolvedValue({
    success: true,
    data: {
      total_campaigns: 2,
      active_campaigns: 1,
      paused_campaigns: 1,
      total_accounts: 2,
      connected_accounts: 2,
      total_spend: 3000,
      total_impressions: 30000,
      total_clicks: 1500,
      total_conversions: 75
    }
  })
};

export default mockAdsService;
