import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useLeadsValidated } from '../useLeadsValidated';
import * as validatedApiClient from "@/services/http/validatedApiClient";

vi.mock("@/services/http/validatedApiClient");

describe("useLeadsValidated", () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  it("should fetch leads successfully", async () => {
    const mockLeads = [
      { id: 1, name: "Lead 1", email: "lead1@test.com", status: "new" },
      { id: 2, name: "Lead 2", email: "lead2@test.com", status: "contacted" },
    ];

    vi.spyOn(validatedApiClient.validatedApiClient, "get").mockResolvedValue(
      mockLeads,);

    const { result } = renderHook(() => useLeadsValidated());

    await waitFor(() => {
      result.current.fetchLeads();

    });

    await waitFor(() => {
      expect(result.current.leads).toEqual(mockLeads);

      expect(result.current.loading).toBe(false);

    });

  });

  it("should create lead successfully", async () => {
    const newLead = {
      id: 3,
      name: "New Lead",
      email: "new@test.com",
      status: "new",};

    vi.spyOn(validatedApiClient.validatedApiClient, "post").mockResolvedValue(
      newLead,);

    const { result } = renderHook(() => useLeadsValidated());

    await waitFor(async () => {
      const created = await result.current.createLead({
        name: "New Lead",
        email: "new@test.com",
        status: "new",
      });

      expect(created).toEqual(newLead);

    });

  });

  it("should handle errors", async () => {
    vi.spyOn(validatedApiClient.validatedApiClient, "get").mockRejectedValue(
      new Error("API Error"),);

    const { result } = renderHook(() => useLeadsValidated());

    await waitFor(async () => {
      try {
        await result.current.fetchLeads();

      } catch (err: unknown) {
        expect(err.message).toBe("API Error");

      } );

  });

});
