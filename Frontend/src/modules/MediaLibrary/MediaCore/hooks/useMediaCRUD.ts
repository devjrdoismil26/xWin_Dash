import { useState, useCallback } from 'react';
import { getErrorMessage } from '@/utils/errorHelpers';
import { fetchMedia, fetchMediaById, createMedia, updateMedia, deleteMedia, bulkUpdateMedia, bulkDeleteMedia } from '../services/mediaCoreService';
import type { MediaFile } from '@/types/core.types';
import type { MediaSearchFilters } from '@/types/search.types';

export const useMediaCRUD = () => {
  const [media, setMedia] = useState<MediaFile[]>([]);

  const [currentMedia, setCurrentMedia] = useState<MediaFile | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const getMedia = useCallback(async (filters?: MediaSearchFilters) => {
    setLoading(true);

    setError(null);

    try {
      const result = await fetchMedia(filters);

      if (result.success && result.data) setMedia(result.data);

    } catch (err) {
      setError(getErrorMessage(err));

    } finally {
      setLoading(false);

    } , []);

  const getById = useCallback(async (id: string): Promise<MediaFile | null> => {
    setLoading(true);

    setError(null);

    try {
      const result = await fetchMediaById(id);

      if (result.success && result.data) {
        setCurrentMedia(result.data);

        return result.data;
      }
      return null;
    } catch (err) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  const create = useCallback(async (file: File, metadata?: string): Promise<MediaFile | null> => {
    setLoading(true);

    setError(null);

    try {
      const result = await createMedia(file, metadata);

      if (result.success && result.data) {
        setMedia(prev => [...prev, result.data!]);

        return result.data;
      }
      return null;
    } catch (err) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  const update = useCallback(async (id: string, data: unknown): Promise<MediaFile | null> => {
    setLoading(true);

    setError(null);

    try {
      const result = await updateMedia(id, data);

      if (result.success && result.data) {
        setMedia(prev => prev.map(m => m.id === id ? result.data! : m));

        return result.data;
      }
      return null;
    } catch (err) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  const remove = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);

    setError(null);

    try {
      const result = await deleteMedia(id);

      if (result.success) {
        setMedia(prev => prev.filter(m => m.id !== id));

        return true;
      }
      return false;
    } catch (err) {
      setError(getErrorMessage(err));

      return false;
    } finally {
      setLoading(false);

    } , []);

  const bulkUpdate = useCallback(async (ids: string[], updates: unknown): Promise<MediaFile[] | null> => {
    setLoading(true);

    setError(null);

    try {
      const result = await bulkUpdateMedia(ids, updates);

      if (result.success && result.data) {
        setMedia(prev => prev.map(m => ids.includes(m.id) ? result.data!.find(u => u.id === m.id) || m : m));

        return result.data;
      }
      return null;
    } catch (err) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  const bulkRemove = useCallback(async (ids: string[]): Promise<boolean> => {
    setLoading(true);

    setError(null);

    try {
      const result = await bulkDeleteMedia(ids);

      if (result.success) {
        setMedia(prev => prev.filter(m => !ids.includes(m.id)));

        return true;
      }
      return false;
    } catch (err) {
      setError(getErrorMessage(err));

      return false;
    } finally {
      setLoading(false);

    } , []);

  return { media, currentMedia, loading, error, getMedia, getById, create, update, remove, bulkUpdate, bulkRemove};
};
