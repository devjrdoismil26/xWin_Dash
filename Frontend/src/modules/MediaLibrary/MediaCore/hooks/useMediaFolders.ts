import { useState, useCallback } from 'react';
import { getErrorMessage } from '@/utils/errorHelpers';
import { fetchFolders, createFolder, updateFolder, deleteFolder } from '../services/mediaCoreService';
import type { MediaFolder } from '@/types/core.types';

export const useMediaFolders = () => {
  const [folders, setFolders] = useState<MediaFolder[]>([]);

  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const getFolders = useCallback(async () => {
    setLoading(true);

    setError(null);

    try {
      const result = await fetchFolders();

      if (result.success && result.data) setFolders(result.data);

    } catch (err) {
      setError(getErrorMessage(err));

    } finally {
      setLoading(false);

    } , []);

  const create = useCallback(async (name: string, parentId?: string): Promise<MediaFolder | null> => {
    setLoading(true);

    setError(null);

    try {
      const result = await createFolder(name, parentId);

      if (result.success && result.data) {
        setFolders(prev => [...prev, result.data!]);

        return result.data;
      }
      return null;
    } catch (err) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  const update = useCallback(async (id: string, data: unknown): Promise<MediaFolder | null> => {
    setLoading(true);

    setError(null);

    try {
      const result = await updateFolder(id, data);

      if (result.success && result.data) {
        setFolders(prev => prev.map(f => f.id === id ? result.data! : f));

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
      const result = await deleteFolder(id);

      if (result.success) {
        setFolders(prev => prev.filter(f => f.id !== id));

        return true;
      }
      return false;
    } catch (err) {
      setError(getErrorMessage(err));

      return false;
    } finally {
      setLoading(false);

    } , []);

  return { folders, currentFolder, setCurrentFolder, loading, error, getFolders, create, update, remove};
};
