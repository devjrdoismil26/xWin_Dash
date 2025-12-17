import axios from 'axios';

const api = axios.create({
  baseURL: '/api/media/api',
});

// Media endpoints
export const getLibrary = async () => {
  const response = await api.get('/library');

  return (response as any).data as any;};

export const getMedia = async (params?: string) => {
  const response = await api.get('/media', { params });

  return (response as any).data as any;};

export const getMediaById = async (id: string) => {
  const response = await api.get(`/media/${id}`);

  return (response as any).data as any;};

export const deleteMedia = async (id: string) => {
  const response = await api.delete(`/media/${id}`);

  return (response as any).data as any;};

export const updateMedia = async (id: string, data: unknown) => {
  const response = await api.put(`/media/${id}`, data);

  return (response as any).data as any;};

export const optimizeMedia = async (data: unknown) => {
  const response = await api.post('/media/optimize', data);

  return (response as any).data as any;};

export const bulkDeleteMedia = async (media_ids: string[]) => {
  const response = await api.post('/media/bulk-delete', { media_ids });

  return (response as any).data as any;};

export const uploadFile = async (file: File, folderId?: string, altText?: string, tags?: string[]) => {
  const formData = new FormData();

  formData.append('file', file);

  if (folderId) formData.append('folder_id', folderId);

  if (altText) formData.append('alt_text', altText);

  if (tags) formData.append('tags', JSON.stringify(tags));

  const response = await api.post('/media', formData, {
    headers: { 'Content-Type': 'multipart/form-data' } );

  return (response as any).data as any;};

// Folder endpoints
export const getFolders = async () => {
  const response = await api.get('/folders');

  return (response as any).data as any;};

export const createFolder = async (data: unknown) => {
  const response = await api.post('/folders', data);

  return (response as any).data as any;};

export const updateFolder = async (id: string, data: unknown) => {
  const response = await api.put(`/folders/${id}`, data);

  return (response as any).data as any;};

export const deleteFolder = async (id: string) => {
  const response = await api.delete(`/folders/${id}`);

  return (response as any).data as any;};

export const moveMedia = async (media_id: string, folder_id: string) => {
  const response = await api.post('/folders/move', { media_id, folder_id });

  return (response as any).data as any;};
