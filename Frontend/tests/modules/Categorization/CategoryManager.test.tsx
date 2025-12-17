import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { CategoryManager } from '@/modules/Categorization/components/CategoryManager';

describe('CategoryManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render category list', async () => {
    render(<CategoryManager />);
    
    await waitFor(() => {
      expect(screen.getByText(/categories/i)).toBeInTheDocument();
    });
  });

  it('should allow creating new category', async () => {
    render(<CategoryManager />);
    
    const createButton = screen.getByRole('button', { name: /create category/i });
    expect(createButton).toBeInTheDocument();
  });

  it('should allow editing category', async () => {
    render(<CategoryManager />);
    
    // Test edit functionality
    expect(screen.queryByRole('button', { name: /edit/i })).toBeInTheDocument();
  });

  it('should allow deleting category', async () => {
    render(<CategoryManager />);
    
    // Test delete functionality
    expect(screen.queryByRole('button', { name: /delete/i })).toBeInTheDocument();
  });
});
