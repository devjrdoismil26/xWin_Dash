// =========================================
import { getErrorMessage } from '@/utils/errorHelpers';
// USE MEDIA AI - HOOK ESPECIALIZADO
// =========================================
// Hook para funcionalidades de IA em mídia
// Máximo: 200 linhas

import { useState, useCallback } from 'react';
import { MediaFile, MediaAI, MediaSimilarity, MediaAutoTag } from '../types';
import { autoTagMedia, batchAutoTag, detectFaces, recognizeFaces, detectObjects, classifyImage, extractText, extractTextFromDocument, analyzeColors, extractColorPalette, findSimilarMedia, searchByImage, getAIStatus, getAIProcessingQueue } from '../services/mediaAIService';

interface UseMediaAIReturn {
  // State
  aiStatus: MediaAI[];
  processingQueue: MediaAI[];
  similarMedia: MediaSimilarity | null;
  autoTags: MediaAutoTag | null;
  loading: boolean;
  error: string | null;
  // Auto Tag
  autoTag: (mediaId: string) => Promise<MediaAutoTag | null>;
  batchAutoTag: (mediaIds: string[]) => Promise<MediaAutoTag[] | null>;
  // Face Recognition
  detectFaces: (mediaId: string) => Promise<any>;
  recognizeFaces: (mediaId: string) => Promise<any>;
  // Object Detection
  detectObjects: (mediaId: string) => Promise<any>;
  classifyImage: (mediaId: string) => Promise<any>;
  // Text Extraction
  extractText: (mediaId: string) => Promise<any>;
  extractTextFromDocument: (mediaId: string) => Promise<any>;
  // Color Analysis
  analyzeColors: (mediaId: string) => Promise<any>;
  extractColorPalette: (mediaId: string) => Promise<any>;
  // Similarity Search
  findSimilar: (mediaId: string) => Promise<MediaSimilarity | null>;
  searchByImage: (file: File) => Promise<MediaFile[] | null>;
  // AI Status
  getAIStatus: (mediaId: string) => Promise<MediaAI[] | null>;
  getProcessingQueue: () => Promise<MediaAI[] | null>;
  // Utilities
  clearError??: (e: any) => void; }

