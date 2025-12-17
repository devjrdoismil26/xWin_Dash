/**
 * Testes unitários para operações de notificações de usuários
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
import { userNotificationsService } from '../../services/userNotificationsService';

const mockApiClient = apiClient as any;

describe("User Notifications Operations", () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  describe("userNotificationsService", () => {
    it("deve enviar notificação", async () => {
      const notificationData = {
        title: "Bem-vindo",
        message: "Bem-vindo ao sistema",
        type: "info",
        user_ids: ["1", "2"],};

      mockApiClient.post.mockResolvedValueOnce({
        data: {
          id: "1",
          ...notificationData,
          sent_at: new Date().toISOString(),
        },
      });

      const result =
        await userNotificationsService.sendNotification(notificationData);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        "/api/notifications",
        notificationData,);

      expect(result).toHaveProperty("id", "1");

      expect(result.title).toBe("Bem-vindo");

    });

    it("deve buscar notificações do usuário", async () => {
      const userId = "1";
      const filters = { unread_only: true};

      const mockNotifications = [
        {
          id: "1",
          title: "Nova mensagem",
          message: "Você tem uma nova mensagem",
          is_read: false,
        },
        {
          id: "2",
          title: "Atualização",
          message: "Sistema atualizado",
          is_read: false,
        },
      ];

      mockApiClient.get.mockResolvedValueOnce({
        data: mockNotifications,
      });

      const result = await userNotificationsService.getUserNotifications(
        userId,
        filters,);

      expect(mockApiClient.get).toHaveBeenCalledWith(
        `/api/users/${userId}/notifications`,
        { params: filters },);

      expect(result).toHaveLength(2);

      expect(result.every((n) => !n.is_read)).toBe(true);

    });

    it("deve marcar notificação como lida", async () => {
      const notificationId = "1";

      mockApiClient.put.mockResolvedValueOnce({
        data: { id: notificationId, is_read: true },
      });

      const result = await userNotificationsService.markAsRead(notificationId);

      expect(mockApiClient.put).toHaveBeenCalledWith(
        `/api/notifications/${notificationId}/read`,);

      expect(result.is_read).toBe(true);

    });

    it("deve marcar todas as notificações como lidas", async () => {
      const userId = "1";

      mockApiClient.put.mockResolvedValueOnce({
        data: { updated_count: 5 },
      });

      const result = await userNotificationsService.markAllAsRead(userId);

      expect(mockApiClient.put).toHaveBeenCalledWith(
        `/api/users/${userId}/notifications/read-all`,);

      expect(result.updated_count).toBe(5);

    });

    it("deve deletar notificação", async () => {
      const notificationId = "1";

      mockApiClient.delete.mockResolvedValueOnce({
        data: { success: true },
      });

      const result =
        await userNotificationsService.deleteNotification(notificationId);

      expect(mockApiClient.delete).toHaveBeenCalledWith(
        `/api/notifications/${notificationId}`,);

      expect(result.success).toBe(true);

    });

    it("deve buscar preferências de notificação", async () => {
      const userId = "1";
      const mockPreferences = {
        email_notifications: true,
        push_notifications: false,
        sms_notifications: false,};

      mockApiClient.get.mockResolvedValueOnce({
        data: mockPreferences,
      });

      const result =
        await userNotificationsService.getNotificationPreferences(userId);

      expect(mockApiClient.get).toHaveBeenCalledWith(
        `/api/users/${userId}/notification-preferences`,);

      expect(result.email_notifications).toBe(true);

      expect(result.push_notifications).toBe(false);

    });

    it("deve atualizar preferências de notificação", async () => {
      const userId = "1";
      const preferences = {
        email_notifications: false,
        push_notifications: true,};

      mockApiClient.put.mockResolvedValueOnce({
        data: { ...preferences, updated_at: new Date().toISOString() },
      });

      const result =
        await userNotificationsService.updateNotificationPreferences(
          userId,
          preferences,);

      expect(mockApiClient.put).toHaveBeenCalledWith(
        `/api/users/${userId}/notification-preferences`,
        preferences,);

      expect(result.email_notifications).toBe(false);

      expect(result.push_notifications).toBe(true);

    });

  });

});
