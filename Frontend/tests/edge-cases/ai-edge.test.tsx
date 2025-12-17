import { render, waitFor } from '@testing-library/react';
import { ChatInterface } from '@/modules/AI/components/ChatInterface';

describe('Edge Cases: AI Module', () => {
  it('should handle very long messages', async () => {
    const { getByTestId } = render(<ChatInterface />);
    const input = getByTestId('chat-input');
    const longMessage = 'A'.repeat(10000);
    input.value = longMessage;
    await waitFor(() => expect(input.value.length).toBeLessThanOrEqual(5000));
  });

  it('should handle API timeout', async () => {
    const { getByText } = render(<ChatInterface />);
    await waitFor(() => expect(getByText(/timeout/i)).toBeInTheDocument(), { timeout: 6000 });
  });
});
