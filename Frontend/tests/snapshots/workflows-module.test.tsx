import { render } from '@testing-library/react';
import { WorkflowBuilder } from '@/modules/Workflows/components/WorkflowBuilder';
import { WorkflowList } from '@/modules/Workflows/components/WorkflowList';
import { ExecutionHistory } from '@/modules/Workflows/components/ExecutionHistory';

describe('Workflows Module Snapshots', () => {
  it('should match WorkflowBuilder snapshot', () => {
    const { container } = render(<WorkflowBuilder />);
    expect(container).toMatchSnapshot();
  });

  it('should match WorkflowList snapshot', () => {
    const { container } = render(<WorkflowList workflows={[]} />);
    expect(container).toMatchSnapshot();
  });

  it('should match ExecutionHistory snapshot', () => {
    const { container } = render(<ExecutionHistory executions={[]} />);
    expect(container).toMatchSnapshot();
  });
});
