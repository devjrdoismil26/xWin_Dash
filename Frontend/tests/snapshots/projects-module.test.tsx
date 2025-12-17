import { render } from '@testing-library/react';
import { ProjectsList } from '@/modules/Projects/components/ProjectsList';
import { ProjectForm } from '@/modules/Projects/components/ProjectForm';
import { ProjectCard } from '@/modules/Projects/components/ProjectCard';

describe('Projects Module Snapshots', () => {
  it('should match ProjectsList snapshot', () => {
    const { container } = render(<ProjectsList projects={[]} />);
    expect(container).toMatchSnapshot();
  });

  it('should match ProjectForm snapshot', () => {
    const { container } = render(<ProjectForm onSubmit={jest.fn()} />);
    expect(container).toMatchSnapshot();
  });

  it('should match ProjectCard snapshot', () => {
    const project = { id: '1', name: 'Test', status: 'active', progress: 50 };
    const { container } = render(<ProjectCard project={project} />);
    expect(container).toMatchSnapshot();
  });
});
