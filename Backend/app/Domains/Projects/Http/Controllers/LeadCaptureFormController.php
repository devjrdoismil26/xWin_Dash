<?php

namespace App\Domains\Projects\Http\Controllers;

use App\Domains\Core\Http\Controllers\Controller;
use App\Domains\Projects\Http\Requests\StoreLeadCaptureFormRequest;
use App\Domains\Projects\Http\Requests\UpdateLeadCaptureFormRequest;
use App\Domains\Projects\Http\Resources\LeadCaptureFormResource;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\LeadCaptureFormModel;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel;
use Illuminate\Http\JsonResponse;
use App\Domains\Projects\Services\LeadCaptureFormService;

class LeadCaptureFormController extends Controller
{
    protected LeadCaptureFormService $leadCaptureFormService;

    public function __construct(LeadCaptureFormService $leadCaptureFormService)
    {
        $this->leadCaptureFormService = $leadCaptureFormService;
        // The policy is applied based on the 'form' parameter name in the routes.
        $this->authorizeResource(LeadCaptureFormModel::class, 'form');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(ProjectModel $project): JsonResponse
    {
        return LeadCaptureFormResource::collection($project->leadCaptureForms)
            ->additional(['message' => 'Formulários de captação listados com sucesso.'])->response();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLeadCaptureFormRequest $request, ProjectModel $project): JsonResponse
    {
        $form = $this->leadCaptureFormService->createForm($project, $request->validated());
        return (new LeadCaptureFormResource($form))
            ->additional(['message' => 'Formulário de captação criado com sucesso.'])->response()->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(ProjectModel $project, LeadCaptureFormModel $form): JsonResponse
    {
        return (new LeadCaptureFormResource($form))
            ->additional(['message' => 'Formulário de captação detalhado com sucesso.'])->response();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLeadCaptureFormRequest $request, ProjectModel $project, LeadCaptureFormModel $form): JsonResponse
    {
        $updatedForm = $this->leadCaptureFormService->updateForm($form, $request->validated());
        return (new LeadCaptureFormResource($updatedForm))
            ->additional(['message' => 'Formulário de captação atualizado com sucesso.'])->response();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProjectModel $project, LeadCaptureFormModel $form): JsonResponse
    {
        $this->leadCaptureFormService->deleteForm($form);
        return response()->json(['message' => 'Formulário de captação deletado com sucesso.']);
    }

    /**
     * Generate embed code for the specified form.
     */
    public function generateEmbedCode(ProjectModel $project, LeadCaptureFormModel $form): JsonResponse
    {
        $this->authorize('view', $form);
        $embedCode = $this->leadCaptureFormService->generateEmbedCode($form);
        return response()->json([
            'message' => 'Código de incorporação gerado com sucesso.',
            'data' => ['embed_code' => $embedCode],
        ]);
    }
}
