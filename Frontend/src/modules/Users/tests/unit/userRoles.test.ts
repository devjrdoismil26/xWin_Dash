/**
 * Testes unitários para operações de roles de usuários
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mocks
vi.mock("@/services/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import apiClient from "@/services/api";
import { userRolesService } from '../../services/userRolesService';

const mockApiClient = apiClient as any;

describe("User Roles Operations", () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  describe("userRolesService", () => {
    it("deve atribuir role a usuário", async () => {
      const userId = "1";
      const roleId = "admin";

      mockApiClient.post.mockResolvedValueOnce({
        data: { success: true },
      });

      const result = await userRolesService.assignRole(userId, roleId);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        `/api/users/${userId}/roles`,
        { role_id: roleId },);

      expect(result.success).toBe(true);

    });

    it("deve remover role de usuário", async () => {
      const userId = "1";
      const roleId = "admin";

      mockApiClient.delete.mockResolvedValueOnce({
        data: { success: true },
      });

      const result = await userRolesService.removeRole(userId, roleId);

      expect(mockApiClient.delete).toHaveBeenCalledWith(
        `/api/users/${userId}/roles/${roleId}`,);

      expect(result.success).toBe(true);

    });

    it("deve buscar roles disponíveis", async () => {
      const mockRoles = [
        { id: "1", name: "admin", description: "Administrador" },
        { id: "2", name: "user", description: "Usuário" },
      ];

      mockApiClient.get.mockResolvedValueOnce({
        data: mockRoles,
      });

      const result = await userRolesService.getRoles();

      expect(mockApiClient.get).toHaveBeenCalledWith("/api/roles");

      expect(result).toHaveLength(2);

      expect(result[0].name).toBe("admin");

    });

    it("deve buscar roles de um usuário", async () => {
      const userId = "1";
      const mockUserRoles = [
        { id: "1", name: "admin", description: "Administrador" },
      ];

      mockApiClient.get.mockResolvedValueOnce({
        data: mockUserRoles,
      });

      const result = await userRolesService.getUserRoles(userId);

      expect(mockApiClient.get).toHaveBeenCalledWith(
        `/api/users/${userId}/roles`,);

      expect(result).toHaveLength(1);

      expect(result[0].name).toBe("admin");

    });

    it("deve verificar se usuário tem role", async () => {
      const userId = "1";
      const roleName = "admin";

      mockApiClient.get.mockResolvedValueOnce({
        data: { hasRole: true },
      });

      const result = await userRolesService.hasRole(userId, roleName);

      expect(mockApiClient.get).toHaveBeenCalledWith(
        `/api/users/${userId}/roles/${roleName}/check`,);

      expect(result.hasRole).toBe(true);

    });

    it("deve atualizar roles de usuário", async () => {
      const userId = "1";
      const roles = ["admin", "user"];

      mockApiClient.put.mockResolvedValueOnce({
        data: { success: true },
      });

      const result = await userRolesService.updateUserRoles(userId, roles);

      expect(mockApiClient.put).toHaveBeenCalledWith(
        `/api/users/${userId}/roles`,
        { roles },);

      expect(result.success).toBe(true);

    });

  });

});
