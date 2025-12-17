import { getErrorMessage } from '@/utils/errorHelpers';
import { apiClient } from '@/services';
import { MediaApiResponse } from '../types';

const API_BASE = '/api/media/api';

export const getMediaStats = async (filters?: string): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.get(`${API_BASE}/library`);

    return { success: true, data: (response as any).data.data?.stats || {} ;

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const getStorageStats = async (): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.get(`${API_BASE}/library`);

    const stats = (response as any).data.data?.stats || {};

    return { 
      success: true, 
      data: {
        total_size: stats.total_size || 0,
        storage_used_percentage: stats.storage_used_percentage || 0,
        total_files: stats.total_files || 0
      } ;

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const getPerformanceStats = async (filters?: string): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.get(`${API_BASE}/library`);

    const stats = (response as any).data.data?.stats || {};

    return { 
      success: true, 
      data: {
        recent_uploads: stats.recent_uploads || 0,
        total_files: stats.total_files || 0
      } ;

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const getEngagementStats = async (filters?: string): Promise<MediaApiResponse<any>> => {
  try {
    return { success: true, data: { views: 0, downloads: 0, shares: 0 } ;

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const getHealthStats = async (filters?: string): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.get(`${API_BASE}/library`);

    return { success: true, data: { status: 'healthy', issues: [] } ;

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const getAttributionStats = async (filters?: string): Promise<MediaApiResponse<any>> => {
  try {
    return { success: true, data: { sources: [] } ;

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const getSourceStats = async (filters?: string): Promise<MediaApiResponse<any>> => {
  try {
    return { success: true, data: { sources: [] } ;

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const getROIStats = async (filters?: string): Promise<MediaApiResponse<any>> => {
  try {
    return { success: true, data: { roi: 0 } ;

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const getCostAnalysis = async (filters?: string): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.get(`${API_BASE}/library`);

    const stats = (response as any).data.data?.stats || {};

    return { 
      success: true, 
      data: {
        total_cost: 0,
        storage_cost: stats.total_size || 0
      } ;

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const getMediaStatsByPeriod = async (period: string): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.get(`${API_BASE}/library/stats`, { params: { period } );

    return { success: true, data: response.data.data || {} ;

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const getMediaTrends = async (filters?: string): Promise<MediaApiResponse<unknown[]>> => {
  try {
    const response = await apiClient.get(`${API_BASE}/library/trends`, { params: filters });

    return { success: true, data: response.data.data || []};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const getUploadStats = async (filters?: string): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.get(`${API_BASE}/library/upload-stats`, { params: filters });

    return { success: true, data: response.data.data || {} ;

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const getDownloadStats = async (filters?: string): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.get(`${API_BASE}/library/download-stats`, { params: filters });

    return { success: true, data: response.data.data || {} ;

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const getMediaROI = async (filters?: string): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.get(`${API_BASE}/library/roi`, { params: filters });

    return { success: true, data: response.data.data || {} ;

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const getMediaForecasting = async (filters?: string): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.get(`${API_BASE}/library/forecasting`, { params: filters });

    return { success: true, data: response.data.data || {} ;

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;
