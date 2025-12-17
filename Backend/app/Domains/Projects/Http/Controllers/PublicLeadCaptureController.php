<?php

namespace App\Domains\Projects\Http\Controllers;

use App\Domains\Leads\Services\LeadService;
use App\Domains\Projects\Services\LeadCaptureFormService; // Supondo que este serviço exista
use App\Http\Controllers\Controller; // Supondo que este serviço exista
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicLeadCaptureController extends Controller
{
    protected LeadCaptureFormService $leadCaptureFormService;

    protected LeadService $leadService;

    public function __construct(LeadCaptureFormService $leadCaptureFormService, LeadService $leadService)
    {
        $this->leadCaptureFormService = $leadCaptureFormService;
        $this->leadService = $leadService;
    }

    /**
     * Handle the public submission of a lead capture form.
     *
     * @param string  $formSlug o slug do formulário de captura de Leads
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function submit(string $formSlug, Request $request): JsonResponse
    {
        $form = $this->leadCaptureFormService->getLeadCaptureFormBySlug($formSlug); // Supondo um método para buscar por slug

        if (!$form) {
            return response()->json(['message' => 'Lead Capture Form not found.'], 404);
        }

        // Validar os dados da requisição com base nos campos definidos no formulário
        $rules = [];
        foreach ($form->fields as $field) {
            $rules[$field['name']] = 'required'; // Exemplo simples, pode ser mais complexo
            if ($field['type'] === 'email') {
                $rules[$field['name']] .= '|email';
            }
        }
        $request->validate($rules);

        // Criar um novo Lead com os dados do formulário
        $leadData = [
            'name' => $request->input('name'), // Assumindo um campo 'name' no formulário
            'email' => $request->input('email'), // Assumindo um campo 'email' no formulário
            'source' => 'Lead Capture Form: ' . $form->name,
            'custom_fields' => $request->except(['name', 'email']), // Outros campos como custom_fields
        ];

        try {
            $lead = $this->leadService->createLead($leadData);
            return response()->json(['message' => 'Lead captured successfully.', 'lead_id' => $lead->id], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to capture lead.', 'error' => $e->getMessage()], 500);
        }
    }
}
