/**
 * Testes unitários para operações CRUD de usuários
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
import { userManagementService } from '../../services/userManagementService';

const mockApiClient = apiClient as any;

describe('User CRUD Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('userManagementService', () => {
    it('deve criar usuário com sucesso', async () => {
      const userData = {
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'senha123',
        role: 'user'
      };

      mockApiClient.post.mockResolvedValueOnce({
        data: { id: '1', ...userData, created_at: new Date().toISOString() }
      });

      const result = await userManagementService.createUser(userData);

      expect(mockApiClient.post).toHaveBeenCalledWith('/api/users', userData);
      expect(result).toHaveProperty('id', '1');
      expect(result).toHaveProperty('name', 'João Silva');
    });

    it('deve tratar erro ao criar usuário', async () => {
      const userData = {
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'senha123',
        role: 'user'
      };

      mockApiClient.post.mockRejectedValueOnce(new Error('Email já existe'));

      await expect(userManagementService.createUser(userData)).rejects.toThrow('Email já existe');
    });

    it('deve buscar usuários com filtros', async () => {
      const filters = { status: 'active', role: 'user', page: 1, limit: 10 };
      const mockResponse = {
        data: {
          users: [
            { id: '1', name: 'João Silva', email: 'joao@example.com', status: 'active' },
            { id: '2', name: 'Maria Santos', email: 'maria@example.com', status: 'active' }
          ],
          total: 2,
          page: 1,
          limit: 10
        }
      };

      mockApiClient.get.mockResolvedValueOnce(mockResponse);

      const result = await userManagementService.getUsers(filters);

      expect(mockApiClient.get).toHaveBeenCalledWith('/api/users', { params: filters });
      expect(result.users).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('deve ativar usuário', async () => {
      const userId = '1';
      mockApiClient.put.mockResolvedValueOnce({
        data: { id: userId, status: 'active' }
      });

      const result = await userManagementService.activateUser(userId);

      expect(mockApiClient.put).toHaveBeenCalledWith(`/api/users/${userId}/activate`);
      expect(result.status).toBe('active');
    });

    it('deve suspender usuário', async () => {
      const userId = '1';
      const reason = 'Violação de política';
      
      mockApiClient.put.mockResolvedValueOnce({
        data: { id: userId, status: 'suspended', suspension_reason: reason }
      });

      const result = await userManagementService.suspendUser(userId, reason);

      expect(mockApiClient.put).toHaveBeenCalledWith(`/api/users/${userId}/suspend`, { reason });
      expect(result.status).toBe('suspended');
    });

    it('deve atualizar usuário', async () => {
      const userId = '1';
      const updateData = { name: 'João Silva Atualizado' };
      
      mockApiClient.put.mockResolvedValueOnce({
        data: { id: userId, ...updateData }
      });

      const result = await userManagementService.updateUser(userId, updateData);

      expect(mockApiClient.put).toHaveBeenCalledWith(`/api/users/${userId}`, updateData);
      expect(result.name).toBe('João Silva Atualizado');
    });

    it('deve deletar usuário', async () => {
      const userId = '1';
      
      mockApiClient.delete.mockResolvedValueOnce({
        data: { success: true }
      });

      const result = await userManagementService.deleteUser(userId);

      expect(mockApiClient.delete).toHaveBeenCalledWith(`/api/users/${userId}`);
      expect(result.success).toBe(true);
    });

    it('deve buscar usuário por ID', async () => {
      const userId = '1';
      const mockUser = {
        id: '1',
        name: 'João Silva',
        email: 'joao@example.com',
        status: 'active'
      };
      
      mockApiClient.get.mockResolvedValueOnce({
        data: mockUser
      });

      const result = await userManagementService.getUserById(userId);

      expect(mockApiClient.get).toHaveBeenCalledWith(`/api/users/${userId}`);
      expect(result).toEqual(mockUser);
    });
  });
});