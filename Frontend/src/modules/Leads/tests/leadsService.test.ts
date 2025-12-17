// ========================================
// TESTES DE INTEGRAÇÃO - LEADS SERVICE
// ========================================
import { leadsService } from '../services/leadsService';
import { apiClient } from '@/services';

// Mock do apiClient
jest.mock("@/services", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

// Mock do localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

describe("Leads Service Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockLocalStorage.getItem.mockReturnValue("test-project-id");

  });

  describe("fetchLeads", () => {
    it("should fetch leads successfully", async () => {
      const mockResponse = {
        data: {
          leads: [
            {
              id: 1,
              name: "Test Lead",
              email: "test@example.com",
              status: "new",
              score: 50,
              origin: "website",
              project_id: 1,
              tags: [],
              custom_fields: {},
              created_at: "2024-01-01T00:00:00Z",
              updated_at: "2024-01-01T00:00:00Z",
            },
          ],
          pagination: {
            current_page: 1,
            total_pages: 1,
            total_items: 1,
            items_per_page: 10,
          },
        },};

      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await leadsService.fetchLeads();

      expect(result.success).toBe(true);

      expect(result.data.leads).toHaveLength(1);

      expect(result.data.leads[0].name).toBe("Test Lead");

      expect(apiClient.get).toHaveBeenCalledWith(
        "/projects/test-project-id/leads",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.stringContaining("Bearer"),
          }),
        }),);

    });

    it("should handle fetch leads error", async () => {
      (apiClient.get as jest.Mock).mockRejectedValue(
        new Error("Network error"),);

      const result = await leadsService.fetchLeads();

      expect(result.success).toBe(false);

      expect(result.data.leads).toEqual([]);

      expect(result.message).toBe("Network error");

    });

    it("should handle missing project ID", async () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = await leadsService.fetchLeads();

      expect(result.success).toBe(false);

      expect(result.message).toBe("Project ID not found");

    });

  });

  describe("createLead", () => {
    it("should create lead successfully", async () => {
      const mockLeadData = {
        name: "New Lead",
        email: "new@example.com",
        phone: "+1234567890",};

      const mockResponse = {
        data: {
          id: 2,
          ...mockLeadData,
          status: "new",
          score: 0,
          origin: "manual",
          project_id: 1,
          tags: [],
          custom_fields: {},
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },};

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await leadsService.createLead(mockLeadData);

      expect(result.success).toBe(true);

      expect(result.data.id).toBe(2);

      expect(result.data.name).toBe("New Lead");

      expect(apiClient.post).toHaveBeenCalledWith(
        "/projects/test-project-id/leads",
        mockLeadData,
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.stringContaining("Bearer"),
          }),
        }),);

    });

    it("should handle create lead error", async () => {
      const mockLeadData = {
        name: "New Lead",
        email: "new@example.com",};

      (apiClient.post as jest.Mock).mockRejectedValue(
        new Error("Validation error"),);

      const result = await leadsService.createLead(mockLeadData);

      expect(result.success).toBe(false);

      expect(result.message).toBe("Validation error");

    });

  });

  describe("updateLead", () => {
    it("should update lead successfully", async () => {
      const leadId = 1;
      const updateData = {
        name: "Updated Lead",
        status: "contacted",};

      const mockResponse = {
        data: {
          id: leadId,
          name: "Updated Lead",
          status: "contacted",
          email: "test@example.com",
          score: 50,
          origin: "website",
          project_id: 1,
          tags: [],
          custom_fields: {},
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },};

      (apiClient.put as jest.Mock).mockResolvedValue(mockResponse);

      const result = await leadsService.updateLead(leadId, updateData);

      expect(result.success).toBe(true);

      expect(result.data.name).toBe("Updated Lead");

      expect(result.data.status).toBe("contacted");

      expect(apiClient.put).toHaveBeenCalledWith(
        `/projects/test-project-id/leads/${leadId}`,
        updateData,
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.stringContaining("Bearer"),
          }),
        }),);

    });

  });

  describe("deleteLead", () => {
    it("should delete lead successfully", async () => {
      const leadId = 1;

      (apiClient.delete as jest.Mock).mockResolvedValue({
        data: { success: true },
      });

      const result = await leadsService.deleteLead(leadId);

      expect(result.success).toBe(true);

      expect(apiClient.delete).toHaveBeenCalledWith(
        `/projects/test-project-id/leads/${leadId}`,
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.stringContaining("Bearer"),
          }),
        }),);

    });

  });

  describe("fetchLeadMetrics", () => {
    it("should fetch metrics successfully", async () => {
      const mockResponse = {
        data: {
          total_leads: 100,
          new_today: 5,
          conversion_rate: 15.5,
          average_score: 65.2,
        },};

      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await leadsService.fetchLeadMetrics();

      expect(result.success).toBe(true);

      expect(result.data.total_leads).toBe(100);

      expect(result.data.conversion_rate).toBe(15.5);

      expect(apiClient.get).toHaveBeenCalledWith(
        "/projects/test-project-id/leads/metrics",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.stringContaining("Bearer"),
          }),
        }),);

    });

  });

  describe("fetchLeadAnalytics", () => {
    it("should fetch analytics successfully", async () => {
      const mockResponse = {
        data: {
          leads_by_status: {
            new: 20,
            contacted: 30,
            qualified: 25,
            converted: 15,
            lost: 10,
          },
          leads_by_source: {
            website: 40,
            social: 25,
            email: 20,
            referral: 15,
          },
          conversion_funnel: {
            leads: 100,
            contacted: 80,
            qualified: 50,
            converted: 15,
          },
        },};

      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await leadsService.fetchLeadAnalytics();

      expect(result.success).toBe(true);

      expect(result.data.leads_by_status).toBeDefined();

      expect(result.data.leads_by_source).toBeDefined();

      expect(result.data.conversion_funnel).toBeDefined();

      expect(apiClient.get).toHaveBeenCalledWith(
        "/projects/test-project-id/leads/analytics",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.stringContaining("Bearer"),
          }),
        }),);

    });

  });

});
