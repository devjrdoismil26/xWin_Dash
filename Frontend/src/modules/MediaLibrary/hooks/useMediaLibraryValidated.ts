import { useState, useCallback } from 'react';
import { validatedApiClient } from '@/services';
import { MediaFileSchema, MediaFolderSchema, type MediaFile, type MediaFolder } from '@/schemas';
import { z } from 'zod';

export function useMediaLibraryValidated() {
  const [files, setFiles] = useState<MediaFile[]>([]);

  const [folders, setFolders] = useState<MediaFolder[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const fetchFiles = useCallback(async (folderId?: string | number) => {
    try {
      setLoading(true);

      setError(null);

      const params = folderId ? { folder_id: folderId } : {};

      const data = await validatedApiClient.get('/media/files', z.array(MediaFileSchema), { params });

      setFiles(data);

      return data;
    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const fetchFolders = useCallback(async () => {
    try {
      setLoading(true);

      const data = await validatedApiClient.get('/media/folders', z.array(MediaFolderSchema));

      setFolders(data);

      return data;
    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const uploadFile = useCallback(async (file: File, folderId?: string | number) => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append('file', file);

      if (folderId) formData.append('folder_id', String(folderId));

      const newFile = await validatedApiClient.post('/media/files', MediaFileSchema, formData);

      setFiles(prev => [...prev, newFile]);

      return newFile;
    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const deleteFile = useCallback(async (id: string | number) => {
    try {
      setLoading(true);

      await validatedApiClient.delete(`/media/files/${id}`);

      setFiles(prev => prev.filter(f => f.id !== id));

    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const createFolder = useCallback(async (name: string, parentId?: string | number) => {
    try {
      setLoading(true);

      const newFolder = await validatedApiClient.post('/media/folders', MediaFolderSchema, { name, parent_id: parentId });

      setFolders(prev => [...prev, newFolder]);

      return newFolder;
    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  return {
    files,
    folders,
    loading,
    error,
    fetchFiles,
    fetchFolders,
    uploadFile,
    deleteFile,
    createFolder};

}
