/**
 * Testes unitários para operações de estatísticas de usuários
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
import { userStatsService } from '../../services/userStatsService';

const mockApiClient = apiClient as any;

describe("User Stats Operations", () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  describe("userStatsService", () => {
    it("deve buscar estatísticas gerais", async () => {
      const mockStats = {
        total_users: 100,
        active_users: 85,
        inactive_users: 10,
        suspended_users: 5,
        new_users_today: 3,
        users_growth_rate: 5.2,};

      mockApiClient.get.mockResolvedValueOnce({
        data: mockStats,
      });

      const result = await userStatsService.getGeneralStats();

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/api/users/stats/general",);

      expect(result.total_users).toBe(100);

      expect(result.active_users).toBe(85);

    });

    it("deve buscar estatísticas de roles", async () => {
      const mockRoleStats = {
        total_roles: 4,
        role_distribution: [
          { role_name: "admin", user_count: 5, percentage: 5 },
          { role_name: "user", user_count: 80, percentage: 80 },
        ],};

      mockApiClient.get.mockResolvedValueOnce({
        data: mockRoleStats,
      });

      const result = await userStatsService.getRoleStats();

      expect(mockApiClient.get).toHaveBeenCalledWith("/api/users/stats/roles");

      expect(result.total_roles).toBe(4);

      expect(result.role_distribution).toHaveLength(2);

    });

    it("deve buscar estatísticas de atividade", async () => {
      const mockActivityStats = {
        daily_logins: 45,
        weekly_logins: 280,
        monthly_logins: 1200,
        average_session_duration: 25.5,
        most_active_hour: 14,};

      mockApiClient.get.mockResolvedValueOnce({
        data: mockActivityStats,
      });

      const result = await userStatsService.getActivityStats();

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/api/users/stats/activity",);

      expect(result.daily_logins).toBe(45);

      expect(result.average_session_duration).toBe(25.5);

    });

    it("deve buscar estatísticas de crescimento", async () => {
      const mockGrowthStats = {
        users_this_month: 15,
        users_last_month: 12,
        growth_percentage: 25.0,
        trend: "increasing",};

      mockApiClient.get.mockResolvedValueOnce({
        data: mockGrowthStats,
      });

      const result = await userStatsService.getGrowthStats();

      expect(mockApiClient.get).toHaveBeenCalledWith("/api/users/stats/growth");

      expect(result.users_this_month).toBe(15);

      expect(result.growth_percentage).toBe(25.0);

    });

    it("deve buscar estatísticas de geolocalização", async () => {
      const mockGeoStats = {
        countries: [
          { country: "Brasil", user_count: 60, percentage: 60 },
          { country: "Estados Unidos", user_count: 25, percentage: 25 },
        ],
        cities: [
          { city: "São Paulo", user_count: 30, percentage: 30 },
          { city: "Rio de Janeiro", user_count: 20, percentage: 20 },
        ],};

      mockApiClient.get.mockResolvedValueOnce({
        data: mockGeoStats,
      });

      const result = await userStatsService.getGeoStats();

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/api/users/stats/geolocation",);

      expect(result.countries).toHaveLength(2);

      expect(result.cities).toHaveLength(2);

    });

    it("deve buscar estatísticas de dispositivos", async () => {
      const mockDeviceStats = {
        desktop_users: 40,
        mobile_users: 50,
        tablet_users: 10,
        browser_distribution: [
          { browser: "Chrome", percentage: 60 },
          { browser: "Firefox", percentage: 25 },
        ],};

      mockApiClient.get.mockResolvedValueOnce({
        data: mockDeviceStats,
      });

      const result = await userStatsService.getDeviceStats();

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/api/users/stats/devices",);

      expect(result.desktop_users).toBe(40);

      expect(result.mobile_users).toBe(50);

    });

  });

});
