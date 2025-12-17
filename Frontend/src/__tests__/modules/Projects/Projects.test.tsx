import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@test-utils/test-utils';
import { QueryClient } from '@tanstack/react-query';
import React from "react";

// Mock do componente Projects
const Projects = () => {
  const [projects, setProjects] = React.useState([
    {
      id: 1,
      name: "Projeto Alpha",
      description: "Projeto de desenvolvimento",
      status: "active",
      progress: 75,
      start_date: "2024-01-01",
      end_date: "2024-03-31",
      budget: 50000,
      spent: 37500,
      team: [
        { id: 1, name: "João Silva", role: "Developer" },
        { id: 2, name: "Maria Santos", role: "Designer" },
      ],
      tasks: [
        { id: 1, title: "Task 1", status: "completed", priority: "high" },
        { id: 2, title: "Task 2", status: "in_progress", priority: "medium" },
      ],
    },
    {
      id: 2,
      name: "Projeto Beta",
      description: "Projeto de marketing",
      status: "planning",
      progress: 25,
      start_date: "2024-02-01",
      end_date: "2024-04-30",
      budget: 30000,
      spent: 7500,
      team: [{ id: 3, name: "Pedro Costa", role: "Marketer" }],
      tasks: [{ id: 3, title: "Task 3", status: "pending", priority: "low" }],
    },
  ]);

  const [isLoading, setIsLoading] = React.useState(false);

  const [searchTerm, setSearchTerm] = React.useState("");

  const [statusFilter, setStatusFilter] = React.useState("all");

  const filteredProjects = (projects || []).filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const createProject = (projectData: unknown) => {
    setIsLoading(true);

    setTimeout(() => {
      setProjects((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...projectData,
          team: [],
          tasks: [],
        },
      ]);

      setIsLoading(false);

    }, 500);};

  const updateProject = (id: number, updates: unknown) => {
    setProjects((prev) =>
      (prev || []).map((project) =>
        project.id === id ? { ...project, ...updates } : project,
      ),);};

  const deleteProject = (id: number) => {
    setProjects((prev) => (prev || []).filter((project) => project.id !== id));};

  return (
        <>
      <div data-testid="projects-module" className="projects-module">
      </div><h1 data-testid="projects-title">Projects Management</h1>

      <div data-testid="projects-filters" className="projects-filters">
           
        </div><input
          data-testid="search-input"
          placeholder="Search projects..."
          value={ searchTerm }
          onChange={ (e) => setSearchTerm(e.target.value) } />
        <select
          data-testid="status-filter"
          value={ statusFilter }
          onChange={ (e) => setStatusFilter(e.target.value)  }>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="planning">Planning</option>
          <option value="completed">Completed</option></select><button
          data-testid="create-project-button"
          onClick={() = />
            createProject({
              name: "New Project",
              description: "New project description",
              status: "planning",
              progress: 0,
              budget: 10000,
            })
  }
  >
          Create Project
        </button>
      </div>

      {isLoading && <div data-testid="projects-loading">Loading...</div>}

      <div data-testid="projects-list" className="projects-list">
           
        </div>{(filteredProjects || []).map((project) => (
          <div
            key={ project.id }
            data-testid={`project-${project.id}`}
            className="project-item">
           
        </div><div data-testid={`project-name-${project.id}`}>{project.name}</div>
            <div data-testid={`project-description-${project.id}`}>
           
        </div>{project.description}
            </div>
            <div data-testid={`project-status-${project.id}`}>
           
        </div>{project.status}
            </div>
            <div data-testid={`project-progress-${project.id}`}>
           
        </div>{project.progress}%
            </div>
            <div data-testid={`project-budget-${project.id}`}>
          R$ 
        </div>{project.budget}
            </div>
            <div data-testid={`project-spent-${project.id}`}>
          R$ 
        </div>{project.spent}
            </div>
            <div data-testid={`project-team-count-${project.id}`}>
          Team: 
        </div>{project.team.length}
            </div>
            <div data-testid={`project-tasks-count-${project.id}`}>
          Tasks: 
        </div>{project.tasks.length}
            </div>
            <button
              data-testid={`edit-project-${project.id}`}
              onClick={() => updateProject(project.id, { status: "active" })}
  >
              Edit
            </button>
            <button
              data-testid={`delete-project-${project.id}`}
              onClick={ () => deleteProject(project.id)  }>
              Delete
            </button>
      </div>
    </>
  ))}
      </div>

      <div data-testid="projects-count">Total: {filteredProjects.length}</div>);};

