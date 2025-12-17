import { getErrorMessage } from '@/utils/errorHelpers';
import { apiClient } from '@/services';
import { MediaApiResponse } from '../types';

const API_BASE = '/api/media/api';

export const generateAITags = async (mediaId: string): Promise<MediaApiResponse<string[]>> => {
  try {
    // Placeholder: AI features not implemented in backend yet
    return { success: true, data: []};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const generateAIDescription = async (mediaId: string): Promise<MediaApiResponse<string>> => {
  try {
    // Placeholder: AI features not implemented in backend yet
    return { success: true, data: ''};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const detectObjects = async (mediaId: string): Promise<MediaApiResponse<unknown[]>> => {
  try {
    // Placeholder: AI features not implemented in backend yet
    return { success: true, data: []};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const recognizeFaces = async (mediaId: string): Promise<MediaApiResponse<unknown[]>> => {
  try {
    // Placeholder: AI features not implemented in backend yet
    return { success: true, data: []};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const extractText = async (mediaId: string): Promise<MediaApiResponse<string>> => {
  try {
    // Placeholder: AI features not implemented in backend yet
    return { success: true, data: ''};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const categorizeMedia = async (mediaId: string): Promise<MediaApiResponse<string[]>> => {
  try {
    // Placeholder: AI features not implemented in backend yet
    return { success: true, data: []};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const findSimilarMedia = async (mediaId: string): Promise<MediaApiResponse<unknown[]>> => {
  try {
    const response = await apiClient.get(`${API_BASE}/media/${mediaId}`);

    const media = (response as any).data.data;
    const similar = await apiClient.get(`${API_BASE}/media`, { 
      params: { type: media.type } );

    return { success: true, data: similar.data.data?.data?.slice(0, 5) || []};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const enhanceImage = async (mediaId: string, options?: string): Promise<MediaApiResponse<any>> => {
  try {
    await apiClient.post(`${API_BASE}/media/optimize`, { 
      media_id: mediaId,
      quality: options?.quality || 85
    });

    return { success: true, data: {} ;

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

// Additional exports (aliases and new functions)
export const autoTagMedia = generateAITags;
export const batchAutoTag = async (mediaIds: string[]): Promise<MediaApiResponse<any>> => {
  try {
    const results = await Promise.all(mediaIds.map(id => generateAITags(id)));

    return { success: true, data: results};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const detectFaces = recognizeFaces;
export const classifyImage = categorizeMedia;
export const extractTextFromDocument = extractText;
export const analyzeColors = async (mediaId: string): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.get(`${API_BASE}/media/${mediaId}/colors`);

    return { success: true, data: response.data};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const extractColorPalette = analyzeColors;
export const searchByImage = findSimilarMedia;
export const getAIProcessingQueue = async (): Promise<MediaApiResponse<unknown[]>> => {
  try {
    const response = await apiClient.get(`${API_BASE}/media/ai-queue`);

    return { success: true, data: response.data.data || []};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;

export const getAIStatus = async (mediaId: string): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.get(`${API_BASE}/media/${mediaId}/ai-status`);

    return { success: true, data: response.data};

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error)};

  } ;