export const useMediaAI = (): UseMediaAIReturn => {
  const [aiStatus, setAIStatus] = useState<MediaAI[]>([]);

  const [processingQueue, setProcessingQueue] = useState<MediaAI[]>([]);

  const [similarMedia, setSimilarMedia] = useState<MediaSimilarity | null>(null);

  const [autoTags, setAutoTags] = useState<MediaAutoTag | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // =========================================
  // AUTO TAG
  // =========================================

  const autoTag = useCallback(async (mediaId: string): Promise<MediaAutoTag | null> => {
    setLoading(true);

    setError(null);

    try {
      const result = await autoTagMedia(mediaId);

      if (result.success && result.data) {
        setAutoTags(result.data);

        return result.data;
      } else {
        setError(result.error || 'Erro ao aplicar tags automáticas');

        return null;
      } catch (err: unknown) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  const batchAutoTag = useCallback(async (mediaIds: string[]): Promise<MediaAutoTag[] | null> => {
    setLoading(true);

    setError(null);

    try {
      const result = await batchAutoTag(mediaIds);

      if (result.success && result.data) {
        return result.data;
      } else {
        setError(result.error || 'Erro ao aplicar tags automáticas em lote');

        return null;
      } catch (err: unknown) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  // =========================================
  // FACE RECOGNITION
  // =========================================

  const detectFaces = useCallback(async (mediaId: string): Promise<any> => {
    setLoading(true);

    setError(null);

    try {
      const result = await detectFaces(mediaId);

      if (result.success && result.data) {
        return result.data;
      } else {
        setError(result.error || 'Erro ao detectar rostos');

        return null;
      } catch (err: unknown) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  const recognizeFaces = useCallback(async (mediaId: string): Promise<any> => {
    setLoading(true);

    setError(null);

    try {
      const result = await recognizeFaces(mediaId);

      if (result.success && result.data) {
        return result.data;
      } else {
        setError(result.error || 'Erro ao reconhecer rostos');

        return null;
      } catch (err: unknown) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  // =========================================
  // OBJECT DETECTION
  // =========================================

  const detectObjects = useCallback(async (mediaId: string): Promise<any> => {
    setLoading(true);

    setError(null);

    try {
      const result = await detectObjects(mediaId);

      if (result.success && result.data) {
        return result.data;
      } else {
        setError(result.error || 'Erro ao detectar objetos');

        return null;
      } catch (err: unknown) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  const classifyImage = useCallback(async (mediaId: string): Promise<any> => {
    setLoading(true);

    setError(null);

    try {
      const result = await classifyImage(mediaId);

      if (result.success && result.data) {
        return result.data;
      } else {
        setError(result.error || 'Erro ao classificar imagem');

        return null;
      } catch (err: unknown) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  // =========================================
  // TEXT EXTRACTION
  // =========================================

  const extractText = useCallback(async (mediaId: string): Promise<any> => {
    setLoading(true);

    setError(null);

    try {
      const result = await extractText(mediaId);

      if (result.success && result.data) {
        return result.data;
      } else {
        setError(result.error || 'Erro ao extrair texto');

        return null;
      } catch (err: unknown) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  const extractTextFromDocument = useCallback(async (mediaId: string): Promise<any> => {
    setLoading(true);

    setError(null);

    try {
      const result = await extractTextFromDocument(mediaId);

      if (result.success && result.data) {
        return result.data;
      } else {
        setError(result.error || 'Erro ao extrair texto do documento');

        return null;
      } catch (err: unknown) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  // =========================================
  // COLOR ANALYSIS
  // =========================================

  const analyzeColors = useCallback(async (mediaId: string): Promise<any> => {
    setLoading(true);

    setError(null);

    try {
      const result = await analyzeColors(mediaId);

      if (result.success && result.data) {
        return result.data;
      } else {
        setError(result.error || 'Erro ao analisar cores');

        return null;
      } catch (err: unknown) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  const extractColorPalette = useCallback(async (mediaId: string): Promise<any> => {
    setLoading(true);

    setError(null);

    try {
      const result = await extractColorPalette(mediaId);

      if (result.success && result.data) {
        return result.data;
      } else {
        setError(result.error || 'Erro ao extrair paleta de cores');

        return null;
      } catch (err: unknown) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  // =========================================
  // SIMILARITY SEARCH
  // =========================================

  const findSimilar = useCallback(async (mediaId: string): Promise<MediaSimilarity | null> => {
    setLoading(true);

    setError(null);

    try {
      const result = await findSimilarMedia(mediaId);

      if (result.success && result.data) {
        setSimilarMedia(result.data);

        return result.data;
      } else {
        setError(result.error || 'Erro ao buscar mídia similar');

        return null;
      } catch (err: unknown) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  const searchByImage = useCallback(async (file: File): Promise<MediaFile[] | null> => {
    setLoading(true);

    setError(null);

    try {
      const result = await searchByImage(file);

      if (result.success && result.data) {
        return result.data;
      } else {
        setError(result.error || 'Erro ao buscar por imagem');

        return null;
      } catch (err: unknown) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  // =========================================
  // AI STATUS
  // =========================================

  const getAIStatus = useCallback(async (mediaId: string): Promise<MediaAI[] | null> => {
    setLoading(true);

    setError(null);

    try {
      const result = await getAIStatus(mediaId);

      if (result.success && result.data) {
        setAIStatus(result.data);

        return result.data;
      } else {
        setError(result.error || 'Erro ao buscar status da IA');

        return null;
      } catch (err: unknown) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  const getProcessingQueue = useCallback(async (): Promise<MediaAI[] | null> => {
    setLoading(true);

    setError(null);

    try {
      const result = await getAIProcessingQueue();

      if (result.success && result.data) {
        setProcessingQueue(result.data);

        return result.data;
      } else {
        setError(result.error || 'Erro ao buscar fila de processamento');

        return null;
      } catch (err: unknown) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  // =========================================
  // UTILITIES
  // =========================================

  const clearError = useCallback(() => {
    setError(null);

  }, []);

  return {
    // State
    aiStatus,
    processingQueue,
    similarMedia,
    autoTags,
    loading,
    error,
    
    // Auto Tag
    autoTag,
    batchAutoTag,
    
    // Face Recognition
    detectFaces,
    recognizeFaces,
    
    // Object Detection
    detectObjects,
    classifyImage,
    
    // Text Extraction
    extractText,
    extractTextFromDocument,
    
    // Color Analysis
    analyzeColors,
    extractColorPalette,
    
    // Similarity Search
    findSimilar,
    searchByImage,
    
    // AI Status
    getAIStatus,
    getProcessingQueue,
    
    // Utilities
    clearError};
};
