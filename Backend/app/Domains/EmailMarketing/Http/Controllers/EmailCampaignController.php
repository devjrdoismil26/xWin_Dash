<?php

namespace App\Domains\EmailMarketing\Http\Controllers;

use App\Domains\EmailMarketing\Http\Controllers\EmailCampaignManagementController;
use App\Domains\EmailMarketing\Http\Controllers\EmailCampaignExecutionController;
use App\Domains\EmailMarketing\Http\Requests\StoreEmailCampaignRequest;
use App\Domains\EmailMarketing\Http\Requests\UpdateCampaignStatusRequest;
use App\Domains\EmailMarketing\Http\Requests\UpdateEmailCampaignRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Controller principal para campanhas de email
 *
 * Delega operações para controllers especializados
 */
class EmailCampaignController extends Controller
{
    protected EmailCampaignManagementController $managementController;
    protected EmailCampaignExecutionController $executionController;

    public function __construct(
        EmailCampaignManagementController $managementController,
        EmailCampaignExecutionController $executionController
    ) {
        $this->managementController = $managementController;
        $this->executionController = $executionController;
    }

    // ===== MANAGEMENT OPERATIONS =====

    /**
     * Display a listing of the email campaigns.
     */
    public function index(Request $request): JsonResponse
    {
        return $this->managementController->index($request);
    }

    /**
     * Store a newly created email campaign in storage.
     */
    public function store(StoreEmailCampaignRequest $request): JsonResponse
    {
        return $this->managementController->store($request);
    }

    /**
     * Display the specified email campaign.
     */
    public function show(int $id): JsonResponse
    {
        return $this->managementController->show($id);
    }

    /**
     * Update the specified email campaign in storage.
     */
    public function update(UpdateEmailCampaignRequest $request, int $id): JsonResponse
    {
        return $this->managementController->update($request, $id);
    }

    /**
     * Remove the specified email campaign from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        return $this->managementController->destroy($id);
    }

    /**
     * Get campaign statistics.
     */
    public function stats(int $id): JsonResponse
    {
        return $this->managementController->stats($id);
    }

    /**
     * Get campaigns by status.
     */
    public function getByStatus(string $status): JsonResponse
    {
        return $this->managementController->getByStatus($status);
    }

    /**
     * Get campaigns by type.
     */
    public function getByType(string $type): JsonResponse
    {
        return $this->managementController->getByType($type);
    }

    /**
     * Search campaigns.
     */
    public function search(Request $request): JsonResponse
    {
        return $this->managementController->search($request);
    }

    // ===== EXECUTION OPERATIONS =====

    /**
     * Send a campaign.
     */
    public function send(Request $request, int $id): JsonResponse
    {
        return $this->executionController->send($request, $id);
    }

    /**
     * Pause a campaign.
     */
    public function pause(int $id): JsonResponse
    {
        return $this->executionController->pause($id);
    }

    /**
     * Resume a campaign.
     */
    public function resume(int $id): JsonResponse
    {
        return $this->executionController->resume($id);
    }

    /**
     * Cancel a campaign.
     */
    public function cancel(int $id): JsonResponse
    {
        return $this->executionController->cancel($id);
    }

    /**
     * Update campaign status.
     */
    public function updateStatus(UpdateCampaignStatusRequest $request, int $id): JsonResponse
    {
        return $this->executionController->updateStatus($request, $id);
    }

    /**
     * Schedule a campaign.
     */
    public function schedule(Request $request, int $id): JsonResponse
    {
        return $this->executionController->schedule($request, $id);
    }

    /**
     * Test a campaign.
     */
    public function test(Request $request, int $id): JsonResponse
    {
        return $this->executionController->test($request, $id);
    }

    /**
     * Get campaign execution status.
     */
    public function executionStatus(int $id): JsonResponse
    {
        return $this->executionController->executionStatus($id);
    }
}
