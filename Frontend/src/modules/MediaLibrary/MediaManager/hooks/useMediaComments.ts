import { useState, useCallback } from 'react';
import { getErrorMessage } from '@/utils/errorHelpers';
import { createMediaComment, fetchMediaComments, updateMediaComment, deleteMediaComment } from '../services/mediaManagerService';
import type { MediaComment } from '@/types/collaboration.types';

export const useMediaComments = () => {
  const [comments, setComments] = useState<MediaComment[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const getComments = useCallback(async (mediaId: string): Promise<MediaComment[] | null> => {
    setLoading(true);

    setError(null);

    try {
      const result = await fetchMediaComments(mediaId);

      if (result.success && result.data) {
        setComments(result.data);

        return result.data;
      }
      return null;
    } catch (err) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  const createComment = useCallback(async (mediaId: string, content: string): Promise<MediaComment | null> => {
    setLoading(true);

    setError(null);

    try {
      const result = await createMediaComment(mediaId, content);

      if (result.success && result.data) {
        setComments(prev => [...prev, result.data!]);

        return result.data;
      }
      return null;
    } catch (err) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  const updateComment = useCallback(async (commentId: string, content: string): Promise<MediaComment | null> => {
    setLoading(true);

    setError(null);

    try {
      const result = await updateMediaComment(commentId, content);

      if (result.success && result.data) {
        setComments(prev => prev.map(c => c.id === commentId ? result.data! : c));

        return result.data;
      }
      return null;
    } catch (err) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  const deleteComment = useCallback(async (commentId: string): Promise<boolean> => {
    setLoading(true);

    setError(null);

    try {
      const result = await deleteMediaComment(commentId);

      if (result.success) {
        setComments(prev => prev.filter(c => c.id !== commentId));

        return true;
      }
      return false;
    } catch (err) {
      setError(getErrorMessage(err));

      return false;
    } finally {
      setLoading(false);

    } , []);

  return { comments, loading, error, getComments, createComment, updateComment, deleteComment};
};
