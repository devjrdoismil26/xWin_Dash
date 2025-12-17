// ========================================
// LEADS SEGMENTS HOOK
// ========================================
// Hook especializado para gerenciamento de segmentos de leads
// Máximo: 200 linhas

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import leadsSegmentsService from '../services/leadsSegmentsService';
import { LeadSegment, LeadSegmentRule } from '../types';
import { getErrorMessage } from '@/utils/errorHelpers';

interface UseLeadsSegmentsState {
  segments: LeadSegment[];
  currentSegment: LeadSegment | null;
  loading: boolean;
  error: string | null; }

interface UseLeadsSegmentsActions {
  createSegment: (data: Partial<LeadSegment>) => Promise<LeadSegment | null>;
  updateSegment: (id: number, data: Partial<LeadSegment>) => Promise<LeadSegment | null>;
  deleteSegment: (id: number) => Promise<boolean>;
  getSegment: (id: number) => Promise<LeadSegment | null>;
  fetchSegments: () => Promise<void>;
  refreshSegments: () => Promise<void>;
  setCurrentSegment?: (e: any) => void;
  clearError??: (e: any) => void;
  reset??: (e: any) => void; }

export const useLeadsSegments = (): UseLeadsSegmentsState & UseLeadsSegmentsActions => {
  const [state, setState] = useState<UseLeadsSegmentsState>({
    segments: [],
    currentSegment: null,
    loading: false,
    error: null
  });

  // Actions
  const createSegment = useCallback(async (data: Partial<LeadSegment>): Promise<LeadSegment | null> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const result = await leadsSegmentsService.createSegment(data);

      if (result.success && result.data) {
        setState(prev => ({
          ...prev,
          segments: [...prev.segments, result.data!],
          loading: false
        }));

        toast.success('Segmento criado com sucesso!');

        return result.data;
      } else {
        throw new Error(result.message || 'Erro ao criar segmento');

      } catch (error) {
      const errorMessage = getErrorMessage(error);

      setState(prev => ({ ...prev, loading: false, error: errorMessage }));

      toast.error(errorMessage);

      return null;
    } , []);

  const updateSegment = useCallback(async (id: number, data: Partial<LeadSegment>): Promise<LeadSegment | null> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const result = await leadsSegmentsService.updateSegment(id, data);

      if (result.success && result.data) {
        setState(prev => ({
          ...prev,
          segments: prev.segments.map(segment => 
            segment.id === id ? result.data! : segment
          ),
          currentSegment: prev.currentSegment?.id === id ? result.data! : prev.currentSegment,
          loading: false
        }));

        toast.success('Segmento atualizado com sucesso!');

        return result.data;
      } else {
        throw new Error(result.message || 'Erro ao atualizar segmento');

      } catch (error) {
      const errorMessage = getErrorMessage(error);

      setState(prev => ({ ...prev, loading: false, error: errorMessage }));

      toast.error(errorMessage);

      return null;
    } , []);

  const deleteSegment = useCallback(async (id: number): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const result = await leadsSegmentsService.deleteSegment(id);

      if (result.success) {
        setState(prev => ({
          ...prev,
          segments: prev.segments.filter(segment => segment.id !== id),
          currentSegment: prev.currentSegment?.id === id ? null : prev.currentSegment,
          loading: false
        }));

        toast.success('Segmento excluído com sucesso!');

        return true;
      } else {
        throw new Error(result.message || 'Erro ao excluir segmento');

      } catch (error) {
      const errorMessage = getErrorMessage(error);

      setState(prev => ({ ...prev, loading: false, error: errorMessage }));

      toast.error(errorMessage);

      return false;
    } , []);

  const getSegment = useCallback(async (id: number): Promise<LeadSegment | null> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const result = await leadsSegmentsService.getSegment(id);

      if (result.success && result.data) {
        setState(prev => ({ ...prev, loading: false }));

        return result.data;
      } else {
        throw new Error(result.message || 'Erro ao buscar segmento');

      } catch (error) {
      const errorMessage = getErrorMessage(error);

      setState(prev => ({ ...prev, loading: false, error: errorMessage }));

      toast.error(errorMessage);

      return null;
    } , []);

  const fetchSegments = useCallback(async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const result = await leadsSegmentsService.fetchSegments();

      if (result.success && result.data) {
        setState(prev => ({
          ...prev,
          segments: result.data!,
          loading: false
        }));

      } else {
        throw new Error(result.message || 'Erro ao buscar segmentos');

      } catch (error) {
      const errorMessage = getErrorMessage(error);

      setState(prev => ({ ...prev, loading: false, error: errorMessage }));

      toast.error(errorMessage);

    } , []);

  const refreshSegments = useCallback(async (): Promise<void> => {
    await fetchSegments();

  }, [fetchSegments]);

  const setCurrentSegment = useCallback((segment: LeadSegment | null) => {
    setState(prev => ({ ...prev, currentSegment: segment }));

  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));

  }, []);

  const reset = useCallback(() => {
    setState({
      segments: [],
      currentSegment: null,
      loading: false,
      error: null
    });

  }, []);

  // Initialize data on mount
  useEffect(() => {
    fetchSegments();

  }, [fetchSegments]);

  return {
    ...state,
    createSegment,
    updateSegment,
    deleteSegment,
    getSegment,
    fetchSegments,
    refreshSegments,
    setCurrentSegment,
    clearError,
    reset};
};

export default useLeadsSegments;
