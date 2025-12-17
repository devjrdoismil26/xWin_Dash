import { render } from '@testing-library/react';
import { ThemeProvider } from '@/shared/components/ThemeProvider';

describe('ThemeProvider', () => {
  it('should render children', () => {
    const { getByText } = render(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>
    );
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('should apply default theme', () => {
    const { container } = render(
      <ThemeProvider>
        <div>Content</div>
      </ThemeProvider>
    );
    expect(container.firstChild).toHaveClass('theme-light');
  });

  it('should apply dark theme', () => {
    const { container } = render(
      <ThemeProvider defaultTheme="dark">
        <div>Content</div>
      </ThemeProvider>
    );
    expect(container.firstChild).toHaveClass('theme-dark');
  });
});
