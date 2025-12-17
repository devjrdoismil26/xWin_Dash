import { render } from '@testing-library/react';
import { ConversationList } from '@/modules/Aura/components/ConversationList';
import { MessageInput } from '@/modules/Aura/components/MessageInput';
import { ConversationItem } from '@/modules/Aura/components/ConversationItem';

describe('Aura Module Snapshots', () => {
  it('should match ConversationList snapshot', () => {
    const { container } = render(<ConversationList conversations={[]} />);
    expect(container).toMatchSnapshot();
  });

  it('should match MessageInput snapshot', () => {
    const { container } = render(<MessageInput onSend={jest.fn()} />);
    expect(container).toMatchSnapshot();
  });

  it('should match ConversationItem snapshot', () => {
    const conv = { id: '1', name: 'John', lastMessage: 'Hello', unread: 2 };
    const { container } = render(<ConversationItem conversation={conv} />);
    expect(container).toMatchSnapshot();
  });
});
