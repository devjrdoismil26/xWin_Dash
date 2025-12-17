import { useState, useCallback } from 'react';
import { getErrorMessage } from '@/utils/errorHelpers';
import { createMediaVersion, fetchMediaVersions, restoreMediaVersion, deleteMediaVersion } from '../services/mediaManagerService';
import type { MediaVersion } from '@/types/collaboration.types';
import type { MediaFile } from '@/types/core.types';

export const useMediaVersions = () => {
  const [versions, setVersions] = useState<MediaVersion[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const getVersions = useCallback(async (mediaId: string): Promise<MediaVersion[] | null> => {
    setLoading(true);

    setError(null);

    try {
      const result = await fetchMediaVersions(mediaId);

      if (result.success && result.data) {
        setVersions(result.data);

        return result.data;
      }
      return null;
    } catch (err) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  const createVersion = useCallback(async (mediaId: string, file: File, changes: string): Promise<MediaVersion | null> => {
    setLoading(true);

    setError(null);

    try {
      const result = await createMediaVersion(mediaId, file, changes);

      if (result.success && result.data) {
        setVersions(prev => [...prev, result.data!]);

        return result.data;
      }
      return null;
    } catch (err) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  const restoreVersion = useCallback(async (versionId: string): Promise<MediaFile | null> => {
    setLoading(true);

    setError(null);

    try {
      const result = await restoreMediaVersion(versionId);

      return result.success && result.data ? result.data : null;
    } catch (err) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  const deleteVersion = useCallback(async (versionId: string): Promise<boolean> => {
    setLoading(true);

    setError(null);

    try {
      const result = await deleteMediaVersion(versionId);

      if (result.success) {
        setVersions(prev => prev.filter(v => v.id !== versionId));

        return true;
      }
      return false;
    } catch (err) {
      setError(getErrorMessage(err));

      return false;
    } finally {
      setLoading(false);

    } , []);

  return { versions, loading, error, getVersions, createVersion, restoreVersion, deleteVersion};
};
