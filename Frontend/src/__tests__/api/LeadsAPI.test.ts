import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '@/api/client';
import { leadsAPI } from '@/api/leads';

vi.mock('@/api/client');

describe('Leads API', () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  describe('getLeads', () => {
    it('should fetch leads with filters', async () => {
      const mockLeads = [
        { id: '1', name: 'Lead 1', email: 'lead1@test.com', status: 'new' },
        { id: '2', name: 'Lead 2', email: 'lead2@test.com', status: 'qualified' },
      ];

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockLeads });

      const result = await leadsAPI.getLeads({ status: 'new', page: 1 });

      expect(apiClient.get).toHaveBeenCalledWith('/leads', {
        params: { status: 'new', page: 1 },
      });

      expect(result).toEqual(mockLeads);

    });

    it('should handle API errors', async () => {
      vi.mocked(apiClient.get).mockRejectedValue(new Error('Network error'));

      await expect(leadsAPI.getLeads()).rejects.toThrow('Network error');

    });

  });

  describe('createLead', () => {
    it('should create a new lead', async () => {
      const newLead = {
        name: 'New Lead',
        email: 'new@test.com',
        phone: '+5511999999999',
        project_id: 'project-1',};

      const mockResponse = { id: '3', ...newLead, status: 'new'};

      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

      const result = await leadsAPI.createLead(newLead);

      expect(apiClient.post).toHaveBeenCalledWith('/leads', newLead);

      expect(result).toEqual(mockResponse);

    });

    it('should validate required fields', async () => {
      const invalidLead = { name: 'Test'};

      vi.mocked(apiClient.post).mockRejectedValue({
        response: { data: { errors: { email: ['Email is required'] } },
      });

      await expect(leadsAPI.createLead(invalidLead)).rejects.toThrow();

    });

  });

  describe('updateLead', () => {
    it('should update lead data', async () => {
      const updates = { status: 'qualified', score: 85};

      const mockResponse = { id: '1', ...updates};

      vi.mocked(apiClient.put).mockResolvedValue({ data: mockResponse });

      const result = await leadsAPI.updateLead('1', updates);

      expect(apiClient.put).toHaveBeenCalledWith('/leads/1', updates);

      expect(result).toEqual(mockResponse);

    });

  });

  describe('deleteLead', () => {
    it('should delete a lead', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue({ data: { success: true } );

      await leadsAPI.deleteLead('1');

      expect(apiClient.delete).toHaveBeenCalledWith('/leads/1');

    });

  });

  describe('assignLead', () => {
    it('should assign lead to user', async () => {
      const mockResponse = { id: '1', assigned_to: 'user-1'};

      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

      const result = await leadsAPI.assignLead('1', 'user-1');

      expect(apiClient.post).toHaveBeenCalledWith('/leads/1/assign', {
        user_id: 'user-1',
      });

      expect(result).toEqual(mockResponse);

    });

  });

});
