import { useState, useEffect, useCallback } from 'react';

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
  updated_at: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    marketing: boolean;
  };
  privacy: {
    profile_visibility: 'public' | 'private' | 'friends';
    show_email: boolean;
    show_phone: boolean;
    show_birth_date: boolean;
  };
  security: {
    two_factor_enabled: boolean;
    login_notifications: boolean;
  };
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
}

export interface UpdatePasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface UpdatePreferencesData {
  theme?: 'light' | 'dark' | 'auto';
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
    marketing?: boolean;
  };
  privacy?: {
    profile_visibility?: 'public' | 'private' | 'friends';
    show_email?: boolean;
    show_phone?: boolean;
    show_birth_date?: boolean;
  };
  security?: {
    two_factor_enabled?: boolean;
    login_notifications?: boolean;
  };
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

      const response = await fetch('/api/v1/users/profile');
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const userProfile = await response.json();
      setProfile(userProfile);
      return userProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update profile information
  const updateProfile = useCallback(async (data: UpdateProfileData): Promise<Profile> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update password
  const updatePassword = useCallback(async (data: UpdatePasswordData): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/users/profile/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update preferences
  const updatePreferences = useCallback(async (data: UpdatePreferencesData): Promise<UserPreferences> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/users/profile/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      const updatedPreferences = await response.json();
      setProfile(prev => prev ? { ...prev, preferences: updatedPreferences } : null);
      return updatedPreferences;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload avatar
  const uploadAvatar = useCallback(async (file: File): Promise<string> => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/v1/users/profile/avatar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload avatar');
      }

      const data = await response.json();
      setProfile(prev => prev ? { ...prev, avatar_url: data.avatar_url } : null);
      return data.avatar_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload avatar');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete avatar
  const deleteAvatar = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/users/profile/avatar', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete avatar');
      }

      setProfile(prev => prev ? { ...prev, avatar_url: undefined } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete avatar');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Send email verification
  const sendEmailVerification = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/users/profile/send-verification', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to send verification email');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send verification email');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Enable two-factor authentication
  const enableTwoFactor = useCallback(async (): Promise<{ qr_code: string; secret: string }> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/users/profile/two-factor/enable', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to enable two-factor authentication');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enable two-factor authentication');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Disable two-factor authentication
  const disableTwoFactor = useCallback(async (code: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/users/profile/two-factor/disable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Failed to disable two-factor authentication');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disable two-factor authentication');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Verify two-factor code
  const verifyTwoFactor = useCallback(async (code: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/users/profile/two-factor/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Failed to verify two-factor code');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify two-factor code');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete account
  const deleteAccount = useCallback(async (password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/users/profile/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

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
    deleteAccount,
  };
};

export default useProfile;
