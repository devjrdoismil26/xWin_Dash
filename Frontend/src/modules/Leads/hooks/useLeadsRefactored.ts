import { useState, useCallback } from 'react';
import { Lead, LeadFormData, LeadFilters, LeadMetrics } from '../types';
import * as leadsService from '../services/leadsService';

export const useLeadsRefactored = () => {
  const [leads, setLeads] = useState<Lead[]>([]);

  const [metrics, setMetrics] = useState<LeadMetrics | null>(null);

  const [analytics, setAnalytics] = useState<unknown[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<LeadFilters>({});

  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 20
  });

  const fetchLeads = useCallback(async () => {
    setLoading(true);

    setError(null);

    try {
      const response = await leadsService.fetchLeads(filters);

      setLeads(response.data);

      setPagination(response.pagination);

    } catch (err: unknown) {
      setError(err.message || 'Erro ao carregar leads');

    } finally {
      setLoading(false);

    } , [filters]);

  const getLead = useCallback(async (id: number) => {
    setLoading(true);

    try {
      const lead = await leadsService.fetchLeadById(id);

      return lead;
    } catch (err: unknown) {
      setError(err.message);

      return null;
    } finally {
      setLoading(false);

    } , []);

  const createLead = useCallback(async (data: LeadFormData) => {
    setLoading(true);

    try {
      const newLead = await leadsService.createLead(data);

      setLeads((prev: unknown) => [newLead, ...prev]);

      return newLead;
    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const updateLead = useCallback(async (id: number, data: Partial<LeadFormData>) => {
    setLoading(true);

    try {
      const updated = await leadsService.updateLead(id, data);

      setLeads((prev: unknown) => prev.map((l: unknown) => (l.id === id ? updated : l)));

      return updated;
    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const deleteLead = useCallback(async (id: number) => {
    setLoading(true);

    try {
      await leadsService.deleteLead(id);

      setLeads((prev: unknown) => prev.filter((l: unknown) => l.id !== id));

    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const fetchMetrics = useCallback(async () => {
    try {
      const data = await leadsService.fetchLeadMetrics();

      setMetrics(data);

    } catch (err: unknown) {
      setError(err.message);

    } , []);

  const fetchAnalytics = useCallback(async () => {
    try {
      const data = await leadsService.fetchLeadAnalytics();

      setAnalytics(data);

    } catch (err: unknown) {
      setError(err.message);

    } , []);

  const refreshLeads = useCallback(() => {
    fetchLeads();

    fetchMetrics();

  }, [fetchLeads, fetchMetrics]);

  return {
    leads,
    metrics,
    analytics,
    loading,
    error,
    filters,
    pagination,
    setFilters,
    fetchLeads,
    getLead,
    createLead,
    updateLead,
    deleteLead,
    fetchMetrics,
    fetchAnalytics,
    refreshLeads};
};
