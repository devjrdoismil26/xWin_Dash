import { render, fireEvent } from '@testing-library/react';
import { ConversationList } from '@/modules/Aura/components/ConversationList';

describe('Aura - ConversationList', () => {
  const mockConversations = [
    { id: '1', name: 'John Doe', lastMessage: 'Hello', unread: 2, timestamp: new Date() },
    { id: '2', name: 'Jane Smith', lastMessage: 'Hi there', unread: 0, timestamp: new Date() },
  ];

  it('should render conversation list', () => {
    const { getByText } = render(<ConversationList conversations={mockConversations} />);
    expect(getByText('John Doe')).toBeInTheDocument();
    expect(getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should show unread count', () => {
    const { getByText } = render(<ConversationList conversations={mockConversations} />);
    expect(getByText('2')).toBeInTheDocument();
  });

  it('should handle conversation click', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      <ConversationList conversations={mockConversations} onSelect={onSelect} />
    );
    fireEvent.click(getByText('John Doe'));
    expect(onSelect).toHaveBeenCalledWith('1');
  });

  it('should render empty state', () => {
    const { getByText } = render(<ConversationList conversations={[]} />);
    expect(getByText(/no conversations/i)).toBeInTheDocument();
  });
});
