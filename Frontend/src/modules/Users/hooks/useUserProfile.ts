import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { userProfileService } from '../services/userProfileService';
import { User, UserProfile } from '../types/user.types';
import {  } from '@/lib/utils';
// getErrorMessage removido - usar try/catch direto
import type {
  ProfileData,
  AvatarUploadData,
  CoverUploadData,
  ProfileStats,
  ProfileValidation,
  PrivacySettings,
  NotificationSettings
} from '../services/userProfileService';

interface UserProfileState {
  // Estado do perfil
  profile: UserProfile | null;
  profileStats: ProfileStats | null;
  // Estado de loading e erro
  loading: boolean;
  error: string | null;
  // Estado de operações
  updating: boolean;
  uploadingAvatar: boolean;
  uploadingCover: boolean;
  validating: boolean;
  // Estado de configurações
  privacySettings: PrivacySettings | null;
  notificationSettings: NotificationSettings | null;
  // Estado de validação
  validation: ProfileValidation | null;
  // Estado de seguidores/seguindo
  followers: User[];
  following: User[];
  followersCount: number;
  followingCount: number;
  // Estado de perfis públicos
  publicProfiles: UserProfile[]; }

interface UserProfileActions {
  // Ações de perfil
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (userId: string, data: Partial<ProfileData>) => Promise<UserProfile>;
  refreshProfile: (userId: string) => Promise<void>;
  // Ações de avatar
  uploadAvatar: (userId: string, data: AvatarUploadData) => Promise<{ avatar_url: string;
}>;
  removeAvatar: (userId: string) => Promise<void>;
  
  // Ações de cover
  uploadCover: (userId: string, data: CoverUploadData) => Promise<{ cover_url: string }>;
  removeCover: (userId: string) => Promise<void>;
  
  // Ações de estatísticas
  fetchProfileStats: (userId: string) => Promise<void>;
  
  // Ações de validação
  validateProfile: (userId: string) => Promise<ProfileValidation>;
  clearValidation??: (e: any) => void;
  
  // Ações de configurações de privacidade
  fetchPrivacySettings: (userId: string) => Promise<void>;
  updatePrivacySettings: (userId: string, settings: PrivacySettings) => Promise<PrivacySettings>;
  
  // Ações de configurações de notificações
  fetchNotificationSettings: (userId: string) => Promise<void>;
  updateNotificationSettings: (userId: string, settings: NotificationSettings) => Promise<NotificationSettings>;
  
  // Ações de perfis públicos
  fetchPublicProfiles: (params?: {
    search?: string;
    location?: string;
    page?: number;
    limit?: number;
  }) => Promise<void>;
  
  // Ações de seguir/deixar de seguir
  followUser: (userId: string, targetUserId: string) => Promise<void>;
  unfollowUser: (userId: string, targetUserId: string) => Promise<void>;
  isFollowing: (userId: string, targetUserId: string) => Promise<boolean>;
  
  // Ações de seguidores/seguindo
  fetchFollowers: (userId: string, params?: { page?: number; limit?: number }) => Promise<void>;
  fetchFollowing: (userId: string, params?: { page?: number; limit?: number }) => Promise<void>;
  
  // Ações de estado
  setLoading?: (e: any) => void;
  setError?: (e: any) => void;
  clearError??: (e: any) => void;
  
  // Ações de limpeza
  clearProfile??: (e: any) => void;
  clearAllData??: (e: any) => void;
}

type UserProfileStore = UserProfileState & UserProfileActions;

const initialState: UserProfileState = {
  profile: null,
  profileStats: null,
  loading: false,
  error: null,
  updating: false,
  uploadingAvatar: false,
  uploadingCover: false,
  validating: false,
  privacySettings: null,
  notificationSettings: null,
  validation: null,
  followers: [],
  following: [],
  followersCount: 0,
  followingCount: 0,
  publicProfiles: []};

