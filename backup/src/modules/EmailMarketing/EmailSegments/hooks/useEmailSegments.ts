/**
 * Hook para o módulo EmailSegments
 * Gerencia segmentação de público
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  EmailSegment, 
  SegmentField,
  SegmentFilters, 
  SegmentResponse,
  SegmentAnalytics,
  SegmentPreviewResponse,
  UseEmailSegmentsReturn 
} from '../types';

export const useEmailSegments = (): UseEmailSegmentsReturn => {
  // Estado principal
  const [segments, setSegments] = useState<EmailSegment[]>([]);
  const [fields, setFields] = useState<SegmentField[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar segmentos
  const fetchSegments = useCallback(async (filters?: SegmentFilters) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(v => queryParams.append(`${key}[]`, String(v)));
            } else {
              queryParams.append(key, String(value));
            }
          }
        });
      }

      const response = await fetch(`/api/v1/email-segments?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        setSegments(Array.isArray(result.data) ? result.data : [result.data]);
      } else {
        throw new Error(result.error || 'Failed to fetch segments');
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching segments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para buscar campos disponíveis
  const fetchFields = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/email-segments/fields', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        setFields(Array.isArray(result.data) ? result.data : [result.data]);
      } else {
        throw new Error(result.error || 'Failed to fetch fields');
      }
    } catch (err: any) {
      console.error('Error fetching segment fields:', err);
    }
  }, []);

  // Função para criar segmento
  const createSegment = useCallback(async (segmentData: Partial<EmailSegment>): Promise<SegmentResponse> => {
    try {
      const response = await fetch('/api/v1/email-segments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(segmentData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        await fetchSegments();
      }
      
      return result;
    } catch (err: any) {
      console.error('Error creating segment:', err);
      return {
        success: false,
        error: err.message
      };
    }
  }, [fetchSegments]);

  // Função para atualizar segmento
  const updateSegment = useCallback(async (id: string, segmentData: Partial<EmailSegment>): Promise<SegmentResponse> => {
    try {
      const response = await fetch(`/api/v1/email-segments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(segmentData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        await fetchSegments();
      }
      
      return result;
    } catch (err: any) {
      console.error('Error updating segment:', err);
      return {
        success: false,
        error: err.message
      };
    }
  }, [fetchSegments]);

  // Função para deletar segmento
  const deleteSegment = useCallback(async (id: string): Promise<SegmentResponse> => {
    try {
      const response = await fetch(`/api/v1/email-segments/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        await fetchSegments();
      }
      
      return result;
    } catch (err: any) {
      console.error('Error deleting segment:', err);
      return {
        success: false,
        error: err.message
      };
    }
  }, [fetchSegments]);

  // Função para duplicar segmento
  const duplicateSegment = useCallback(async (id: string): Promise<SegmentResponse> => {
    try {
      const response = await fetch(`/api/v1/email-segments/${id}/duplicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        await fetchSegments();
      }
      
      return result;
    } catch (err: any) {
      console.error('Error duplicating segment:', err);
      return {
        success: false,
        error: err.message
      };
    }
  }, [fetchSegments]);

  // Função para calcular segmento
  const calculateSegment = useCallback(async (id: string): Promise<SegmentResponse> => {
    try {
      const response = await fetch(`/api/v1/email-segments/${id}/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        await fetchSegments();
      }
      
      return result;
    } catch (err: any) {
      console.error('Error calculating segment:', err);
      return {
        success: false,
        error: err.message
      };
    }
  }, [fetchSegments]);

  // Função para obter analytics do segmento
  const getSegmentAnalytics = useCallback(async (id: string): Promise<SegmentAnalytics> => {
    try {
      const response = await fetch(`/api/v1/email-segments/${id}/analytics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to fetch segment analytics');
      }
    } catch (err: any) {
      console.error('Error fetching segment analytics:', err);
      throw err;
    }
  }, []);

  // Função para obter segmento por ID
  const getSegmentById = useCallback((id: string): EmailSegment | undefined => {
    return segments.find(segment => segment.id === id);
  }, [segments]);

  // Função para obter segmentos ativos
  const getActiveSegments = useCallback((): EmailSegment[] => {
    return segments.filter(segment => segment.is_active);
  }, [segments]);

  // Função para obter segmentos dinâmicos
  const getDynamicSegments = useCallback((): EmailSegment[] => {
    return segments.filter(segment => segment.is_dynamic);
  }, [segments]);

  // Função para formatar métricas do segmento
  const formatSegmentMetrics = useCallback((metrics: any) => {
    return {
      total_subscribers: new Intl.NumberFormat('pt-BR').format(metrics.total_subscribers || 0),
      active_subscribers: new Intl.NumberFormat('pt-BR').format(metrics.active_subscribers || 0),
      new_subscribers: new Intl.NumberFormat('pt-BR').format(metrics.new_subscribers || 0),
      engagement_rate: `${(metrics.engagement_rate || 0).toFixed(1)}%`,
      conversion_rate: `${(metrics.conversion_rate || 0).toFixed(1)}%`,
      revenue_generated: new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      }).format(metrics.revenue_generated || 0)
    };
  }, []);

  // Função para validar segmento
  const validateSegment = useCallback((segment: EmailSegment): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!segment.name || segment.name.trim().length === 0) {
      errors.push('Nome do segmento é obrigatório');
    }

    if (!segment.criteria || segment.criteria.length === 0) {
      errors.push('Pelo menos um critério deve ser definido');
    }

    if (segment.criteria && segment.criteria.length > 0) {
      segment.criteria.forEach((criteria, index) => {
        if (!criteria.field || criteria.field.trim().length === 0) {
          errors.push(`Critério ${index + 1}: campo é obrigatório`);
        }
        if (!criteria.operator) {
          errors.push(`Critério ${index + 1}: operador é obrigatório`);
        }
        if (criteria.value === undefined || criteria.value === null || criteria.value === '') {
          errors.push(`Critério ${index + 1}: valor é obrigatório`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  // Carregar dados iniciais
  useEffect(() => {
    fetchSegments();
    fetchFields();
  }, [fetchSegments, fetchFields]);

  return {
    segments,
    fields,
    loading,
    error,
    fetchSegments,
    fetchFields,
    createSegment,
    updateSegment,
    deleteSegment,
    duplicateSegment,
    calculateSegment,
    getSegmentAnalytics,
    getSegmentById,
    getActiveSegments,
    getDynamicSegments,
    formatSegmentMetrics,
    validateSegment
  };
};
