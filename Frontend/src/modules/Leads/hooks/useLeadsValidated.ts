import { useState, useCallback } from 'react';
import { validatedApiClient } from '@/services';
import { LeadSchema, LeadActivitySchema, type Lead, type LeadActivity } from '@/schemas';
import { z } from 'zod';

export function useLeadsValidated() {
  const [leads, setLeads] = useState<Lead[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async (filters?: string) => {
    try {
      setLoading(true);

      setError(null);

      const data = await validatedApiClient.get('/leads', z.array(LeadSchema), { params: filters });

      setLeads(data);

      return data;
    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const getLead = useCallback(async (id: string | number) => {
    try {
      setLoading(true);

      return await validatedApiClient.get(`/leads/${id}`, LeadSchema);

    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const createLead = useCallback(async (data: Partial<Lead>) => {
    try {
      setLoading(true);

      const newLead = await validatedApiClient.post('/leads', LeadSchema, data);

      setLeads(prev => [...prev, newLead]);

      return newLead;
    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const updateLead = useCallback(async (id: string | number, data: Partial<Lead>) => {
    try {
      setLoading(true);

      const updated = await validatedApiClient.put(`/leads/${id}`, LeadSchema, data);

      setLeads(prev => prev.map(l => l.id === id ? updated : l));

      return updated;
    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const deleteLead = useCallback(async (id: string | number) => {
    try {
      setLoading(true);

      await validatedApiClient.delete(`/leads/${id}`);

      setLeads(prev => prev.filter(l => l.id !== id));

    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const getLeadActivities = useCallback(async (leadId: string | number) => {
    try {
      setLoading(true);

      return await validatedApiClient.get(`/leads/${leadId}/activities`, z.array(LeadActivitySchema));

    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  return {
    leads,
    loading,
    error,
    fetchLeads,
    getLead,
    createLead,
    updateLead,
    deleteLead,
    getLeadActivities};

}
