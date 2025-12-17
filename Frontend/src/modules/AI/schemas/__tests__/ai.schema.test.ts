import { describe, it, expect } from 'vitest';
import { aiRequestSchema, aiImageGenerationSchema, aiTextAnalysisSchema } from '../ai.schema';

describe('AI Schema', () => {
  describe('aiRequestSchema', () => {
    it('should validate valid AI request', () => {
      const valid = {
        messages: [{ role: 'user' as const, content: 'Hello' }],};

      expect(() => aiRequestSchema.parse(valid)).not.toThrow();

    });

    it('should apply defaults', () => {
      const result = aiRequestSchema.parse({
        messages: [{ role: 'user' as const, content: 'Test' }],
      });

      expect(result.provider).toBe('openai');

      expect(result.temperature).toBe(0.7);

      expect(result.max_tokens).toBe(2000);

    });

    it('should reject invalid temperature', () => {
      const invalid = {
        messages: [{ role: 'user' as const, content: 'Test' }],
        temperature: 3,};

      expect(() => aiRequestSchema.parse(invalid)).toThrow();

    });

  });

  describe('aiImageGenerationSchema', () => {
    it('should validate image generation request', () => {
      const valid = { prompt: 'A beautiful sunset'};

      expect(() => aiImageGenerationSchema.parse(valid)).not.toThrow();

    });

    it('should reject empty prompt', () => {
      const invalid = { prompt: ''};

      expect(() => aiImageGenerationSchema.parse(invalid)).toThrow();

    });

  });

  describe('aiTextAnalysisSchema', () => {
    it('should validate text analysis request', () => {
      const valid = { text: 'Sample text', analysis_type: 'sentiment' as const};

      expect(() => aiTextAnalysisSchema.parse(valid)).not.toThrow();

    });

  });

});
