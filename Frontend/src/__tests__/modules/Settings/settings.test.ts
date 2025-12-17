/**
 * Testes unitários para o módulo Settings
 */

import { renderHook, act } from '@testing-library/react';
import { useSettings } from '../hooks/useSettings';
import { useGeneralSettings } from '../GeneralSettings/hooks/useGeneralSettings';
import { useAuthSettings } from '../AuthSettings/hooks/useAuthSettings';
import { useUserSettings } from '../UserSettings/hooks/useUserSettings';
import settingsService from "../services/settingsService";
import generalSettingsService from "../services/generalSettingsService";
import authSettingsService from "../services/authSettingsService";
import { settingsCacheService } from '../services/settingsCacheService';
import { settingsErrorService } from '../services/settingsErrorService';
import { settingsOptimizationService } from '../services/settingsOptimizationService';

// Mock do apiClient
jest.mock("@/services/api", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

// Mock do useNotification
jest.mock("@/hooks/useNotification", () => ({
  notify: jest.fn(),
}));

describe("Settings Module Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    settingsCacheService.clear();

  });

  describe("SettingsService", () => {
    it("should get settings successfully", async () => {
      const mockSettings = {
        general: { theme: "dark", language: "pt-BR" },
        auth: { twoFactorEnabled: true, sessionTimeout: 30 },};

      jest
        .spyOn(generalSettingsService, "getGeneralSettings")
        .mockResolvedValue({
          success: true,
          data: mockSettings.general,
        });

      jest.spyOn(authSettingsService, "getAuthSettings").mockResolvedValue({
        success: true,
        data: mockSettings.auth,
      });

      const result = await settingsService.getSettings();

      expect(result.success).toBe(true);

      expect(result.data).toEqual(mockSettings);

    });

    it("should handle errors gracefully", async () => {
      jest
        .spyOn(generalSettingsService, "getGeneralSettings")
        .mockRejectedValue(new Error("Network error"));

      const result = await settingsService.getSettings();

      expect(result.success).toBe(false);

      expect(result.error).toBeDefined();

    });

    it("should update setting successfully", async () => {
      jest
        .spyOn(generalSettingsService, "updateGeneralSetting")
        .mockResolvedValue({
          success: true,
          data: { theme: "light" },
        });

      const result = await settingsService.updateSetting("theme", "light");

      expect(result.success).toBe(true);

      expect(result.data).toEqual({ theme: "light" });

    });

    it("should validate setting before update", async () => {
      jest
        .spyOn(settingsOptimizationService, "validateSetting")
        .mockReturnValue({
          isValid: false,
          error: "Invalid value",
        });

      const result = await settingsService.updateSetting("theme", "invalid");

      expect(result.success).toBe(false);

      expect(result.error).toBe("Invalid value");

    });

    it("should cache settings after successful fetch", async () => {
      const mockSettings = { theme: "dark"};

      jest
        .spyOn(generalSettingsService, "getGeneralSettings")
        .mockResolvedValue({
          success: true,
          data: mockSettings,
        });

      jest.spyOn(authSettingsService, "getAuthSettings").mockResolvedValue({
        success: true,
        data: {},
      });

      await settingsService.getSettings();

      const cachedSettings = settingsCacheService.getCachedSettings({});

      expect(cachedSettings).toBeDefined();

    });

    it("should invalidate cache after update", async () => {
      jest
        .spyOn(generalSettingsService, "updateGeneralSetting")
        .mockResolvedValue({
          success: true,
          data: { theme: "light" },
        });

      jest
        .spyOn(settingsOptimizationService, "validateSetting")
        .mockReturnValue({
          isValid: true,
        });

      // Cache a setting first
      settingsCacheService.cacheSetting("theme", "dark");

      await settingsService.updateSetting("theme", "light");

      const cachedSetting = settingsCacheService.getCachedSetting("theme");

      expect(cachedSetting).toBeNull();

    });

  });

  describe("GeneralSettingsService", () => {
    it("should get general settings", async () => {
      const mockSettings = { theme: "dark", language: "pt-BR"};

      const apiClient = require("@/services/api");

      apiClient.get.mockResolvedValue({ data: mockSettings });

      const result = await generalSettingsService.getGeneralSettings();

      expect(result.success).toBe(true);

      expect(result.data).toEqual(mockSettings);

    });

    it("should update general setting", async () => {
      const mockResponse = { theme: "light"};

      const apiClient = require("@/services/api");

      apiClient.put.mockResolvedValue({ data: mockResponse });

      const result = await generalSettingsService.updateGeneralSetting(
        "theme",
        "light",);

      expect(result.success).toBe(true);

      expect(result.data).toEqual(mockResponse);

    });

    it("should get system settings", async () => {
      const mockSettings = { maintenanceMode: false, debugMode: true};

      const apiClient = require("@/services/api");

      apiClient.get.mockResolvedValue({ data: mockSettings });

      const result = await generalSettingsService.getSystemSettings();

      expect(result.success).toBe(true);

      expect(result.data).toEqual(mockSettings);

    });

    it("should enable maintenance mode", async () => {
      const mockResponse = { maintenanceMode: true};

      const apiClient = require("@/services/api");

      apiClient.post.mockResolvedValue({ data: mockResponse });

      const result = await generalSettingsService.enableMaintenanceMode();

      expect(result.success).toBe(true);

      expect(result.data).toEqual(mockResponse);

    });

    it("should clear cache", async () => {
      const mockResponse = { cleared: true};

      const apiClient = require("@/services/api");

      apiClient.post.mockResolvedValue({ data: mockResponse });

      const result = await generalSettingsService.clearCache();

      expect(result.success).toBe(true);

      expect(result.data).toEqual(mockResponse);

    });

  });

  describe("AuthSettingsService", () => {
    it("should get auth settings", async () => {
      const mockSettings = { twoFactorEnabled: true, sessionTimeout: 30};

      const apiClient = require("@/services/api");

      apiClient.get.mockResolvedValue({ data: mockSettings });

      const result = await authSettingsService.getAuthSettings();

      expect(result.success).toBe(true);

      expect(result.data).toEqual(mockSettings);

    });

    it("should update auth setting", async () => {
      const mockResponse = { twoFactorEnabled: true};

      const apiClient = require("@/services/api");

      apiClient.put.mockResolvedValue({ data: mockResponse });

      const result = await authSettingsService.updateAuthSetting(
        "twoFactorEnabled",
        true,);

      expect(result.success).toBe(true);

      expect(result.data).toEqual(mockResponse);

    });

    it("should enable 2FA", async () => {
      const mockResponse = { twoFactorEnabled: true};

      const apiClient = require("@/services/api");

      apiClient.post.mockResolvedValue({ data: mockResponse });

      const result = await authSettingsService.enable2FA();

      expect(result.success).toBe(true);

      expect(result.data).toEqual(mockResponse);

    });

    it("should get OAuth settings", async () => {
      const mockSettings = {
        google: { enabled: true },
        facebook: { enabled: false },};

      const apiClient = require("@/services/api");

      apiClient.get.mockResolvedValue({ data: mockSettings });

      const result = await authSettingsService.getOAuthSettings();

      expect(result.success).toBe(true);

      expect(result.data).toEqual(mockSettings);

    });

    it("should enable OAuth provider", async () => {
      const mockResponse = { google: { enabled: true } ;

      const apiClient = require("@/services/api");

      apiClient.post.mockResolvedValue({ data: mockResponse });

      const result = await authSettingsService.enableOAuth("google");

      expect(result.success).toBe(true);

      expect(result.data).toEqual(mockResponse);

    });

  });

  describe("SettingsCacheService", () => {
    it("should cache and retrieve settings", () => {
      const mockSettings = { theme: "dark"};

      const filters = { category: "general"};

      settingsCacheService.cacheSettings(filters, mockSettings);

      const cachedSettings = settingsCacheService.getCachedSettings(filters);

      expect(cachedSettings).toEqual(mockSettings);

    });

    it("should cache and retrieve individual setting", () => {
      const mockSetting = { theme: "dark"};

      const key = "theme";

      settingsCacheService.cacheSetting(key, mockSetting);

      const cachedSetting = settingsCacheService.getCachedSetting(key);

      expect(cachedSetting).toEqual(mockSetting);

    });

    it("should invalidate setting cache", () => {
      const mockSetting = { theme: "dark"};

      const key = "theme";

      settingsCacheService.cacheSetting(key, mockSetting);

      settingsCacheService.invalidateSetting(key);

      const cachedSetting = settingsCacheService.getCachedSetting(key);

      expect(cachedSetting).toBeNull();

    });

    it("should clear all cache", () => {
      const mockSettings = { theme: "dark"};

      const filters = { category: "general"};

      settingsCacheService.cacheSettings(filters, mockSettings);

      settingsCacheService.clear();

      const cachedSettings = settingsCacheService.getCachedSettings(filters);

      expect(cachedSettings).toBeNull();

    });

    it("should provide cache info", () => {
      const mockSettings = { theme: "dark"};

      const filters = { category: "general"};

      settingsCacheService.cacheSettings(filters, mockSettings);

      const cacheInfo = settingsCacheService.getCacheInfo();

      expect(cacheInfo.totalEntries).toBeGreaterThan(0);

      expect(cacheInfo.totalSize).toBeGreaterThan(0);

    });

  });

  describe("SettingsErrorService", () => {
    it("should handle network errors", () => {
      const networkError = new Error("Network error");

      const result = settingsErrorService.handleError(networkError);

      expect(result.success).toBe(false);

      expect(result.error).toBe("Network error");

    });

    it("should handle validation errors", () => {
      const validationError = new Error("Validation failed");

      const result = settingsErrorService.handleError(validationError);

      expect(result.success).toBe(false);

      expect(result.error).toBe("Validation failed");

    });

    it("should handle any errors", () => {
      const anyError = new Error("Unknown error");

      const result = settingsErrorService.handleError(anyError);

      expect(result.success).toBe(false);

      expect(result.error).toBe("Unknown error");

    });

  });

  describe("SettingsOptimizationService", () => {
    it("should validate setting correctly", () => {
      const result = settingsOptimizationService.validateSetting(
        "theme",
        "dark",);

      expect(result.isValid).toBe(true);

    });

    it("should reject invalid setting", () => {
      const result = settingsOptimizationService.validateSetting("theme", "");

      expect(result.isValid).toBe(false);

      expect(result.error).toBeDefined();

    });

    it("should format data for export", () => {
      const mockData = { theme: "dark", language: "pt-BR"};

      const result = settingsOptimizationService.formatForExport(
        mockData,
        "json",);

      expect(result).toBeDefined();

    });

    it("should validate import data", () => {
      const mockData = [{ key: "theme", value: "dark" }];
      const result = settingsOptimizationService.validateImportData(mockData);

      expect(result.isValid).toBe(true);

    });

  });

  describe("useSettings Hook", () => {
    it("should initialize with default state", () => {
      const { result } = renderHook(() => useSettings());

      expect(result.current.loading).toBe(false);

      expect(result.current.error).toBeNull();

      expect(result.current.activeCategory).toBe("general");

    });

    it("should provide consolidated stats", () => {
      const { result } = renderHook(() => useSettings());

      const stats = result.current.stats;
      expect(stats).toBeDefined();

      expect(stats.totalSettings).toBeGreaterThanOrEqual(0);

      expect(stats.totalCategories).toBeGreaterThanOrEqual(0);

    });

    it("should handle category change", () => {
      const { result } = renderHook(() => useSettings());

      act(() => {
        result.current.setActiveCategory("auth");

      });

      expect(result.current.activeCategory).toBe("auth");

    });

  });

  describe("Integration Tests", () => {
    it("should handle complete settings workflow", async () => {
      const mockSettings = { theme: "dark"};

      jest
        .spyOn(generalSettingsService, "getGeneralSettings")
        .mockResolvedValue({
          success: true,
          data: mockSettings,
        });

      jest.spyOn(authSettingsService, "getAuthSettings").mockResolvedValue({
        success: true,
        data: {},
      });

      jest
        .spyOn(generalSettingsService, "updateGeneralSetting")
        .mockResolvedValue({
          success: true,
          data: { theme: "light" },
        });

      // Get settings
      const getResult = await settingsService.getSettings();

      expect(getResult.success).toBe(true);

      // Update setting
      const updateResult = await settingsService.updateSetting(
        "theme",
        "light",);

      expect(updateResult.success).toBe(true);

      // Verify cache invalidation
      const cachedSettings = settingsCacheService.getCachedSettings({});

      expect(cachedSettings).toBeNull();

    });

    it("should handle multiple settings update", async () => {
      jest
        .spyOn(generalSettingsService, "updateGeneralSetting")
        .mockResolvedValue({
          success: true,
          data: {},
        });

      const settings = {
        theme: "light",
        language: "en-US",};

      const result = await settingsService.updateMultipleSettings(settings);

      expect(result.success).toBe(true);

      expect(result.data?.results).toHaveLength(2);

    });

  });

  describe("Performance Tests", () => {
    it("should handle large settings efficiently", async () => {
      const largeSettings = {};

      for (let i = 0; i < 1000; i++) {
        largeSettings[`setting_${i}`] = `value_${i}`;
      }

      jest
        .spyOn(generalSettingsService, "getGeneralSettings")
        .mockResolvedValue({
          success: true,
          data: largeSettings,
        });

      jest.spyOn(authSettingsService, "getAuthSettings").mockResolvedValue({
        success: true,
        data: {},
      });

      const startTime = performance.now();

      const result = await settingsService.getSettings();

      const endTime = performance.now();

      expect(result.success).toBe(true);

      expect(endTime - startTime).toBeLessThan(1000); // Should complete in less than 1 second
    });

    it("should handle rapid cache operations efficiently", () => {
      const startTime = performance.now();

      // Perform 1000 cache operations
      for (let i = 0; i < 1000; i++) {
        settingsCacheService.cacheSetting(`key_${i}`, `value_${i}`);

      }

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // Should complete in less than 100ms
    });

  });

});
