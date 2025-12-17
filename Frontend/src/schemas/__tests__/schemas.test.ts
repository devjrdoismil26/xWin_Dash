import { describe, it, expect } from 'vitest';
import { UserSchema, ABTestSchema, ApiConfigurationSchema, DashboardMetricsSchema, ProductSchema, validateResponse, safeValidateResponse } from '../index';

describe('Zod Schemas', () => {
  describe('UserSchema', () => {
    it('should validate valid user data', () => {
      const validUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin'};

      expect(() => UserSchema.parse(validUser)).not.toThrow();

    });

    it('should reject invalid email', () => {
      const invalidUser = {
        id: 1,
        name: 'John Doe',
        email: 'invalid-email'};

      expect(() => UserSchema.parse(invalidUser)).toThrow();

    });

  });

  describe('ABTestSchema', () => {
    it('should validate valid AB test data', () => {
      const validTest = {
        id: '1',
        name: 'Test A',
        type: 'landing_page',
        target: 'page-1',
        status: 'running',
        variants: [
          { id: 'v1', name: 'Control', traffic: 50 },
          { id: 'v2', name: 'Variant A', traffic: 50 }
        ]};

      expect(() => ABTestSchema.parse(validTest)).not.toThrow();

    });

  });

  describe('ApiConfigurationSchema', () => {
    it('should validate valid API configuration', () => {
      const validConfig = {
        id: 1,
        name: 'OpenAI',
        provider: 'openai',
        credentials: { api_key: 'sk-...' },
        status: 'connected'};

      expect(() => ApiConfigurationSchema.parse(validConfig)).not.toThrow();

    });

    it('should reject invalid status', () => {
      const invalidConfig = {
        id: 1,
        name: 'OpenAI',
        provider: 'openai',
        credentials: {},
        status: 'invalid-status'};

      expect(() => ApiConfigurationSchema.parse(invalidConfig)).toThrow();

    });

  });

  describe('DashboardMetricsSchema', () => {
    it('should validate valid metrics', () => {
      const validMetrics = {
        total_users: 1000,
        active_users: 500,
        total_revenue: 50000,
        conversion_rate: 2.5};

      expect(() => DashboardMetricsSchema.parse(validMetrics)).not.toThrow();

    });

  });

  describe('ProductSchema', () => {
    it('should validate valid product', () => {
      const validProduct = {
        id: 1,
        name: 'Product A',
        price: 99.99,
        status: 'active'};

      expect(() => ProductSchema.parse(validProduct)).not.toThrow();

    });

  });

  describe('LeadSchema', () => {
    it('should validate valid lead', () => {
      const valid = { id: 1, name: 'John', email: 'john@test.com', status: 'new'};

      expect(() => validateResponse(require('../index').LeadSchema, valid)).not.toThrow();

    });

  });

  describe('WorkflowSchema', () => {
    it('should validate valid workflow', () => {
      const valid = { id: 1, name: 'Flow 1', status: 'active', trigger: 'manual', nodes: [], edges: []};

      expect(() => validateResponse(require('../index').WorkflowSchema, valid)).not.toThrow();

    });

  });

  describe('ProjectSchema', () => {
    it('should validate valid project', () => {
      const valid = { id: 1, name: 'Project A', status: 'active'};

      expect(() => validateResponse(require('../index').ProjectSchema, valid)).not.toThrow();

    });

  });

  describe('SocialPostSchema', () => {
    it('should validate valid social post', () => {
      const valid = { id: 1, content: 'Hello', platform: 'twitter', status: 'draft'};

      expect(() => validateResponse(require('../index').SocialPostSchema, valid)).not.toThrow();

    });

  });

  describe('EmailCampaignSchema', () => {
    it('should validate valid email campaign', () => {
      const valid = { id: 1, name: 'Campaign 1', subject: 'Test', status: 'draft'};

      expect(() => validateResponse(require('../index').EmailCampaignSchema, valid)).not.toThrow();

    });

  });

  describe('MediaFileSchema', () => {
    it('should validate valid media file', () => {
      const valid = { id: 1, name: 'image.jpg', type: 'image', url: 'http://test.com/img.jpg', size: 1024};

      expect(() => validateResponse(require('../index').MediaFileSchema, valid)).not.toThrow();

    });

  });

  describe('ActivityLogSchema', () => {
    it('should validate valid activity log', () => {
      const valid = { id: 1, user_id: 1, action: 'create', entity_type: 'lead', entity_id: 1, description: 'Created', created_at: '2025-01-01'};

      expect(() => validateResponse(require('../index').ActivityLogSchema, valid)).not.toThrow();

    });

  });

  describe('AIPromptSchema', () => {
    it('should validate valid AI prompt', () => {
      const valid = { id: 1, name: 'Prompt 1', prompt: 'Test prompt', model: 'gpt-4'};

      expect(() => validateResponse(require('../index').AIPromptSchema, valid)).not.toThrow();

    });

  });

  describe('AdCampaignSchema', () => {
    it('should validate valid ad campaign', () => {
      const valid = { id: 1, name: 'Ad 1', platform: 'google', status: 'active', budget: 1000};

      expect(() => validateResponse(require('../index').AdCampaignSchema, valid)).not.toThrow();

    });

  });

  describe('Helper Functions', () => {
    it('validateResponse should parse valid data', () => {
      const data = { id: 1, name: 'Test', email: 'test@example.com'};

      const result = validateResponse(UserSchema, data);

      expect(result).toEqual(data);

    });

    it('validateResponse should throw on invalid data', () => {
      const data = { id: 1, name: 'Test', email: 'invalid'};

      expect(() => validateResponse(UserSchema, data)).toThrow();

    });

    it('safeValidateResponse should return null on invalid data', () => {
      const data = { id: 1, name: 'Test', email: 'invalid'};

      const result = safeValidateResponse(UserSchema, data);

      expect(result).toBeNull();

    });

    it('safeValidateResponse should return data on valid input', () => {
      const data = { id: 1, name: 'Test', email: 'test@example.com'};

      const result = safeValidateResponse(UserSchema, data);

      expect(result).toEqual(data);

    });

  });

});
