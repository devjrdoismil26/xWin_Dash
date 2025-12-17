import { describe, it, expect } from 'vitest';
import { workflowSchema, workflowExecutionSchema } from '../workflow.schema';

describe('Workflow Schema', () => {
  describe('workflowSchema', () => {
    it('should validate valid workflow', () => {
      const valid = {
        name: 'Test Workflow',
        trigger: 'manual',
        nodes: [{ id: '1', type: 'start', position: { x: 0, y: 0 }, data: {} ],
        edges: [],};

      expect(() => workflowSchema.parse(valid)).not.toThrow();

    });

    it('should apply defaults', () => {
      const result = workflowSchema.parse({
        name: 'Test',
        trigger: 'manual',
        nodes: [],
        edges: [],
      });

      expect(result.status).toBe('draft');

      expect(result.is_template).toBe(false);

    });

  });

  describe('workflowExecutionSchema', () => {
    it('should validate execution', () => {
      const valid = {
        workflow_id: '123e4567-e89b-12d3-a456-426614174000',
        status: 'pending' as const,};

      expect(() => workflowExecutionSchema.parse(valid)).not.toThrow();

    });

  });

});
