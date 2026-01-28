// ========================================
// HOOK DE IMPORT/EXPORT DE LEADS
// ========================================
import { useState, useCallback } from 'react';
import { leadsService } from '../../services/leadsService';
import {
  LeadImportTemplate,
  LeadImportValidation,
  LeadExportTemplate
} from '../../types';

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
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getExportTemplate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await leadsService.getExportTemplate();
      if (response.success) {
        setExportTemplate(response.data as LeadExportTemplate);
      } else {
        setError(response.error || 'Erro ao carregar template de exportação');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const validateImportData = useCallback(async (data: any[]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await leadsService.validateImportData(data);
      if (response.success) {
        setValidation(response.data as LeadImportValidation);
      } else {
        setError(response.error || 'Erro na validação dos dados');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const importLeads = useCallback(async (data: any[]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await leadsService.importLeads(data);
      if (response.success) {
        return response.data;
      } else {
        setError(response.error || 'Erro na importação dos leads');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const exportLeads = useCallback(async (filters: any, format: 'csv' | 'xlsx' | 'json') => {
    setLoading(true);
    setError(null);
    try {
      const response = await leadsService.exportLeads(filters, format);
      if (response.success) {
        return response.data;
      } else {
        setError(response.error || 'Erro na exportação dos leads');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

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
    exportLeads
  };
};