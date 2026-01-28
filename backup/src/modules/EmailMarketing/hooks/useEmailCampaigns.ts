import { useState, useEffect, useCallback, useMemo } from 'react';

export interface EmailCampaign {
  id: number;
  name: string;
  subject: string;
  content: string;
  email_list_id: number;
  user_id: number;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled';
  scheduled_at?: string;
  sent_at?: string;
  created_at: string;
  updated_at: string;
  metrics?: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  };
}

export interface CreateCampaignData {
  name: string;
  subject: string;
  content: string;
  email_list_id: number;
  status?: string;
  scheduled_at?: string;
}

export interface UpdateCampaignData extends Partial<CreateCampaignData> {
  id: number;
}

export interface CampaignFilters {
  status?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export const useEmailCampaigns = () => {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  // Fetch campaigns
  const fetchCampaigns = useCallback(async (filters: CampaignFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.per_page) params.append('per_page', filters.per_page.toString());

      const response = await fetch(`/api/v1/email-marketing/email-campaigns?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }

      const data = await response.json();
      setCampaigns(data.data || []);
      setPagination(data.meta || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create campaign
  const createCampaign = useCallback(async (data: CreateCampaignData): Promise<EmailCampaign> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/email-marketing/email-campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create campaign');
      }

      const newCampaign = await response.json();
      setCampaigns(prev => [newCampaign, ...prev]);
      return newCampaign;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create campaign');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update campaign
  const updateCampaign = useCallback(async (data: UpdateCampaignData): Promise<EmailCampaign> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v1/email-marketing/email-campaigns/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update campaign');
      }

      const updatedCampaign = await response.json();
      setCampaigns(prev => prev.map(c => c.id === data.id ? updatedCampaign : c));
      return updatedCampaign;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update campaign');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete campaign
  const deleteCampaign = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v1/email-marketing/email-campaigns/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete campaign');
      }

      setCampaigns(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete campaign');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get single campaign
  const getCampaign = useCallback(async (id: number): Promise<EmailCampaign> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v1/email-marketing/email-campaigns/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch campaign');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch campaign');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Send campaign now
  const sendCampaignNow = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v1/email-marketing/email-campaigns/${id}/send-now`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to send campaign');
      }

      // Update campaign status
      setCampaigns(prev => prev.map(c => 
        c.id === id ? { ...c, status: 'sending' as const } : c
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send campaign');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Schedule campaign
  const scheduleCampaign = useCallback(async (id: number, scheduledAt: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v1/email-marketing/email-campaigns/${id}/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scheduled_at: scheduledAt }),
      });

      if (!response.ok) {
        throw new Error('Failed to schedule campaign');
      }

      // Update campaign status
      setCampaigns(prev => prev.map(c => 
        c.id === id ? { ...c, status: 'scheduled' as const, scheduled_at: scheduledAt } : c
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to schedule campaign');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Send test email
  const sendTestEmail = useCallback(async (id: number, testEmails: string[]): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v1/email-marketing/email-campaigns/${id}/send-test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test_emails: testEmails }),
      });

      if (!response.ok) {
        throw new Error('Failed to send test email');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send test email');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update campaign status
  const updateCampaignStatus = useCallback(async (id: number, status: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v1/email-marketing/email-campaigns/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update campaign status');
      }

      // Update campaign status
      setCampaigns(prev => prev.map(c => 
        c.id === id ? { ...c, status: status as any } : c
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update campaign status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Attach segments to campaign
  const attachSegments = useCallback(async (id: number, segmentIds: number[]): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v1/email-marketing/email-campaigns/${id}/segments/attach`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ segment_ids: segmentIds }),
      });

      if (!response.ok) {
        throw new Error('Failed to attach segments');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to attach segments');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Detach segments from campaign
  const detachSegments = useCallback(async (id: number, segmentIds: number[]): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v1/email-marketing/email-campaigns/${id}/segments/detach`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ segment_ids: segmentIds }),
      });

      if (!response.ok) {
        throw new Error('Failed to detach segments');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to detach segments');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoizar dados computados para performance
  const campaignsStats = useMemo(() => {
    if (!campaigns.length) return { total: 0, sent: 0, draft: 0, scheduled: 0 };
    
    return campaigns.reduce((acc, campaign) => {
      acc.total++;
      if (campaign.status === 'sent') acc.sent++;
      if (campaign.status === 'draft') acc.draft++;
      if (campaign.status === 'scheduled') acc.scheduled++;
      return acc;
    }, { total: 0, sent: 0, draft: 0, scheduled: 0 });
  }, [campaigns]);

  const hasActiveCampaigns = useMemo(() => {
    return campaigns.some(campaign => 
      campaign.status === 'sending' || campaign.status === 'scheduled'
    );
  }, [campaigns]);

  return {
    campaigns,
    loading,
    error,
    pagination,
    campaignsStats,
    hasActiveCampaigns,
    fetchCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    getCampaign,
    sendCampaignNow,
    scheduleCampaign,
    sendTestEmail,
    updateCampaignStatus,
    attachSegments,
    detachSegments,
  };
};

export default useEmailCampaigns;
