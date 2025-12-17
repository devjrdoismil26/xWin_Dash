import { theme } from '@/config/theme';

describe('Theme Config', () => {
  it('should have colors defined', () => {
    expect(theme.colors).toBeDefined();
    expect(theme.colors.primary).toBeDefined();
    expect(theme.colors.secondary).toBeDefined();
  });

  it('should have spacing defined', () => {
    expect(theme.spacing).toBeDefined();
  });

  it('should have typography defined', () => {
    expect(theme.typography).toBeDefined();
    expect(theme.typography.fontFamily).toBeDefined();
  });

  it('should have breakpoints defined', () => {
    expect(theme.breakpoints).toBeDefined();
    expect(theme.breakpoints.mobile).toBeDefined();
    expect(theme.breakpoints.tablet).toBeDefined();
    expect(theme.breakpoints.desktop).toBeDefined();
  });
});
