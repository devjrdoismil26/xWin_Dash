import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProjectsValidated } from '../useProjectsValidated';
import * as validatedApiClient from "@/services/http/validatedApiClient";

vi.mock("@/services/http/validatedApiClient");

describe("useProjectsValidated", () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  it("should fetch projects successfully", async () => {
    const mockProjects = [
      { id: 1, name: "Project A", status: "active", progress: 50 },
    ];

    vi.spyOn(validatedApiClient.validatedApiClient, "get").mockResolvedValue(
      mockProjects,);

    const { result } = renderHook(() => useProjectsValidated());

    await waitFor(() => {
      result.current.fetchProjects();

    });

    await waitFor(() => {
      expect(result.current.projects).toEqual(mockProjects);

    });

  });

  it("should get project tasks successfully", async () => {
    const mockTasks = [
      { id: 1, title: "Task 1", status: "todo", priority: "high" },
    ];

    vi.spyOn(validatedApiClient.validatedApiClient, "get").mockResolvedValue(
      mockTasks,);

    const { result } = renderHook(() => useProjectsValidated());

    await waitFor(async () => {
      const tasks = await result.current.getProjectTasks(1);

      expect(tasks).toEqual(mockTasks);

    });

  });

});
