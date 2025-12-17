// ========================================
// HOOK DE IMPORT/EXPORT DE LEADS
// ========================================
import { useState, useCallback } from 'react';
import { leadsService } from '@/services/leadsService';
import { getErrorMessage } from '@/utils/errorHelpers';
import { LeadImportTemplate, LeadImportValidation, LeadExportTemplate, LeadFilters } from '@/types';

export const useLeadImportExport = () => {
  const [importTemplate, setImportTemplate] = useState<LeadImportTemplate | null>(null);

  const [exportTemplate, setExportTemplate] = useState<LeadExportTemplate | null>(null);

  const [validation, setValidation] = useState<LeadImportValidation | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const getImportTemplate = useCallback(async () => {
    setLoading(true);

    setError(null);

    try {
      const response = await leadsService.getImportTemplate();

      if (response.success) {
        setImportTemplate(response.data as LeadImportTemplate);

      } else {
        setError(response.error || 'Erro ao carregar template de importação');

      } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      setError(errorMessage);

    } finally {
      setLoading(false);

    } , []);

  const getExportTemplate = useCallback(async () => {
    setLoading(true);

    setError(null);

    try {
      const response = await leadsService.getExportTemplate();

      if (response.success) {
        setExportTemplate(response.data as LeadExportTemplate);

      } else {
        setError(response.error || 'Erro ao carregar template de exportação');

      } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      setError(errorMessage);

    } finally {
      setLoading(false);

    } , []);

  const validateImportData = useCallback(async (data: Record<string, any>[]) => {
    setLoading(true);

    setError(null);

    try {
      const response = await leadsService.validateImportData(data);

      if (response.success) {
        setValidation(response.data as LeadImportValidation);

      } else {
        setError(response.error || 'Erro na validação dos dados');

      } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      setError(errorMessage);

    } finally {
      setLoading(false);

    } , []);

  const importLeads = useCallback(async (data: Record<string, any>[]) => {
    setLoading(true);

    setError(null);

    try {
      const response = await leadsService.importLeads(data);

      if (response.success) {
        return (response as any).data as any;
      } else {
        setError(response.error || 'Erro na importação dos leads');

        return null;
      } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      setError(errorMessage);

      return null;
    } finally {
      setLoading(false);

    } , []);

  const exportLeads = useCallback(async (filters: LeadFilters | Record<string, any>, format: 'csv' | 'xlsx' | 'json') => {
    setLoading(true);

    setError(null);

    try {
      const response = await leadsService.exportLeads(filters, format);

      if (response.success) {
        return (response as any).data as any;
      } else {
        setError(response.error || 'Erro na exportação dos leads');

        return null;
      } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      setError(errorMessage);

      return null;
    } finally {
      setLoading(false);

    } , []);

  return {
    importTemplate,
    exportTemplate,
    validation,
    loading,
    error,
    getImportTemplate,
    getExportTemplate,
    validateImportData,
    importLeads,
    exportLeads};
};
