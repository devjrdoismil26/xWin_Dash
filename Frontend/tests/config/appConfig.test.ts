import { appConfig } from '@/config/appConfig';

describe('App Config', () => {
  it('should have app name', () => {
    expect(appConfig.appName).toBeDefined();
    expect(typeof appConfig.appName).toBe('string');
  });

  it('should have API URL', () => {
    expect(appConfig.apiUrl).toBeDefined();
    expect(typeof appConfig.apiUrl).toBe('string');
  });

  it('should have environment', () => {
    expect(appConfig.environment).toBeDefined();
    expect(['development', 'production', 'test']).toContain(appConfig.environment);
  });

  it('should have feature flags', () => {
    expect(appConfig.features).toBeDefined();
    expect(typeof appConfig.features).toBe('object');
  });
});
