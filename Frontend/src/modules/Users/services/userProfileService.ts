import { apiClient } from '@/services';
import { User, UserProfile } from '../types/user.types';

// Cache para perfis
const profileCache = new Map<string, { data: unknown; timestamp: number }>();

const CACHE_TTL = 10 * 60 * 1000; // 10 minutos (perfis mudam menos frequentemente)

// Interface para dados de perfil
export interface ProfileData {
  first_name: string;
  last_name: string;
  bio?: string;
  website?: string;
  location?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  phone?: string;
  timezone?: string;
  language?: string;
  avatar?: string;
  cover_image?: string;
  social_links?: {
    twitter?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  facebook?: string;
  [key: string]: unknown; };

  preferences?: {
    theme: 'light' | 'dark' | 'auto';
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;};

    privacy: {
      profile_visibility: 'public' | 'private' | 'friends';
      show_email: boolean;
      show_phone: boolean;
      show_birthday: boolean;};
};

}

// Interface para upload de avatar
export interface AvatarUploadData {
  file: File;
  crop?: {
    x: number;
  y: number;
  width: number;
  height: number;
  [key: string]: unknown; };

}

// Interface para upload de cover
export interface CoverUploadData {
  file: File;
  crop?: {
    x: number;
  y: number;
  width: number;
  height: number;
  [key: string]: unknown; };

}

// Interface para estatísticas de perfil
export interface ProfileStats {
  profile_completion: number;
  missing_fields: string[];
  last_updated: string;
  views_count: number;
  followers_count: number;
  following_count: number;
  posts_count: number;
  comments_count: number;
  likes_received: number;
  profile_views_today: number;
  profile_views_this_week: number;
  profile_views_this_month: number; }

// Interface para validação de perfil
export interface ProfileValidation {
  is_valid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  completion_score: number; }

// Interface para configurações de privacidade
export interface PrivacySettings {
  profile_visibility: 'public' | 'private' | 'friends';
  show_email: boolean;
  show_phone: boolean;
  show_birthday: boolean;
  show_location: boolean;
  show_website: boolean;
  show_social_links: boolean;
  allow_messages: boolean;
  allow_follow_requests: boolean;
  [key: string]: unknown; }

// Interface para configurações de notificações
export interface NotificationSettings {
  email_notifications: {
    new_followers: boolean;
  new_messages: boolean;
  profile_views: boolean;
  mentions: boolean;
  comments: boolean;
  likes: boolean;
  system_updates: boolean;
  [key: string]: unknown; };

  push_notifications: {
    new_followers: boolean;
    new_messages: boolean;
    mentions: boolean;
    comments: boolean;
    likes: boolean;};

  sms_notifications: {
    security_alerts: boolean;
    important_updates: boolean;};

}

/**
 * Service para gerenciamento de perfis de usuário
 * Responsável por perfis, avatars, configurações e estatísticas
 */
class UserProfileService {
  private baseUrl = '/api/users/profiles';

  /**
   * Obtém perfil de um usuário
   */
  async getProfile(userId: string): Promise<UserProfile> {
    try {
      const cacheKey = `profile_${userId}`;
      const cached = profileCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/${userId}`);

      // Cache do resultado
      profileCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao carregar perfil');

    } /**
   * Atualiza perfil de um usuário
   */
  async updateProfile(userId: string, data: Partial<ProfileData>): Promise<UserProfile> {
    try {
      // Validação básica
      this.validateProfileData(data);

      const response = await apiClient.put(`${this.baseUrl}/${userId}`, data);

      // Limpar cache relacionado
      this.clearProfileCache(userId);

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao atualizar perfil');

    } /**
   * Faz upload de avatar
   */
  async uploadAvatar(userId: string, data: AvatarUploadData): Promise<{ avatar_url: string }> {
    try {
      const formData = new FormData();

      formData.append('file', (data as any).file);

      if (data.crop) {
        formData.append('crop', JSON.stringify(data.crop));

      }

      const response = await apiClient.post(`${this.baseUrl}/${userId}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        } );

