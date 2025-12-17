<?php

namespace App\Domains\Auth\Http\Controllers;

use App\Domains\Auth\Workflows\PasswordResetWorkflow;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Workflow\WorkflowStub;

class PasswordResetLinkController extends Controller
{
    /**
     * Handle an incoming password reset link request by starting a workflow.
     *
     * @param Request $request
     *
     * @return JsonResponse
     *
     * @throws ValidationException
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $workflow = WorkflowStub::make(PasswordResetWorkflow::class);
            $workflow->start($request->only('email'));

            if (!$workflow->completed()) {
                throw ValidationException::withMessages([
                    'email' => [__('passwords.sent')],
                ]);
            }

            return response()->json(['message' => __('passwords.sent')]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Dados inválidos',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro interno do servidor.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
