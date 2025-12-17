import { universeApi } from '@/api/universe';

describe('Universe API', () => {
  it('should have getUniverses method', () => {
    expect(universeApi.getUniverses).toBeDefined();
    expect(typeof universeApi.getUniverses).toBe('function');
  });

  it('should have createUniverse method', () => {
    expect(universeApi.createUniverse).toBeDefined();
    expect(typeof universeApi.createUniverse).toBe('function');
  });

  it('should have updateUniverse method', () => {
    expect(universeApi.updateUniverse).toBeDefined();
    expect(typeof universeApi.updateUniverse).toBe('function');
  });

  it('should have deleteUniverse method', () => {
    expect(universeApi.deleteUniverse).toBeDefined();
    expect(typeof universeApi.deleteUniverse).toBe('function');
  });
});
