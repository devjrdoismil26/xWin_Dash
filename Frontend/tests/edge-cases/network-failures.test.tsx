import { render, waitFor } from '@testing-library/react';
import { ProductsPage } from '@/modules/Products/pages/ProductsPage';
import { api } from '@/lib/api';

jest.mock('@/lib/api');

describe('Edge Cases: Network Failures', () => {
  it('should handle network errors', async () => {
    api.get.mockRejectedValue(new Error('Network error'));
    const { getByText } = render(<ProductsPage />);
    await waitFor(() => expect(getByText(/error/i)).toBeInTheDocument());
  });
});
