import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useEmailMarketingValidated } from '../useEmailMarketingValidated';
import * as validatedApiClient from "@/services/http/validatedApiClient";

vi.mock("@/services/http/validatedApiClient");

describe("useEmailMarketingValidated", () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  it("should fetch campaigns successfully", async () => {
    const mockCampaigns = [
      { id: 1, name: "Campaign 1", subject: "Test", status: "draft" },
    ];

    vi.spyOn(validatedApiClient.validatedApiClient, "get").mockResolvedValue(
      mockCampaigns,);

    const { result } = renderHook(() => useEmailMarketingValidated());

    await waitFor(() => {
      result.current.fetchCampaigns();

    });

    await waitFor(() => {
      expect(result.current.campaigns).toEqual(mockCampaigns);

    });

  });

  it("should send campaign successfully", async () => {
    const sentCampaign = {
      id: 1,
      name: "Campaign",
      subject: "Test",
      status: "sent",
      sent_count: 100,};

    vi.spyOn(validatedApiClient.validatedApiClient, "post").mockResolvedValue(
      sentCampaign,);

    const { result } = renderHook(() => useEmailMarketingValidated());

    await waitFor(async () => {
      const campaign = await result.current.sendCampaign(1);

      expect(campaign.status).toBe("sent");

    });

  });

});
