import { getErrorMessage } from '@/utils/errorHelpers';
import { apiClient } from '@/services';
import { MediaApiResponse } from '../types';

const API_BASE = '/api/media/api';

export const batchOptimizeMedia = async (mediaIds: string[], quality?: number): Promise<MediaApiResponse<void>> => {
  try {
    await Promise.all(
      mediaIds.map(id => apiClient.post(`${API_BASE}/media/optimize`, { 
        media_id: id, 
        quality: quality || 85 
      })));

    return { success: true, data: undefined};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const batchMoveMedia = async (mediaIds: string[], folderId: string): Promise<MediaApiResponse<void>> => {
  try {
    await Promise.all(
      mediaIds.map(id => apiClient.post(`${API_BASE}/folders/move`, { 
        media_id: id, 
        folder_id: folderId 
      })));

    return { success: true, data: undefined};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const batchDeleteMedia = async (mediaIds: string[]): Promise<MediaApiResponse<void>> => {
  try {
    await apiClient.post(`${API_BASE}/media/bulk-delete`, { media_ids: mediaIds });

    return { success: true, data: undefined};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const optimizeMedia = async (mediaId: string, quality: number = 85, format?: string): Promise<MediaApiResponse<void>> => {
  try {
    await apiClient.post(`${API_BASE}/media/optimize`, { 
      media_id: mediaId, 
      quality,
      format 
    });

    return { success: true, data: undefined};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const duplicateMedia = async (mediaId: string): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.get(`${API_BASE}/media/${mediaId}`);

    const media = (response as any).data.data;
    const duplicated = await apiClient.post(`${API_BASE}/media`, {
      ...media,
      name: `${media.name} (copy)`
    });

    return { success: true, data: duplicated.data.data};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const archiveMedia = async (mediaId: string): Promise<MediaApiResponse<void>> => {
  try {
    await apiClient.delete(`${API_BASE}/media/${mediaId}`);

    return { success: true, data: undefined};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const restoreMedia = async (mediaId: string): Promise<MediaApiResponse<void>> => {
  try {
    return { success: true, data: undefined};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

// Utility functions
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];};

export const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);

  const m = Math.floor((seconds % 3600) / 60);

  const s = Math.floor(seconds % 60);

  return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;};

export const getFileTypeFromMime = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.includes('pdf')) return 'pdf';
  return 'document';};

export const getFileIcon = (mimeType: string): string => {
  const type = getFileTypeFromMime(mimeType);

  const icons: Record<string, string> = {
    image: '🖼️',
    video: '🎥',
    audio: '🎵',
    pdf: '📄',
    document: '📝'};

  return icons[type] || '📎';};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.some(type => file.type.includes(type));};

export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  return file.size <= maxSizeMB * 1024 * 1024;};

export const generateThumbnailUrl = (mediaId: string): string => {
  return `${API_BASE}/media/${mediaId}/thumbnail`;};

export const generatePreviewUrl = (mediaId: string): string => {
  return `${API_BASE}/media/${mediaId}/preview`;};

export const generateDownloadUrl = (mediaId: string): string => {
  return `${API_BASE}/media/${mediaId}/download`;};

// Versions
export const fetchMediaVersions = async (mediaId: string): Promise<MediaApiResponse<unknown[]>> => {
  try {
    const response = await apiClient.get(`${API_BASE}/media/${mediaId}/versions`);

    return { success: true, data: response.data.data || []};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const createMediaVersion = async (mediaId: string, file: File): Promise<MediaApiResponse<any>> => {
  try {
    const formData = new FormData();

    formData.append('file', file);

    const response = await apiClient.post(`${API_BASE}/media/${mediaId}/versions`, formData);

    return { success: true, data: response.data.data};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const deleteMediaVersion = async (mediaId: string, versionId: string): Promise<MediaApiResponse<void>> => {
  try {
    await apiClient.delete(`${API_BASE}/media/${mediaId}/versions/${versionId}`);

    return { success: true, data: undefined};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const restoreMediaVersion = async (mediaId: string, versionId: string): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.post(`${API_BASE}/media/${mediaId}/versions/${versionId}/restore`);

    return { success: true, data: response.data.data};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

// Comments
export const fetchMediaComments = async (mediaId: string): Promise<MediaApiResponse<unknown[]>> => {
  try {
    const response = await apiClient.get(`${API_BASE}/media/${mediaId}/comments`);

    return { success: true, data: response.data.data || []};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const createMediaComment = async (mediaId: string, content: string): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.post(`${API_BASE}/media/${mediaId}/comments`, { content });

    return { success: true, data: response.data.data};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const updateMediaComment = async (mediaId: string, commentId: string, content: string): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.put(`${API_BASE}/media/${mediaId}/comments/${commentId}`, { content });

    return { success: true, data: response.data.data};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const deleteMediaComment = async (mediaId: string, commentId: string): Promise<MediaApiResponse<void>> => {
  try {
    await apiClient.delete(`${API_BASE}/media/${mediaId}/comments/${commentId}`);

    return { success: true, data: undefined};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

// Shares
export const fetchMediaShares = async (mediaId: string): Promise<MediaApiResponse<unknown[]>> => {
  try {
    const response = await apiClient.get(`${API_BASE}/media/${mediaId}/shares`);

    return { success: true, data: response.data.data || []};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const shareMedia = async (mediaId: string, data: unknown): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.post(`${API_BASE}/media/${mediaId}/shares`, data);

    return { success: true, data: response.data.data};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const updateMediaShare = async (mediaId: string, shareId: string, data: unknown): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.put(`${API_BASE}/media/${mediaId}/shares/${shareId}`, data);

    return { success: true, data: response.data.data};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const deleteMediaShare = async (mediaId: string, shareId: string): Promise<MediaApiResponse<void>> => {
  try {
    await apiClient.delete(`${API_BASE}/media/${mediaId}/shares/${shareId}`);

    return { success: true, data: undefined};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const batchOptimize = async (mediaIds: string[]): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.post(`${API_BASE}/media/batch-optimize`, { media_ids: mediaIds });

    return { success: true, data: response.data.data};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;
