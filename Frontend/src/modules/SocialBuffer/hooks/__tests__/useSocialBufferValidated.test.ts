import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useSocialBufferValidated } from '../useSocialBufferValidated';
import * as validatedApiClient from "@/services/http/validatedApiClient";

vi.mock("@/services/http/validatedApiClient");

describe("useSocialBufferValidated", () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  it("should fetch posts successfully", async () => {
    const mockPosts = [
      { id: 1, content: "Post 1", platform: "twitter", status: "published" },
    ];

    vi.spyOn(validatedApiClient.validatedApiClient, "get").mockResolvedValue(
      mockPosts,);

    const { result } = renderHook(() => useSocialBufferValidated());

    await waitFor(() => {
      result.current.fetchPosts();

    });

    await waitFor(() => {
      expect(result.current.posts).toEqual(mockPosts);

    });

  });

  it("should schedule post successfully", async () => {
    const scheduledPost = {
      id: 1,
      content: "Post",
      platform: "twitter",
      status: "scheduled",
      scheduled_at: "2025-12-01",};

    vi.spyOn(validatedApiClient.validatedApiClient, "put").mockResolvedValue(
      scheduledPost,);

    const { result } = renderHook(() => useSocialBufferValidated());

    await waitFor(async () => {
      const post = await result.current.schedulePost(1, "2025-12-01");

      expect(post.status).toBe("scheduled");

    });

  });

});
