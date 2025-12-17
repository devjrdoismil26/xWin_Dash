import { render } from '@testing-library/react';
import { ProjectCard } from '@/modules/Projects/components/ProjectCard';

describe('Edge Cases: Projects Module', () => {
  it('should handle 100% progress', () => {
    const project = { id: '1', name: 'Test', status: 'completed', progress: 100 };
    const { getByText } = render(<ProjectCard project={project} />);
    expect(getByText(/100%/)).toBeInTheDocument();
  });

  it('should handle negative progress', () => {
    const project = { id: '1', name: 'Test', status: 'active', progress: -10 };
    const { container } = render(<ProjectCard project={project} />);
    expect(container.textContent).toContain('0%');
  });
});
