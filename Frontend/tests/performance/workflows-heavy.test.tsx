import { render } from '@testing-library/react';
import { performance } from 'perf_hooks';
import { WorkflowBuilder } from '@/modules/Workflows/components/WorkflowBuilder';

describe('Performance: Heavy Workflows', () => {
  it('should render workflow with 50 nodes in under 2s', () => {
    const nodes = Array.from({ length: 50 }, (_, i) => ({ id: `node-${i}`, type: 'action' }));
    const start = performance.now();
    render(<WorkflowBuilder nodes={nodes} />);
    const end = performance.now();
    expect(end - start).toBeLessThan(2000);
  });
});
