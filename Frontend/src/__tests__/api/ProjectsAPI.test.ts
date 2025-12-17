import { describe, it, expect, vi, beforeEach } from 'vitest';
import { projectsAPI } from '@/services/api/projects';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  } ));

describe('ProjectsAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  it('should fetch projects', async () => {
    const mockProjects = [{ id: '1', name: 'Project 1' }];
    vi.mocked(api.get).mockResolvedValue({ data: mockProjects });

    const result = await projectsAPI.getProjects();

    expect(result).toEqual(mockProjects);

    expect(api.get).toHaveBeenCalledWith('/projects');

  });

  it('should create project', async () => {
    const newProject = { name: 'New Project', slug: 'new-project'};

    vi.mocked(api.post).mockResolvedValue({ data: { id: '1', ...newProject } );

    const result = await projectsAPI.createProject(newProject);

    expect(result.name).toBe('New Project');

  });

  it('should update project', async () => {
    const updates = { name: 'Updated'};

    vi.mocked(api.put).mockResolvedValue({ data: { id: '1', ...updates } );

    await projectsAPI.updateProject('1', updates);

    expect(api.put).toHaveBeenCalledWith('/projects/1', updates);

  });

});
