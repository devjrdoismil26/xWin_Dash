import { useState, useCallback } from 'react';
import { useApiState } from './shared/useApiState';
import { landingPagesApi } from '../services/productsApiService';
import type { LandingPage, LandingPagesFilter } from '../types';

export const useLandingPages = () => {
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);

  const currentPage = useApiState<LandingPage>();

  const { loading, error, execute } = useApiState();

  const getAll = useCallback((filters?: LandingPagesFilter) => 
    execute(() => landingPagesApi.getAll(filters), setLandingPages), [execute]);

  const getById = useCallback((id: string) => 
    currentPage.execute(() => landingPagesApi.getById(id)), [currentPage]);

  const getBySlug = useCallback((slug: string) => 
    currentPage.execute(() => landingPagesApi.getBySlug(slug)), [currentPage]);

  const create = useCallback((data: unknown) => 
    execute(() => landingPagesApi.create(data), (newPage: unknown) => setLandingPages(prev => [...prev, newPage])), [execute]);

  const update = useCallback((id: string, data: unknown) => 
    execute(() => landingPagesApi.update(id, data), (updated: unknown) => setLandingPages(prev => prev.map(p => p.id === id ? updated : p))), [execute]);

  const remove = useCallback((id: string) => 
    execute(() => landingPagesApi.delete(id), () => setLandingPages(prev => prev.filter(p => p.id !== id))), [execute]);

  const publish = useCallback((id: string) => 
    execute(() => landingPagesApi.publish(id)), [execute]);

  const unpublish = useCallback((id: string) => 
    execute(() => landingPagesApi.unpublish(id)), [execute]);

  return {
    landingPages,
    currentPage: currentPage.data,
    loading: loading || currentPage.loading,
    error: error || currentPage.error,
    getAll,
    getById,
    getBySlug,
    create,
    update,
    remove,
    publish,
    unpublish};
};
