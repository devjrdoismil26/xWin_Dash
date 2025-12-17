import { 
  productSchema, 
  userSchema, 
  projectSchema,
  leadSchema 
} from '@/schemas';

describe('Schema Validation', () => {
  describe('Product Schema', () => {
    it('should validate valid product', () => {
      const validProduct = { name: 'Test', price: 100, stock: 10 };
      expect(() => productSchema.parse(validProduct)).not.toThrow();
    });

    it('should reject invalid product', () => {
      const invalidProduct = { name: '', price: -1 };
      expect(() => productSchema.parse(invalidProduct)).toThrow();
    });
  });

  describe('User Schema', () => {
    it('should validate valid user', () => {
      const validUser = { name: 'John', email: 'john@test.com', role: 'admin' };
      expect(() => userSchema.parse(validUser)).not.toThrow();
    });

    it('should reject invalid email', () => {
      const invalidUser = { name: 'John', email: 'invalid', role: 'admin' };
      expect(() => userSchema.parse(invalidUser)).toThrow();
    });
  });

  describe('Project Schema', () => {
    it('should validate valid project', () => {
      const validProject = { name: 'Test', status: 'active', progress: 50 };
      expect(() => projectSchema.parse(validProject)).not.toThrow();
    });
  });

  describe('Lead Schema', () => {
    it('should validate valid lead', () => {
      const validLead = { name: 'John', email: 'john@test.com', status: 'new' };
      expect(() => leadSchema.parse(validLead)).not.toThrow();
    });
  });
});
