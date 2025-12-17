import { routes } from '@/config/routes';

describe('Routes Config', () => {
  it('should have dashboard route', () => {
    expect(routes.dashboard).toBeDefined();
    expect(routes.dashboard).toBe('/dashboard');
  });

  it('should have products route', () => {
    expect(routes.products).toBeDefined();
  });

  it('should have users route', () => {
    expect(routes.users).toBeDefined();
  });

  it('should have all module routes', () => {
    const expectedRoutes = [
      'dashboard', 'products', 'users', 'projects', 'leads',
      'ai', 'analytics', 'aura', 'emailmarketing', 'socialbuffer',
      'workflows', 'settings', 'media', 'adstool', 'activity'
    ];
    expectedRoutes.forEach(route => {
      expect(routes[route]).toBeDefined();
    });
  });
});
