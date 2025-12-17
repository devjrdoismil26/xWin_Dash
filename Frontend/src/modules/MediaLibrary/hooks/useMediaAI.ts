import { useState, useCallback } from 'react';
import { useMediaAIGeneration } from './useMediaAIGeneration';
import { useMediaAIAnalysis } from './useMediaAIAnalysis';

export const useMediaAI = () => {
  const [loading, setLoading] = useState(false);

  const generation = useMediaAIGeneration();

  const analysis = useMediaAIAnalysis();

  const analyzeMedia = useCallback(async (mediaId: string) => {
    setLoading(true);

    try {
      return await analysis.analyze(mediaId);

    } catch (err) {
      console.error('Erro na análise de IA:', err);

      throw err;
    } finally {
      setLoading(false);

    } , [analysis]);

  const generateTags = useCallback(async (mediaId: string) => {
    setLoading(true);

    try {
      return await generation.generateTags(mediaId);

    } catch (err) {
      console.error('Erro na geração de tags:', err);

      throw err;
    } finally {
      setLoading(false);

    } , [generation]);

  const findSimilar = useCallback(async (mediaId: string) => {
    setLoading(true);

    try {
      return await analysis.findSimilar(mediaId);

    } catch (err) {
      console.error('Erro na busca por similaridade:', err);

      throw err;
    } finally {
      setLoading(false);

    } , [analysis]);

  const optimizeMedia = useCallback(async (mediaId: string) => {
    setLoading(true);

    try {
      return await generation.optimize(mediaId);

    } catch (err) {
      console.error('Erro na otimização:', err);

      throw err;
    } finally {
      setLoading(false);

    } , [generation]);

  return {
    loading,
    analyzeMedia,
    generateTags,
    findSimilar,
    optimizeMedia};
};