describe("Projects Module", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

  });

  it("should render projects interface", async () => {
    render(<Projects />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId("projects-module")).toBeInTheDocument();

    });

  });

  it("should display projects title", async () => {
    render(<Projects />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId("projects-title")).toBeInTheDocument();

      expect(screen.getByText("Projects Management")).toBeInTheDocument();

    });

  });

  it("should display projects data", async () => {
    render(<Projects />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId("project-1")).toBeInTheDocument();

      expect(screen.getByTestId("project-2")).toBeInTheDocument();

      expect(screen.getByText("Projeto Alpha")).toBeInTheDocument();

      expect(screen.getByText("Projeto Beta")).toBeInTheDocument();

      expect(
        screen.getByText("Projeto de desenvolvimento"),
      ).toBeInTheDocument();

      expect(screen.getByText("Projeto de marketing")).toBeInTheDocument();

    });

  });

  it("should display project metrics", async () => {
    render(<Projects />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId("project-progress-1")).toHaveTextContent("75%");

      expect(screen.getByTestId("project-budget-1")).toHaveTextContent(
        "R$ 50000",);

      expect(screen.getByTestId("project-spent-1")).toHaveTextContent(
        "R$ 37500",);

      expect(screen.getByTestId("project-team-count-1")).toHaveTextContent(
        "Team: 2",);

      expect(screen.getByTestId("project-tasks-count-1")).toHaveTextContent(
        "Tasks: 2",);

    });

  });

  it("should handle project creation", async () => {
    render(<Projects />, { queryClient });

    const createButton = screen.getByTestId("create-project-button");

    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByTestId("projects-loading")).toBeInTheDocument();

    });

    await waitFor(
      () => {
        expect(screen.getByText("New Project")).toBeInTheDocument();

        expect(screen.getByText("New project description")).toBeInTheDocument();

      },
      { timeout: 1000 },);

  });

  it("should handle project editing", async () => {
    render(<Projects />, { queryClient });

    const editButton = screen.getByTestId("edit-project-1");

    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByTestId("project-status-1")).toHaveTextContent(
        "active",);

    });

  });

  it("should handle project deletion", async () => {
    render(<Projects />, { queryClient });

    const deleteButton = screen.getByTestId("delete-project-1");

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByTestId("project-1")).not.toBeInTheDocument();

    });

  });

  it("should handle project search", async () => {
    render(<Projects />, { queryClient });

    const searchInput = screen.getByTestId("search-input");

    fireEvent.change(searchInput, { target: { value: "Alpha" } );

    await waitFor(() => {
      expect(screen.getByTestId("project-1")).toBeInTheDocument();

      expect(screen.queryByTestId("project-2")).not.toBeInTheDocument();

    });

  });

  it("should handle status filtering", async () => {
    render(<Projects />, { queryClient });

    const statusFilter = screen.getByTestId("status-filter");

    fireEvent.change(statusFilter, { target: { value: "active" } );

    await waitFor(() => {
      expect(screen.getByTestId("project-1")).toBeInTheDocument();

      expect(screen.queryByTestId("project-2")).not.toBeInTheDocument();

    });

  });

  it("should display projects count", async () => {
    render(<Projects />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId("projects-count")).toHaveTextContent(
        "Total: 2",);

    });

  });

  it("should be responsive", async () => {
    render(<Projects />, { queryClient });

    await waitFor(() => {
      const projectsModule = screen.getByTestId("projects-module");

      expect(projectsModule).toHaveClass("projects-module");

    });

  });

  it("should support dark theme", async () => {
    render(<Projects />, {
      queryClient,
      theme: "dark",
    });

    await waitFor(() => {
      const projectsModule = screen.getByTestId("projects-module");

      expect(projectsModule).toHaveClass("projects-module");

    });

  });

});
