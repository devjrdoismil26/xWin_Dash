<?php

namespace App\Domains\Products\Http\Controllers\Api;

use App\Domains\Products\Http\Requests\StoreLeadCaptureFormRequest;
use App\Domains\Products\Http\Requests\UpdateLeadCaptureFormRequest; // Supondo que este serviço exista
use App\Domains\Products\Services\LeadCaptureFormService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeadCaptureFormController extends Controller
{
    protected LeadCaptureFormService $leadCaptureFormService;

    public function __construct(LeadCaptureFormService $leadCaptureFormService)
    {
        $this->leadCaptureFormService = $leadCaptureFormService;
    }

    /**
     * Display a listing of the lead capture forms.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $forms = $this->leadCaptureFormService->getAllLeadCaptureForms($request->get('per_page', 15));
        return response()->json($forms);
    }

    /**
     * Store a newly created lead capture form in storage.
     *
     * @param StoreLeadCaptureFormRequest $request
     *
     * @return JsonResponse
     */
    public function store(StoreLeadCaptureFormRequest $request): JsonResponse
    {
        $form = $this->leadCaptureFormService->createLeadCaptureForm($request->validated());
        return response()->json($form, 201);
    }

    /**
     * Display the specified lead capture form.
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $form = $this->leadCaptureFormService->getLeadCaptureFormById($id);
        if (!$form) {
            return response()->json(['message' => 'Lead Capture Form not found.'], 404);
        }
        return response()->json($form);
    }

    /**
     * Update the specified lead capture form in storage.
     *
     * @param UpdateLeadCaptureFormRequest $request
     * @param int                          $id
     *
     * @return JsonResponse
     */
    public function update(UpdateLeadCaptureFormRequest $request, int $id): JsonResponse
    {
        $form = $this->leadCaptureFormService->updateLeadCaptureForm($id, $request->validated());
        if (!$form) {
            return response()->json(['message' => 'Lead Capture Form not found.'], 404);
        }
        return response()->json($form);
    }

    /**
     * Remove the specified lead capture form from storage.
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $success = $this->leadCaptureFormService->deleteLeadCaptureForm($id);
        if (!$success) {
            return response()->json(['message' => 'Lead Capture Form not found.'], 404);
        }
        return response()->json(['message' => 'Lead Capture Form deleted successfully.']);
    }
}
