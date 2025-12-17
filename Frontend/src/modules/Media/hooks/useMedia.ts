import { useCallback } from 'react';
import { useMediaStore } from '../store/mediaStore';
import * as mediaApi from '../services/mediaApi';

export const useMedia = () => {
  const store = useMediaStore();

  const loadLibrary = useCallback(async () => {
    store.setLoading(true);

    try {
      const { data } = await mediaApi.getLibrary();

      store.setLibrary(data.data.files, (data as any).data.folders, (data as any).data.stats);

      store.setError(null);

    } catch (error: unknown) {
      store.setError(error.message);

    } finally {
      store.setLoading(false);

    } , [store]);

  const uploadMedia = useCallback(async (file: File, folderId?: string, altText?: string, tags?: string[]) => {
    store.setLoading(true);

    try {
      const { data } = await mediaApi.uploadFile(file, folderId, altText, tags);

      store.addMedia(data.data);

      store.setError(null);

      return (data as any).data;
    } catch (error: unknown) {
      store.setError(error.message);

      throw error;
    } finally {
      store.setLoading(false);

    } , [store]);

  const deleteMedia = useCallback(async (id: string) => {
    store.setLoading(true);

    try {
      await mediaApi.deleteMedia(id);

      store.removeMedia(id);

      store.setError(null);

    } catch (error: unknown) {
      store.setError(error.message);

      throw error;
    } finally {
      store.setLoading(false);

    } , [store]);

  const createFolder = useCallback(async (name: string, parentId?: string) => {
    store.setLoading(true);

    try {
      const { data } = await mediaApi.createFolder({ name, parent_id: parentId });

      store.addFolder(data.data);

      store.setError(null);

      return (data as any).data;
    } catch (error: unknown) {
      store.setError(error.message);

      throw error;
    } finally {
      store.setLoading(false);

    } , [store]);

  return {
    ...store,
    loadLibrary,
    uploadMedia,
    deleteMedia,
    createFolder,};
};

export default useMedia;