export const useUserProfile = create<UserProfileStore>()(
  devtools(
    persist(
      (set: unknown, get: unknown) => ({
        ...initialState,

        // Ações de perfil
        fetchProfile: async (userId: string) => {
          try {
            set({ loading: true, error: null });

            const profile = await userProfileService.getProfile(userId);

            set({
              profile,
              loading: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,

        updateProfile: async (userId: string, data: Partial<ProfileData>) => {
          try {
            set({ updating: true, error: null });

            const updatedProfile = await userProfileService.updateProfile(userId, data);

            set({
              profile: updatedProfile,
              updating: false
            });

            return updatedProfile;
          } catch (error) {
            set({
              error: getErrorMessage(error),
              updating: false
            });

            throw error;
          } ,

        refreshProfile: async (userId: string) => {
          const { fetchProfile } = get();

          await fetchProfile(userId);

        },

        // Ações de avatar
        uploadAvatar: async (userId: string, data: AvatarUploadData) => {
          try {
            set({ uploadingAvatar: true, error: null });

            const result = await userProfileService.uploadAvatar(userId, data);

            set((state: unknown) => ({
              profile: state.profile ? { ...state.profile, avatar: result.avatar_url } : null,
              uploadingAvatar: false
            }));

            return result;
          } catch (error) {
            set({
              error: getErrorMessage(error),
              uploadingAvatar: false
            });

            throw error;
          } ,

        removeAvatar: async (userId: string) => {
          try {
            set({ updating: true, error: null });

            await userProfileService.removeAvatar(userId);

            set((state: unknown) => ({
              profile: state.profile ? { ...state.profile, avatar: undefined } : null,
              updating: false
            }));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              updating: false
            });

            throw error;
          } ,

        // Ações de cover
        uploadCover: async (userId: string, data: CoverUploadData) => {
          try {
            set({ uploadingCover: true, error: null });

            const result = await userProfileService.uploadCover(userId, data);

            set((state: unknown) => ({
              profile: state.profile ? { ...state.profile, cover_image: result.cover_url } : null,
              uploadingCover: false
            }));

            return result;
          } catch (error) {
            set({
              error: getErrorMessage(error),
              uploadingCover: false
            });

            throw error;
          } ,

        removeCover: async (userId: string) => {
          try {
            set({ updating: true, error: null });

            await userProfileService.removeCover(userId);

            set((state: unknown) => ({
              profile: state.profile ? { ...state.profile, cover_image: undefined } : null,
              updating: false
            }));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              updating: false
            });

            throw error;
          } ,

        // Ações de estatísticas
        fetchProfileStats: async (userId: string) => {
          try {
            const stats = await userProfileService.getProfileStats(userId);

            set({ profileStats: stats });

          } catch (error) {
            set({
              error: getErrorMessage(error)
  });

          } ,

        // Ações de validação
        validateProfile: async (userId: string) => {
          try {
            set({ validating: true, error: null });

            const validation = await userProfileService.validateProfile(userId);

            set({
              validation,
              validating: false
            });

            return validation;
          } catch (error) {
            set({
              error: getErrorMessage(error),
              validating: false
            });

            throw error;
          } ,

        clearValidation: () => {
          set({ validation: null });

        },

        // Ações de configurações de privacidade
        fetchPrivacySettings: async (userId: string) => {
          try {
            const settings = await userProfileService.getPrivacySettings(userId);

            set({ privacySettings: settings });

          } catch (error) {
            set({
              error: getErrorMessage(error)
  });

          } ,

        updatePrivacySettings: async (userId: string, settings: PrivacySettings) => {
          try {
            set({ updating: true, error: null });

            const updatedSettings = await userProfileService.updatePrivacySettings(userId, settings);

            set({
              privacySettings: updatedSettings,
              updating: false
            });

            return updatedSettings;
          } catch (error) {
            set({
              error: getErrorMessage(error),
              updating: false
            });

            throw error;
          } ,

        // Ações de configurações de notificações
        fetchNotificationSettings: async (userId: string) => {
          try {
            const settings = await userProfileService.getNotificationSettings(userId);

            set({ notificationSettings: settings });

          } catch (error) {
            set({
              error: getErrorMessage(error)
  });

          } ,

        updateNotificationSettings: async (userId: string, settings: NotificationSettings) => {
          try {
            set({ updating: true, error: null });

            const updatedSettings = await userProfileService.updateNotificationSettings(userId, settings);

            set({
              notificationSettings: updatedSettings,
              updating: false
            });

            return updatedSettings;
          } catch (error) {
            set({
              error: getErrorMessage(error),
              updating: false
            });

            throw error;
          } ,

        // Ações de perfis públicos
        fetchPublicProfiles: async (params?: {
          search?: string;
          location?: string;
          page?: number;
          limit?: number;
        }) => {
          try {
            set({ loading: true, error: null });

            const response = await userProfileService.getPublicProfiles(params);

            set({
              publicProfiles: (response as any).data,
              loading: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,

        // Ações de seguir/deixar de seguir
        followUser: async (userId: string, targetUserId: string) => {
          try {
            set({ updating: true, error: null });

            await userProfileService.followUser(userId, targetUserId);

            // Atualizar contadores
            set((state: unknown) => ({
              followingCount: state.followingCount + 1,
              updating: false
            }));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              updating: false
            });

            throw error;
          } ,

        unfollowUser: async (userId: string, targetUserId: string) => {
          try {
            set({ updating: true, error: null });

            await userProfileService.unfollowUser(userId, targetUserId);

            // Atualizar contadores
            set((state: unknown) => ({
              followingCount: Math.max(0, state.followingCount - 1),
              updating: false
            }));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              updating: false
            });

            throw error;
          } ,

        isFollowing: async (userId: string, targetUserId: string) => {
          try {
            const isFollowing = await userProfileService.isFollowing(userId, targetUserId);

            return isFollowing;
          } catch (error) {
            set({
              error: getErrorMessage(error)
  });

            return false;
          } ,

        // Ações de seguidores/seguindo
        fetchFollowers: async (userId: string, params?: { page?: number; limit?: number }) => {
          try {
            set({ loading: true, error: null });

            const response = await userProfileService.getFollowers(userId, params);

            set({
              followers: (response as any).data,
              followersCount: (response as any).total,
              loading: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,

        fetchFollowing: async (userId: string, params?: { page?: number; limit?: number }) => {
          try {
            set({ loading: true, error: null });

            const response = await userProfileService.getFollowing(userId, params);

            set({
              following: (response as any).data,
              followingCount: (response as any).total,
              loading: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,

        // Ações de estado
        setLoading: (loading: boolean) => {
          set({ loading });

        },

        setError: (error: string | null) => {
          set({ error });

        },

        clearError: () => {
          set({ error: null });

        },

        // Ações de limpeza
        clearProfile: () => {
          set({
            profile: null,
            profileStats: null,
            validation: null
          });

        },

        clearAllData: () => {
          set({
            ...initialState
          });

        } ),
      {
        name: 'users-profile-store',
        partialize: (state: unknown) => ({
          privacySettings: state.privacySettings,
          notificationSettings: state.notificationSettings
        })
  }
    ),
    {
      name: 'UsersProfileStore'
    }
  ));

export default useUserProfile;
