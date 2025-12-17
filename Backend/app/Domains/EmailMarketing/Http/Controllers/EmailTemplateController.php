<?php

namespace App\Domains\EmailMarketing\Http\Controllers;

use App\Domains\EmailMarketing\Http\Requests\StoreEmailTemplateRequest;
use App\Domains\EmailMarketing\Http\Requests\UpdateEmailTemplateRequest; // Supondo que este serviço exista
use App\Domains\EmailMarketing\Services\EmailTemplateService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmailTemplateController extends Controller
{
    protected EmailTemplateService $emailTemplateService;

    public function __construct(EmailTemplateService $emailTemplateService)
    {
        $this->emailTemplateService = $emailTemplateService;
    }

    /**
     * Display a listing of the email templates.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $templates = $this->emailTemplateService->getAllEmailTemplates(auth()->id(), $request->get('per_page', 15));
        return response()->json($templates);
    }

    /**
     * Store a newly created email template in storage.
     *
     * @param StoreEmailTemplateRequest $request
     *
     * @return JsonResponse
     */
    public function store(StoreEmailTemplateRequest $request): JsonResponse
    {
        $template = $this->emailTemplateService->createEmailTemplate(auth()->id(), $request->validated());
        return response()->json($template, 201);
    }

    /**
     * Display the specified email template.
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $template = $this->emailTemplateService->getEmailTemplateById($id);
        if (!$template) {
            return response()->json(['message' => 'Email template not found.'], 404);
        }
        return response()->json($template);
    }

    /**
     * Update the specified email template in storage.
     *
     * @param UpdateEmailTemplateRequest $request
     * @param int                        $id
     *
     * @return JsonResponse
     */
    public function update(UpdateEmailTemplateRequest $request, int $id): JsonResponse
    {
        $template = $this->emailTemplateService->updateEmailTemplate($id, $request->validated());
        if (!$template) {
            return response()->json(['message' => 'Email template not found.'], 404);
        }
        return response()->json($template);
    }

    /**
     * Remove the specified email template from storage.
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $success = $this->emailTemplateService->deleteEmailTemplate($id);
        if (!$success) {
            return response()->json(['message' => 'Email template not found.'], 404);
        }
        return response()->json(['message' => 'Email template deleted successfully.']);
    }
}