      // Limpar cache relacionado
      this.clearProfileCache(userId);

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao fazer upload do avatar');

    } /**
   * Remove avatar
   */
  async removeAvatar(userId: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${userId}/avatar`);

      // Limpar cache relacionado
      this.clearProfileCache(userId);

    } catch (error) {
      throw new Error('Falha ao remover avatar');

    } /**
   * Faz upload de cover image
   */
  async uploadCover(userId: string, data: CoverUploadData): Promise<{ cover_url: string }> {
    try {
      const formData = new FormData();

      formData.append('file', (data as any).file);

      if (data.crop) {
        formData.append('crop', JSON.stringify(data.crop));

      }

      const response = await apiClient.post(`${this.baseUrl}/${userId}/cover`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        } );

      // Limpar cache relacionado
      this.clearProfileCache(userId);

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao fazer upload da cover');

    } /**
   * Remove cover image
   */
  async removeCover(userId: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${userId}/cover`);

      // Limpar cache relacionado
      this.clearProfileCache(userId);

    } catch (error) {
      throw new Error('Falha ao remover cover');

    } /**
   * Obtém estatísticas do perfil
   */
  async getProfileStats(userId: string): Promise<ProfileStats> {
    try {
      const cacheKey = `profile_stats_${userId}`;
      const cached = profileCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/${userId}/stats`);

      // Cache do resultado
      profileCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao obter estatísticas do perfil');

    } /**
   * Valida perfil
   */
  async validateProfile(userId: string): Promise<ProfileValidation> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${userId}/validate`);

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao validar perfil');

    } /**
   * Atualiza configurações de privacidade
   */
  async updatePrivacySettings(userId: string, settings: PrivacySettings): Promise<PrivacySettings> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/${userId}/privacy`, settings);

      // Limpar cache relacionado
      this.clearProfileCache(userId);

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao atualizar configurações de privacidade');

    } /**
   * Obtém configurações de privacidade
   */
  async getPrivacySettings(userId: string): Promise<PrivacySettings> {
    try {
      const cacheKey = `privacy_settings_${userId}`;
      const cached = profileCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/${userId}/privacy`);

      // Cache do resultado
      profileCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao obter configurações de privacidade');

    } /**
   * Atualiza configurações de notificações
   */
  async updateNotificationSettings(userId: string, settings: NotificationSettings): Promise<NotificationSettings> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/${userId}/notifications`, settings);

      // Limpar cache relacionado
      this.clearProfileCache(userId);

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao atualizar configurações de notificações');

    } /**
   * Obtém configurações de notificações
   */
  async getNotificationSettings(userId: string): Promise<NotificationSettings> {
    try {
      const cacheKey = `notification_settings_${userId}`;
      const cached = profileCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/${userId}/notifications`);

      // Cache do resultado
      profileCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao obter configurações de notificações');

    } /**
   * Busca perfis públicos
   */
  async getPublicProfiles(params: {
    search?: string;
    location?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{
    data: UserProfile[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  }> {
    try {
      const cacheKey = `public_profiles_${JSON.stringify(params)}`;
      const cached = profileCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/public`, { params });

      const result = {
        data: (response as any).data.data || (response as any).data,
        total: (response as any).data.total || (response as any).data.length,
        page: params.page || 1,
        limit: params.limit || 10,
        total_pages: Math.ceil((response.data.total || (response as any).data.length) / (params.limit || 10))};

      // Cache do resultado
      profileCache.set(cacheKey, { data: result, timestamp: Date.now() });

      return result;
    } catch (error) {
      throw new Error('Falha ao buscar perfis públicos');

    } /**
   * Segue um usuário
   */
  async followUser(userId: string, targetUserId: string): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/${userId}/follow`, {
        target_user_id: targetUserId
      });

      // Limpar cache relacionado
      this.clearProfileCache(userId);

      this.clearProfileCache(targetUserId);

    } catch (error) {
      throw new Error('Falha ao seguir usuário');

    } /**
   * Deixa de seguir um usuário
   */
  async unfollowUser(userId: string, targetUserId: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${userId}/follow/${targetUserId}`);

      // Limpar cache relacionado
      this.clearProfileCache(userId);

      this.clearProfileCache(targetUserId);

    } catch (error) {
      throw new Error('Falha ao deixar de seguir usuário');

    } /**
   * Obtém seguidores de um usuário
   */
  async getFollowers(userId: string, params: {
    page?: number;
    limit?: number;
  } = {}): Promise<{
    data: User[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  }> {
    try {
      const cacheKey = `followers_${userId}_${JSON.stringify(params)}`;
      const cached = profileCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/${userId}/followers`, { params });

      const result = {
        data: (response as any).data.data || (response as any).data,
        total: (response as any).data.total || (response as any).data.length,
        page: params.page || 1,
        limit: params.limit || 10,
        total_pages: Math.ceil((response.data.total || (response as any).data.length) / (params.limit || 10))};

      // Cache do resultado
      profileCache.set(cacheKey, { data: result, timestamp: Date.now() });

      return result;
    } catch (error) {
      throw new Error('Falha ao obter seguidores');

    } /**
   * Obtém usuários seguidos por um usuário
   */
  async getFollowing(userId: string, params: {
    page?: number;
    limit?: number;
  } = {}): Promise<{
    data: User[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  }> {
    try {
      const cacheKey = `following_${userId}_${JSON.stringify(params)}`;
      const cached = profileCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/${userId}/following`, { params });

      const result = {
        data: (response as any).data.data || (response as any).data,
        total: (response as any).data.total || (response as any).data.length,
        page: params.page || 1,
        limit: params.limit || 10,
        total_pages: Math.ceil((response.data.total || (response as any).data.length) / (params.limit || 10))};

      // Cache do resultado
      profileCache.set(cacheKey, { data: result, timestamp: Date.now() });

      return result;
    } catch (error) {
      throw new Error('Falha ao obter usuários seguidos');

    } /**
   * Verifica se um usuário segue outro
   */
  async isFollowing(userId: string, targetUserId: string): Promise<boolean> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${userId}/following/${targetUserId}`);

      return (response as any).data.is_following;
    } catch (error) {
      return false;
    } /**
   * Valida dados básicos do perfil
   */
  private validateProfileData(data: Partial<ProfileData>): void {
    if (data.first_name && (data as any).first_name.trim().length < 1) {
      throw new Error('Nome deve ter pelo menos 1 caractere');

    }

    if (data.last_name && (data as any).last_name.trim().length < 1) {
      throw new Error('Sobrenome deve ter pelo menos 1 caractere');

    }

    if (data.bio && (data as any).bio.length > 500) {
      throw new Error('Bio deve ter no máximo 500 caracteres');

    }

    if (data.website && !this.isValidUrl(data.website)) {
      throw new Error('Website deve ser uma URL válida');

    }

    if (data.phone && !this.isValidPhone(data.phone)) {
      throw new Error('Telefone inválido');

    }

    if (data.date_of_birth && !this.isValidDate(data.date_of_birth)) {
      throw new Error('Data de nascimento inválida');

    } /**
   * Valida formato de URL
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);

      return true;
    } catch {
      return false;
    } /**
   * Valida formato de telefone
   */
  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));

  }

  /**
   * Valida formato de data
   */
  private isValidDate(dateString: string): boolean {
    const date = new Date(dateString);

    return date instanceof Date && !isNaN(date.getTime());

  }

  /**
   * Limpa cache de perfil específico
   */
  private clearProfileCache(userId: string): void {
    for (const key of profileCache.keys()) {
      if (key.includes(userId)) {
        profileCache.delete(key);

      } }

  /**
   * Limpa cache específico
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of profileCache.keys()) {
        if (key.includes(pattern)) {
          profileCache.delete(key);

        } } else {
      profileCache.clear();

    } /**
   * Obtém estatísticas do cache
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: profileCache.size,
      keys: Array.from(profileCache.keys())};

  } // Instância singleton
export const userProfileService = new UserProfileService();

export default userProfileService;
