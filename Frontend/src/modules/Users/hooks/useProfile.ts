import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/services';
import { getErrorMessage } from '@/utils/errorHelpers';

export interface Profile {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  avatar_url?: string;
  phone?: string;
  timezone?: string;
  language?: string;
  bio?: string;
  website?: string;
  location?: string;
  birth_date?: string;
  preferences?: UserPreferences;
  created_at: string;
  updated_at: string; }

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean; };

  privacy: {
    profile_visibility: 'public' | 'private' | 'friends';
    show_email: boolean;
    show_phone: boolean;
    show_birth_date: boolean;};

  security: {
    two_factor_enabled: boolean;
    login_notifications: boolean;};

}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  timezone?: string;
  language?: string;
  bio?: string;
  website?: string;
  location?: string;
  birth_date?: string;
  [key: string]: unknown; }

export interface UpdatePasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
  [key: string]: unknown; }

export interface UpdatePreferencesData {
  theme?: 'light' | 'dark' | 'auto';
  notifications?: {
    email?: boolean;
  push?: boolean;
  sms?: boolean;
  marketing?: boolean;
  [key: string]: unknown; };

  privacy?: {
    profile_visibility?: 'public' | 'private' | 'friends';
    show_email?: boolean;
    show_phone?: boolean;
    show_birth_date?: boolean;};

  security?: {
    two_factor_enabled?: boolean;
    login_notifications?: boolean;};

}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Fetch current user profile
  const fetchProfile = useCallback(async (): Promise<Profile> => {
    try {
      setLoading(true);

      setError(null);

      const userProfile = await apiClient.get<Profile>('/api/v1/users/profile');

      setProfile(userProfile);

      return userProfile;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      throw new Error(errorMessage);

    } finally {
      setLoading(false);

    } , []);

  // Update profile information
  const updateProfile = useCallback(async (data: UpdateProfileData): Promise<Profile> => {
    try {
      setLoading(true);

      setError(null);

      const updatedProfile = await apiClient.put<Profile>('/api/v1/users/profile', data);

      setProfile(updatedProfile);

      return updatedProfile;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      throw new Error(errorMessage);

    } finally {
      setLoading(false);

    } , []);

  // Update password
  const updatePassword = useCallback(async (data: UpdatePasswordData): Promise<void> => {
    try {
      setLoading(true);

      setError(null);

      await apiClient.put('/api/v1/users/profile/password', data);

    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      throw new Error(errorMessage);

    } finally {
      setLoading(false);

    } , []);

  // Update preferences
  const updatePreferences = useCallback(async (data: UpdatePreferencesData): Promise<UserPreferences> => {
    try {
      setLoading(true);

      setError(null);

      const updatedProfile = await apiClient.put<Profile>('/api/v1/users/profile/preferences', data);

      setProfile(updatedProfile);

      return updatedProfile.preferences || {} as UserPreferences;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      throw new Error(errorMessage);

    } finally {
      setLoading(false);

    } , []);

  // Upload avatar
  const uploadAvatar = useCallback(async (file: File): Promise<string> => {
    try {
      setLoading(true);

      setError(null);

      const formData = new FormData();

      formData.append('avatar', file);

      const data = await apiClient.upload<{ avatar_url: string }>('/api/v1/users/profile/avatar', formData);

      setProfile(prev => prev ? { ...prev, avatar_url: (data as any).avatar_url } : null);

      return (data as any).avatar_url;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      throw new Error(errorMessage);

    } finally {
      setLoading(false);

    } , []);

  // Delete avatar
  const deleteAvatar = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);

      setError(null);

      await apiClient.delete('/api/v1/users/profile/avatar');

      setProfile(prev => prev ? { ...prev, avatar_url: undefined } : null);

    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      throw new Error(errorMessage);

    } finally {
      setLoading(false);

    } , []);

  // Send email verification
  const sendEmailVerification = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);

      setError(null);

      await apiClient.post('/api/v1/users/profile/send-verification');

    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      throw new Error(errorMessage);

    } finally {
      setLoading(false);

    } , []);

  // Enable two-factor authentication
  const enableTwoFactor = useCallback(async (): Promise<{ qr_code: string; secret: string }> => {
    try {
      setLoading(true);

      setError(null);

      const result = await apiClient.post<{ qr_code: string; secret: string }>('/api/v1/users/profile/two-factor/enable');

      return result;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      throw new Error(errorMessage);

    } finally {
      setLoading(false);

    } , []);

  // Disable two-factor authentication
  const disableTwoFactor = useCallback(async (code: string): Promise<void> => {
    try {
      setLoading(true);

      setError(null);

      await apiClient.post('/api/v1/users/profile/two-factor/disable', { code });

    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      throw new Error(errorMessage);

    } finally {
      setLoading(false);

    } , []);

  // Verify two-factor code
  const verifyTwoFactor = useCallback(async (code: string): Promise<void> => {
    try {
      setLoading(true);

      setError(null);

      await apiClient.post('/api/v1/users/profile/two-factor/verify', { code });

    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      throw new Error(errorMessage);

    } finally {
      setLoading(false);

    } , []);

  // Delete account
  const deleteAccount = useCallback(async (password: string): Promise<void> => {
    try {
      setLoading(true);

      setError(null);

      await apiClient.delete('/api/v1/users/profile/delete', { data: { password } );

    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      throw new Error(errorMessage);

    } finally {
      setLoading(false);

    } , []);

  // Initialize profile on mount
  useEffect(() => {
    fetchProfile();

  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    updatePassword,
    updatePreferences,
    uploadAvatar,
    deleteAvatar,
    sendEmailVerification,
    enableTwoFactor,
    disableTwoFactor,
    verifyTwoFactor,
    deleteAccount,};
};

export default useProfile;
