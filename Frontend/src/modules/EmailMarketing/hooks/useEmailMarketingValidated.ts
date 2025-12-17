import { useState, useCallback } from 'react';
import { validatedApiClient } from '@/services';
import { EmailCampaignSchema, EmailTemplateSchema, type EmailCampaign, type EmailTemplate } from '@/schemas';
import { z } from 'zod';

export function useEmailMarketingValidated() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);

  const [templates, setTemplates] = useState<EmailTemplate[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);

      setError(null);

      const data = await validatedApiClient.get('/email/campaigns', z.array(EmailCampaignSchema));

      setCampaigns(data);

      return data;
    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);

      const data = await validatedApiClient.get('/email/templates', z.array(EmailTemplateSchema));

      setTemplates(data);

      return data;
    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const createCampaign = useCallback(async (data: Partial<EmailCampaign>) => {
    try {
      setLoading(true);

      const newCampaign = await validatedApiClient.post('/email/campaigns', EmailCampaignSchema, data);

      setCampaigns(prev => [...prev, newCampaign]);

      return newCampaign;
    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const sendCampaign = useCallback(async (id: string | number) => {
    try {
      setLoading(true);

      const updated = await validatedApiClient.post(`/email/campaigns/${id}/send`, EmailCampaignSchema, {});

      setCampaigns(prev => prev.map(c => c.id === id ? updated : c));

      return updated;
    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const createTemplate = useCallback(async (data: Partial<EmailTemplate>) => {
    try {
      setLoading(true);

      const newTemplate = await validatedApiClient.post('/email/templates', EmailTemplateSchema, data);

      setTemplates(prev => [...prev, newTemplate]);

      return newTemplate;
    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  return {
    campaigns,
    templates,
    loading,
    error,
    fetchCampaigns,
    fetchTemplates,
    createCampaign,
    sendCampaign,
    createTemplate};

}
