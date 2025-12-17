import { renderHook, act } from '@testing-library/react';
import { useProjectStore } from '@/store/projectStore';

describe('projectStore', () => {
  beforeEach(() => {
    useProjectStore.setState({ currentProject: null, projects: [] });

  });

  it('should set current project', () => {
    const { result } = renderHook(() => useProjectStore());

    const mockProject = { id: '1', name: 'Test Project', slug: 'test'};

    act(() => {
      result.current.setCurrentProject(mockProject);

    });

    expect(result.current.currentProject).toEqual(mockProject);

  });

  it('should add project to list', () => {
    const { result } = renderHook(() => useProjectStore());

    const project = { id: '1', name: 'Project 1'};

    act(() => {
      result.current.addProject(project);

    });

    expect(result.current.projects).toHaveLength(1);

    expect(result.current.projects[0]).toEqual(project);

  });

  it('should remove project', () => {
    const { result } = renderHook(() => useProjectStore());

    act(() => {
      result.current.addProject({ id: '1', name: 'P1' });

      result.current.addProject({ id: '2', name: 'P2' });

      result.current.removeProject('1');

    });

    expect(result.current.projects).toHaveLength(1);

    expect(result.current.projects[0].id).toBe('2');

  });

});
