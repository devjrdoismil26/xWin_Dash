import { useState, useCallback } from 'react';
import { getErrorMessage } from '@/utils/errorHelpers';
import { searchMedia, getMediaByType, getMediaByFolder } from '../services/mediaCoreService';
import type { MediaFile } from '@/types/core.types';
import type { MediaSearchFilters, MediaSearchResult } from '@/types/search.types';

export const useMediaSearch = () => {
  const [searchResults, setSearchResults] = useState<MediaSearchResult | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, filters?: MediaSearchFilters): Promise<MediaSearchResult | null> => {
    setLoading(true);

    setError(null);

    try {
      const result = await searchMedia(query, filters);

      if (result.success && result.data) {
        setSearchResults(result.data);

        return result.data;
      }
      return null;
    } catch (err) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  const getByType = useCallback(async (type: string, filters?: MediaSearchFilters): Promise<MediaFile[] | null> => {
    setLoading(true);

    setError(null);

    try {
      const result = await getMediaByType(type, filters);

      return result.success && result.data ? result.data : null;
    } catch (err) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  const getByFolder = useCallback(async (folderId: string, filters?: MediaSearchFilters): Promise<MediaFile[] | null> => {
    setLoading(true);

    setError(null);

    try {
      const result = await getMediaByFolder(folderId, filters);

      return result.success && result.data ? result.data : null;
    } catch (err) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  return { searchResults, loading, error, search, getByType, getByFolder};
};
