<?php

namespace App\Domains\Leads\Http\Controllers;

use App\Domains\Leads\Http\Requests\StoreLeadCustomFieldRequest;
use App\Domains\Leads\Http\Requests\UpdateLeadCustomFieldRequest; // Supondo que este serviço exista
use App\Domains\Leads\Services\LeadCustomFieldService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeadCustomFieldController extends Controller
{
    protected LeadCustomFieldService $leadCustomFieldService;

    public function __construct(LeadCustomFieldService $leadCustomFieldService)
    {
        $this->leadCustomFieldService = $leadCustomFieldService;
    }

    /**
     * Display a listing of the lead custom fields.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $fields = $this->leadCustomFieldService->getAllCustomFields(auth()->id(), $request->get('per_page', 15));
        return response()->json($fields);
    }

    /**
     * Store a newly created lead custom field in storage.
     *
     * @param StoreLeadCustomFieldRequest $request
     *
     * @return JsonResponse
     */
    public function store(StoreLeadCustomFieldRequest $request): JsonResponse
    {
        $field = $this->leadCustomFieldService->createCustomField(auth()->id(), $request->validated());
        return response()->json($field, 201);
    }

    /**
     * Display the specified lead custom field.
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $field = $this->leadCustomFieldService->getCustomFieldById($id);
        if (!$field) {
            return response()->json(['message' => 'Custom field not found.'], 404);
        }
        return response()->json($field);
    }

    /**
     * Update the specified lead custom field in storage.
     *
     * @param UpdateLeadCustomFieldRequest $request
     * @param int                          $id
     *
     * @return JsonResponse
     */
    public function update(UpdateLeadCustomFieldRequest $request, int $id): JsonResponse
    {
        $field = $this->leadCustomFieldService->updateCustomField($id, $request->validated());
        if (!$field) {
            return response()->json(['message' => 'Custom field not found.'], 404);
        }
        return response()->json($field);
    }

    /**
     * Remove the specified lead custom field from storage.
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $success = $this->leadCustomFieldService->deleteCustomField($id);
        if (!$success) {
            return response()->json(['message' => 'Custom field not found.'], 404);
        }
        return response()->json(['message' => 'Custom field deleted successfully.']);
    }
}
