/**
 * Testes unitários para operações de atividade de usuários
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mocks
vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}));

import apiClient from '@/services/api';
import { userActivityService } from '../../services/userActivityService';

const mockApiClient = apiClient as any;

describe('User Activity Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('userActivityService', () => {
    it('deve logar atividade', async () => {
      const activityData = {
        user_id: '1',
        type: 'login',
        description: 'Login realizado',
        metadata: { ip_address: '192.168.1.1' }
      };

      mockApiClient.post.mockResolvedValueOnce({
        data: { id: '1', ...activityData, timestamp: new Date().toISOString() }
      });

      const result = await userActivityService.logActivity(activityData);

      expect(mockApiClient.post).toHaveBeenCalledWith('/api/user-activities', activityData);
      expect(result).toHaveProperty('id', '1');
      expect(result.type).toBe('login');
    });

    it('deve buscar atividades recentes', async () => {
      const filters = { limit: 10, type: 'login' };
      const mockActivities = [
        { id: '1', type: 'login', description: 'Login realizado', timestamp: new Date().toISOString() },
        { id: '2', type: 'logout', description: 'Logout realizado', timestamp: new Date().toISOString() }
      ];

      mockApiClient.get.mockResolvedValueOnce({
        data: mockActivities
      });

      const result = await userActivityService.getRecentActivities(filters);

      expect(mockApiClient.get).toHaveBeenCalledWith('/api/user-activities/recent', { params: filters });
      expect(result).toHaveLength(2);
    });

    it('deve buscar atividades por usuário', async () => {
      const userId = '1';
      const filters = { limit: 20, page: 1 };
      const mockActivities = [
        { id: '1', user_id: '1', type: 'login', description: 'Login realizado' },
        { id: '2', user_id: '1', type: 'profile_update', description: 'Perfil atualizado' }
      ];

      mockApiClient.get.mockResolvedValueOnce({
        data: { activities: mockActivities, total: 2 }
      });

      const result = await userActivityService.getUserActivities(userId, filters);

      expect(mockApiClient.get).toHaveBeenCalledWith(`/api/users/${userId}/activities`, { params: filters });
      expect(result.activities).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('deve buscar estatísticas de atividade', async () => {
      const userId = '1';
      const mockStats = {
        total_activities: 150,
        login_count: 45,
        profile_updates: 12,
        last_activity: new Date().toISOString()
      };

      mockApiClient.get.mockResolvedValueOnce({
        data: mockStats
      });

      const result = await userActivityService.getActivityStats(userId);

      expect(mockApiClient.get).toHaveBeenCalledWith(`/api/users/${userId}/activity-stats`);
      expect(result.total_activities).toBe(150);
      expect(result.login_count).toBe(45);
    });

    it('deve limpar atividades antigas', async () => {
      const daysOld = 30;
      
      mockApiClient.delete.mockResolvedValueOnce({
        data: { deleted_count: 150 }
      });

      const result = await userActivityService.cleanOldActivities(daysOld);

      expect(mockApiClient.delete).toHaveBeenCalledWith('/api/user-activities/cleanup', { 
        params: { days_old: daysOld } 
      });
      expect(result.deleted_count).toBe(150);
    });
  });
});