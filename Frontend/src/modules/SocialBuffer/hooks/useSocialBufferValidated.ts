import { useState, useCallback } from 'react';
import { validatedApiClient } from '@/services';
import { SocialPostSchema, SocialAccountSchema, type SocialPost, type SocialAccount } from '@/schemas';
import { z } from 'zod';

export function useSocialBufferValidated() {
  const [posts, setPosts] = useState<SocialPost[]>([]);

  const [accounts, setAccounts] = useState<SocialAccount[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async (filters?: string) => {
    try {
      setLoading(true);

      setError(null);

      const data = await validatedApiClient.get('/social/posts', z.array(SocialPostSchema), { params: filters });

      setPosts(data);

      return data;
    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);

      const data = await validatedApiClient.get('/social/accounts', z.array(SocialAccountSchema));

      setAccounts(data);

      return data;
    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const createPost = useCallback(async (data: Partial<SocialPost>) => {
    try {
      setLoading(true);

      const newPost = await validatedApiClient.post('/social/posts', SocialPostSchema, data);

      setPosts(prev => [...prev, newPost]);

      return newPost;
    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const schedulePost = useCallback(async (id: string | number, scheduledAt: string) => {
    try {
      setLoading(true);

      const updated = await validatedApiClient.put(`/social/posts/${id}/schedule`, SocialPostSchema, { scheduled_at: scheduledAt });

      setPosts(prev => prev.map(p => p.id === id ? updated : p));

      return updated;
    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const deletePost = useCallback(async (id: string | number) => {
    try {
      setLoading(true);

      await validatedApiClient.delete(`/social/posts/${id}`);

      setPosts(prev => prev.filter(p => p.id !== id));

    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  return {
    posts,
    accounts,
    loading,
    error,
    fetchPosts,
    fetchAccounts,
    createPost,
    schedulePost,
    deletePost};

}
