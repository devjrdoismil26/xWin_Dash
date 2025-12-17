import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useMediaLibraryValidated } from '../useMediaLibraryValidated';
import * as validatedApiClient from "@/services/http/validatedApiClient";

vi.mock("@/services/http/validatedApiClient");

describe("useMediaLibraryValidated", () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  it("should fetch files successfully", async () => {
    const mockFiles = [
      {
        id: 1,
        name: "image.jpg",
        type: "image",
        url: "http://test.com/img.jpg",
        size: 1024,
      },
    ];

    vi.spyOn(validatedApiClient.validatedApiClient, "get").mockResolvedValue(
      mockFiles,);

    const { result } = renderHook(() => useMediaLibraryValidated());

    await waitFor(() => {
      result.current.fetchFiles();

    });

    await waitFor(() => {
      expect(result.current.files).toEqual(mockFiles);

    });

  });

  it("should create folder successfully", async () => {
    const newFolder = { id: 1, name: "New Folder", files_count: 0};

    vi.spyOn(validatedApiClient.validatedApiClient, "post").mockResolvedValue(
      newFolder,);

    const { result } = renderHook(() => useMediaLibraryValidated());

    await waitFor(async () => {
      const folder = await result.current.createFolder("New Folder");

      expect(folder.name).toBe("New Folder");

    });

  });

});
