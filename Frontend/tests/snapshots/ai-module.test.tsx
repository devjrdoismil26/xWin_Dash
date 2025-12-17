import { render } from '@testing-library/react';
import { ChatInterface } from '@/modules/AI/components/ChatInterface';
import { MessageList } from '@/modules/AI/components/MessageList';
import { ProviderSelector } from '@/modules/AI/components/ProviderSelector';

describe('AI Module Snapshots', () => {
  it('should match ChatInterface snapshot', () => {
    const { container } = render(<ChatInterface />);
    expect(container).toMatchSnapshot();
  });

  it('should match MessageList snapshot', () => {
    const messages = [{ id: '1', content: 'Hello', role: 'user' }];
    const { container } = render(<MessageList messages={messages} />);
    expect(container).toMatchSnapshot();
  });

  it('should match ProviderSelector snapshot', () => {
    const { container } = render(<ProviderSelector onSelect={jest.fn()} />);
    expect(container).toMatchSnapshot();
  });
});
