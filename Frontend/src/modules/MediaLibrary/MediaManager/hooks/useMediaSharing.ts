import { useState, useCallback } from 'react';
import { getErrorMessage } from '@/utils/errorHelpers';
import { shareMedia, fetchMediaShares, updateMediaShare, deleteMediaShare } from '../services/mediaManagerService';
import type { MediaShare } from '@/types/collaboration.types';

export const useMediaSharing = () => {
  const [shares, setShares] = useState<MediaShare[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const getShares = useCallback(async (mediaId: string): Promise<MediaShare[] | null> => {
    setLoading(true);

    setError(null);

    try {
      const result = await fetchMediaShares(mediaId);

      if (result.success && result.data) {
        setShares(result.data);

        return result.data;
      }
      return null;
    } catch (err) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  const share = useCallback(async (mediaId: string, shareData: unknown): Promise<MediaShare | null> => {
    setLoading(true);

    setError(null);

    try {
      const result = await shareMedia(mediaId, shareData);

      if (result.success && result.data) {
        setShares(prev => [...prev, result.data!]);

        return result.data;
      }
      return null;
    } catch (err) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  const updateShare = useCallback(async (shareId: string, shareData: unknown): Promise<MediaShare | null> => {
    setLoading(true);

    setError(null);

    try {
      const result = await updateMediaShare(shareId, shareData);

      if (result.success && result.data) {
        setShares(prev => prev.map(s => s.id === shareId ? result.data! : s));

        return result.data;
      }
      return null;
    } catch (err) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  const deleteShare = useCallback(async (shareId: string): Promise<boolean> => {
    setLoading(true);

    setError(null);

    try {
      const result = await deleteMediaShare(shareId);

      if (result.success) {
        setShares(prev => prev.filter(s => s.id !== shareId));

        return true;
      }
      return false;
    } catch (err) {
      setError(getErrorMessage(err));

      return false;
    } finally {
      setLoading(false);

    } , []);

  return { shares, loading, error, getShares, share, updateShare, deleteShare};
};
