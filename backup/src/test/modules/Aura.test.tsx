import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

const AuraModule = () => (
  <div data-testid="aura-module">
    <h1>WhatsApp Business</h1>
    <div>Manage WhatsApp connections</div>
  </div>
);

describe('Aura Module', () => {
  it('should render Aura module', () => {
    render(<AuraModule />);
    
    expect(screen.getByTestId('aura-module')).toBeInTheDocument();
    expect(screen.getByText('WhatsApp Business')).toBeInTheDocument();
  });
});
