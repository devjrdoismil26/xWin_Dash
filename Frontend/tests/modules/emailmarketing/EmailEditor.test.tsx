import { render, fireEvent } from '@testing-library/react';
import { EmailEditor } from '@/modules/EmailMarketing/components/EmailEditor';

describe('EmailMarketing - EmailEditor', () => {
  it('should render editor', () => {
    const { container } = render(<EmailEditor />);
    expect(container.querySelector('[data-testid="email-editor"]')).toBeInTheDocument();
  });

  it('should handle content change', () => {
    const onChange = jest.fn();
    const { container } = render(<EmailEditor onChange={onChange} />);
    const editor = container.querySelector('[contenteditable="true"]');
    fireEvent.input(editor, { target: { innerHTML: '<p>Test content</p>' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('should support rich text formatting', () => {
    const { getByRole } = render(<EmailEditor />);
    expect(getByRole('button', { name: /bold/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /italic/i })).toBeInTheDocument();
  });
});
