import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Mock Dashboard Component 
const Dashboard = ({ user }: { user?: { name: string } }) => (
  <div data-testid="dashboard">
    <h1>Dashboard</h1>
    {user && <p data-testid="welcome">Welcome, {user.name}!</p>}
    <div data-testid="stats">
      <p>Total Projects: 5</p>
      <p>Active Leads: 12</p>
    </div>
  </div>
);

describe('Dashboard Module', () => {
  it('renders dashboard correctly', () => {
    render(<Dashboard />);
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('stats')).toBeInTheDocument();
  });

  it('displays user welcome message when user is provided', () => {
    const user = { name: 'John Doe' };
    render(<Dashboard user={user} />);
    expect(screen.getByTestId('welcome')).toHaveTextContent('Welcome, John Doe!');
  });

  it('displays stats correctly', () => {
    render(<Dashboard />);
    expect(screen.getByText('Total Projects: 5')).toBeInTheDocument();
    expect(screen.getByText('Active Leads: 12')).toBeInTheDocument();
  });
});
