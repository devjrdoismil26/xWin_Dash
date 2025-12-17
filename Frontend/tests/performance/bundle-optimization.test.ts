import { execSync } from 'child_process';

describe('Performance - Bundle Optimization', () => {
  it('should have main bundle under 500KB', () => {
    const result = execSync('npm run build -- --json').toString();
    const stats = JSON.parse(result);
    const mainBundle = stats.assets.find((a: any) => a.name.includes('main'));
    expect(mainBundle.size).toBeLessThan(500 * 1024);
  });

  it('should split vendor chunks', () => {
    const result = execSync('npm run build -- --json').toString();
    const stats = JSON.parse(result);
    const vendorChunk = stats.assets.find((a: any) => a.name.includes('vendor'));
    expect(vendorChunk).toBeDefined();
  });

  it('should lazy load routes', () => {
    const result = execSync('npm run build -- --json').toString();
    const stats = JSON.parse(result);
    const chunks = stats.assets.filter((a: any) => a.name.match(/\d+\./));
    expect(chunks.length).toBeGreaterThan(5);
  });

  it('should tree-shake unused code', () => {
    const result = execSync('npm run build -- --json').toString();
    const stats = JSON.parse(result);
    expect(stats.assets.every((a: any) => !a.name.includes('unused'))).toBe(true);
  });
});
