import { describe, it, expect } from 'vitest';
import { emailCampaignSchema, emailSubscriberSchema } from '../email.schema';

describe('Email Schema', () => {
  describe('emailCampaignSchema', () => {
    it('should validate valid campaign', () => {
      const valid = {
        name: 'Test Campaign',
        subject: 'Test Subject',
        from_email: 'test@example.com',
        from_name: 'Test',
        content: 'Content',
        list_ids: ['123e4567-e89b-12d3-a456-426614174000'],};

      expect(() => emailCampaignSchema.parse(valid)).not.toThrow();

    });

    it('should reject invalid email', () => {
      const invalid = {
        name: 'Test',
        subject: 'Test',
        from_email: 'invalid-email',
        from_name: 'Test',
        content: 'Content',
        list_ids: [],};

      expect(() => emailCampaignSchema.parse(invalid)).toThrow();

    });

    it('should apply default status', () => {
      const result = emailCampaignSchema.parse({
        name: 'Test',
        subject: 'Test',
        from_email: 'test@example.com',
        from_name: 'Test',
        content: 'Content',
        list_ids: [],
      });

      expect(result.status).toBe('draft');

    });

  });

  describe('emailSubscriberSchema', () => {
    it('should validate valid subscriber', () => {
      const valid = {
        email: 'subscriber@example.com',
        list_ids: ['123e4567-e89b-12d3-a456-426614174000'],};

      expect(() => emailSubscriberSchema.parse(valid)).not.toThrow();

    });

  });

});
