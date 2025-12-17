import { render } from '@testing-library/react';
import { WorkflowBuilder } from '@/modules/Workflows/components/WorkflowBuilder';

describe('Edge Cases: Workflows Module', () => {
  it('should handle circular dependencies', () => {
    const nodes = [
      { id: '1', type: 'trigger', next: '2' },
      { id: '2', type: 'action', next: '1' },
    ];
    const { getByText } = render(<WorkflowBuilder nodes={nodes} />);
    expect(getByText(/circular dependency/i)).toBeInTheDocument();
  });

  it('should handle disconnected nodes', () => {
    const nodes = [
      { id: '1', type: 'trigger' },
      { id: '2', type: 'action' },
    ];
    const { getByText } = render(<WorkflowBuilder nodes={nodes} />);
    expect(getByText(/disconnected/i)).toBeInTheDocument();
  });
});
