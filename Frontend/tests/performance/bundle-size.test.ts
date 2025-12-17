import { execSync } from 'child_process';

describe('Performance: Bundle Size', () => {
  it('should keep main bundle under 500KB', () => {
    const result = execSync('npm run build -- --json').toString();
    const stats = JSON.parse(result);
    const mainBundle = stats.assets.find((a: any) => a.name.includes('main'));
    expect(mainBundle.size).toBeLessThan(500 * 1024);
  });
});
