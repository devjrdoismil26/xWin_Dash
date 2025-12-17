import { render, fireEvent, waitFor } from '@testing-library/react';
import { ChatInterface } from '@/modules/Aura/components/ChatInterface';

describe('Aura - ChatInterface', () => {
  it('should render message input', () => {
    const { getByPlaceholderText } = render(<ChatInterface conversationId="1" />);
    expect(getByPlaceholderText(/type a message/i)).toBeInTheDocument();
  });

  it('should send message', async () => {
    const onSend = jest.fn();
    const { getByPlaceholderText, getByRole } = render(
      <ChatInterface conversationId="1" onSendMessage={onSend} />
    );
    
    const input = getByPlaceholderText(/type a message/i);
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(getByRole('button', { name: /send/i }));
    
    await waitFor(() => expect(onSend).toHaveBeenCalledWith('Hello'));
  });

  it('should display messages', () => {
    const messages = [
      { id: '1', content: 'Hello', sender: 'user', timestamp: new Date() },
      { id: '2', content: 'Hi there', sender: 'contact', timestamp: new Date() },
    ];
    const { getByText } = render(<ChatInterface conversationId="1" messages={messages} />);
    expect(getByText('Hello')).toBeInTheDocument();
    expect(getByText('Hi there')).toBeInTheDocument();
  });
});
