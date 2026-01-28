import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('Basic Rendering Tests', () => {
  it('renders simple component without crashing', () => {
    const SimpleComponent = () => <div data-testid="simple">Hello World</div>;
    
    render(<SimpleComponent />);
    expect(screen.getByTestId('simple')).toBeInTheDocument();
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('handles props correctly', () => {
    const PropsComponent = ({ title, children }: { title: string; children: React.ReactNode }) => (
      <div>
        <h1 data-testid="title">{title}</h1>
        <div data-testid="content">{children}</div>
      </div>
    );
    
    render(
      <PropsComponent title="Test Title">
        <span>Test Content</span>
      </PropsComponent>
    );

    expect(screen.getByTestId('title')).toHaveTextContent('Test Title');
    expect(screen.getByTestId('content')).toHaveTextContent('Test Content');
  });

  it('renders conditional content', () => {
    const ConditionalComponent = ({ show }: { show: boolean }) => (
      <div>
        {show && <div data-testid="conditional">Conditional Content</div>}
        <div data-testid="always">Always Visible</div>
      </div>
    );

    const { rerender } = render(<ConditionalComponent show={false} />);
    expect(screen.queryByTestId('conditional')).not.toBeInTheDocument();
    expect(screen.getByTestId('always')).toBeInTheDocument();
    
    rerender(<ConditionalComponent show={true} />);
    expect(screen.getByTestId('conditional')).toBeInTheDocument();
    expect(screen.getByTestId('always')).toBeInTheDocument();
  });
});
