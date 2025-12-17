import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from '@/shared/components/ui/Pagination';

describe('Pagination', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();

  });

  it('should render pagination buttons', () => {
    render(
      <Pagination 
        currentPage={ 1 }
        totalPages={ 5 }
        onPageChange={ mockOnChange }
      / />);

    expect(screen.getByText('1')).toBeInTheDocument();

    expect(screen.getByText('5')).toBeInTheDocument();

  });

  it('should call onChange when page clicked', () => {
    render(
      <Pagination 
        currentPage={ 1 }
        totalPages={ 5 }
        onPageChange={ mockOnChange }
      / />);

    fireEvent.click(screen.getByText('2'));

    expect(mockOnChange).toHaveBeenCalledWith(2);

  });

  it('should disable previous on first page', () => {
    render(
      <Pagination 
        currentPage={ 1 }
        totalPages={ 5 }
        onPageChange={ mockOnChange }
      / />);

    const prevButton = screen.getByRole('button', { name: /anterior/i });

    expect(prevButton).toBeDisabled();

  });

  it('should disable next on last page', () => {
    render(
      <Pagination 
        currentPage={ 5 }
        totalPages={ 5 }
        onPageChange={ mockOnChange }
      / />);

    const nextButton = screen.getByRole('button', { name: /próximo/i });

    expect(nextButton).toBeDisabled();

  });

});
