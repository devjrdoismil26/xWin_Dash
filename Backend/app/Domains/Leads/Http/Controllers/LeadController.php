<?php

namespace App\Domains\Leads\Http\Controllers;

use App\Domains\Leads\Contracts\LeadServiceInterface;
use App\Domains\Leads\Http\Requests\StoreLeadRequest;
use App\Domains\Leads\Http\Requests\UpdateLeadRequest;
use App\Domains\Leads\Http\Requests\UpdateLeadStatusRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    private LeadManagementController $managementController;
    private LeadStatusController $statusController;

    public function __construct(LeadServiceInterface $leadService)
    {
        $this->managementController = new LeadManagementController($leadService);
        $this->statusController = new LeadStatusController($leadService);
    }

    public function index(Request $request, int $projectId): JsonResponse
    {
        $request->merge(['project_id' => $projectId]);
        return $this->managementController->index($request);
    }

    public function store(StoreLeadRequest $request, int $projectId): JsonResponse
    {
        $request->merge(['project_id' => $projectId]);
        return $this->managementController->store($request);
    }

    public function show(Request $request, int $projectId, int $leadId): JsonResponse
    {
        $request->merge(['project_id' => $projectId]);
        return $this->managementController->show($request, $leadId);
    }

    public function update(UpdateLeadRequest $request, int $projectId, int $leadId): JsonResponse
    {
        $request->merge(['project_id' => $projectId]);
        return $this->managementController->update($request, $leadId);
    }

    public function destroy(Request $request, int $projectId, int $leadId): JsonResponse
    {
        $request->merge(['project_id' => $projectId]);
        return $this->managementController->destroy($request, $leadId);
    }

    public function search(Request $request, int $projectId): JsonResponse
    {
        $request->merge(['project_id' => $projectId]);
        return $this->managementController->search($request);
    }

    public function getByStatus(Request $request, int $projectId, string $status): JsonResponse
    {
        $request->merge(['project_id' => $projectId]);
        return $this->managementController->getByStatus($request, $status);
    }

    public function getBySource(Request $request, int $projectId, string $source): JsonResponse
    {
        $request->merge(['project_id' => $projectId]);
        return $this->managementController->getBySource($request, $source);
    }

    public function getBySegment(Request $request, int $projectId, int $segmentId): JsonResponse
    {
        $request->merge(['project_id' => $projectId]);
        return $this->managementController->getBySegment($request, $segmentId);
    }

    public function getStats(Request $request, int $projectId): JsonResponse
    {
        $request->merge(['project_id' => $projectId]);
        return $this->managementController->getStats($request);
    }

    public function getCounts(Request $request, int $projectId): JsonResponse
    {
        $request->merge(['project_id' => $projectId]);
        return $this->managementController->getCounts($request);
    }

    public function getRecent(Request $request, int $projectId): JsonResponse
    {
        $request->merge(['project_id' => $projectId]);
        return $this->managementController->getRecent($request);
    }

    public function getByScore(Request $request, int $projectId): JsonResponse
    {
        $request->merge(['project_id' => $projectId]);
        return $this->managementController->getByScore($request);
    }

    public function updateStatus(UpdateLeadStatusRequest $request, int $projectId, int $leadId): JsonResponse
    {
        $request->merge(['project_id' => $projectId]);
        return $this->statusController->updateStatus($request, $leadId);
    }

    public function qualify(Request $request, int $projectId, int $leadId): JsonResponse
    {
        $request->merge(['project_id' => $projectId]);
        return $this->statusController->qualify($request, $leadId);
    }

    public function disqualify(Request $request, int $projectId, int $leadId): JsonResponse
    {
        $request->merge(['project_id' => $projectId]);
        return $this->statusController->disqualify($request, $leadId);
    }

    public function convert(Request $request, int $projectId, int $leadId): JsonResponse
    {
        $request->merge(['project_id' => $projectId]);
        return $this->statusController->convert($request, $leadId);
    }

    public function lose(Request $request, int $projectId, int $leadId): JsonResponse
    {
        $request->merge(['project_id' => $projectId]);
        return $this->statusController->lose($request, $leadId);
    }

    public function contact(Request $request, int $projectId, int $leadId): JsonResponse
    {
        $request->merge(['project_id' => $projectId]);
        return $this->statusController->contact($request, $leadId);
    }

    public function negotiate(Request $request, int $projectId, int $leadId): JsonResponse
    {
        $request->merge(['project_id' => $projectId]);
        return $this->statusController->negotiate($request, $leadId);
    }

    public function followUp(Request $request, int $projectId, int $leadId): JsonResponse
    {
        $request->merge(['project_id' => $projectId]);
        return $this->statusController->followUp($request, $leadId);
    }

    public function getStatusHistory(Request $request, int $projectId, int $leadId): JsonResponse
    {
        $request->merge(['project_id' => $projectId]);
        return $this->statusController->getStatusHistory($request, $leadId);
    }

    public function getStatusStats(Request $request, int $projectId): JsonResponse
    {
        $request->merge(['project_id' => $projectId]);
        return $this->statusController->getStatusStats($request);
    }

    public function getConversionRate(Request $request, int $projectId): JsonResponse
    {
        $request->merge(['project_id' => $projectId]);
        return $this->statusController->getConversionRate($request);
    }

    public function getLeadsNeedingFollowUp(Request $request, int $projectId): JsonResponse
    {
        $request->merge(['project_id' => $projectId]);
        return $this->statusController->getLeadsNeedingFollowUp($request);
    }

    public function getLeadsInNegotiation(Request $request, int $projectId): JsonResponse
    {
        $request->merge(['project_id' => $projectId]);
        return $this->statusController->getLeadsInNegotiation($request);
    }

    public function getQualifiedLeads(Request $request, int $projectId): JsonResponse
    {
        $request->merge(['project_id' => $projectId]);
        return $this->statusController->getQualifiedLeads($request);
    }

    public function getConvertedLeads(Request $request, int $projectId): JsonResponse
    {
        $request->merge(['project_id' => $projectId]);
        return $this->statusController->getConvertedLeads($request);
    }
}
