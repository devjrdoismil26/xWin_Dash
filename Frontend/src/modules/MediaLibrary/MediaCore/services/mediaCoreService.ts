import { getErrorMessage } from '@/utils/errorHelpers';
import { apiClient } from '@/services';
import { MediaFile, MediaFolder, MediaApiResponse, MediaSearchFilters, MediaSearchResult } from '../types';

const API_BASE = '/api/media/api';

export const fetchMedia = async (filters: MediaSearchFilters = {}): Promise<MediaApiResponse<MediaFile[]>> => {
  try {
    const response = await apiClient.get(`${API_BASE}/media`, { params: filters });

    return { success: true, data: (response as any).data.data?.data || (response as any).data.data || []};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const fetchMediaById = async (mediaId: string): Promise<MediaApiResponse<MediaFile>> => {
  try {
    const response = await apiClient.get(`${API_BASE}/media/${mediaId}`);

    return { success: true, data: (response as any).data.data};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const createMedia = async (formData: FormData): Promise<MediaApiResponse<MediaFile>> => {
  try {
    const response = await apiClient.post(`${API_BASE}/media`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' } );

    return { success: true, data: (response as any).data.data};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const updateMedia = async (mediaId: string, data: Partial<MediaFile>): Promise<MediaApiResponse<MediaFile>> => {
  try {
    const response = await apiClient.put(`${API_BASE}/media/${mediaId}`, data);

    return { success: true, data: (response as any).data.data};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const deleteMedia = async (mediaId: string): Promise<MediaApiResponse<void>> => {
  try {
    await apiClient.delete(`${API_BASE}/media/${mediaId}`);

    return { success: true, data: undefined};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const bulkDeleteMedia = async (mediaIds: string[]): Promise<MediaApiResponse<void>> => {
  try {
    await apiClient.post(`${API_BASE}/media/bulk-delete`, { media_ids: mediaIds });

    return { success: true, data: undefined};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const searchMedia = async (query: string, filters?: MediaSearchFilters): Promise<MediaApiResponse<MediaSearchResult>> => {
  try {
    const response = await apiClient.get(`${API_BASE}/media`, { 
      params: { ...filters, search: query } );

    return { success: true, data: { results: (response as any).data.data?.data || [], total: (response as any).data.data?.total || 0 } ;

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const getMediaByType = async (type: string): Promise<MediaApiResponse<MediaFile[]>> => {
  try {
    const response = await apiClient.get(`${API_BASE}/media`, { params: { type } );

    return { success: true, data: (response as any).data.data?.data || []};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const fetchFolders = async (): Promise<MediaApiResponse<MediaFolder[]>> => {
  try {
    const response = await apiClient.get(`${API_BASE}/folders`);

    return { success: true, data: (response as any).data.data || []};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const createFolder = async (data: Partial<MediaFolder>): Promise<MediaApiResponse<MediaFolder>> => {
  try {
    const response = await apiClient.post(`${API_BASE}/folders`, data);

    return { success: true, data: (response as any).data.data};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const updateFolder = async (folderId: string, data: Partial<MediaFolder>): Promise<MediaApiResponse<MediaFolder>> => {
  try {
    const response = await apiClient.put(`${API_BASE}/folders/${folderId}`, data);

    return { success: true, data: (response as any).data.data};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const deleteFolder = async (folderId: string): Promise<MediaApiResponse<void>> => {
  try {
    await apiClient.delete(`${API_BASE}/folders/${folderId}`);

    return { success: true, data: undefined};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const moveMedia = async (mediaId: string, folderId: string): Promise<MediaApiResponse<void>> => {
  try {
    await apiClient.post(`${API_BASE}/folders/move`, { media_id: mediaId, folder_id: folderId });

    return { success: true, data: undefined};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;
