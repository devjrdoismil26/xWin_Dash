<?php

namespace App\Domains\Auth\Http\Controllers;

use App\Domains\Auth\Activities\ValidateAndResetActivity;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Workflow\ActivityStub;

class NewPasswordController extends Controller
{
    /**
     * Handle an incoming new password request by executing an activity.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            /** @var \App\Domains\Auth\Activities\ValidateAndResetActivity $activity */
            $activity = ActivityStub::make(ValidateAndResetActivity::class);
            /** @var array{email:string, password:string, password_confirmation?:string, token:string} $payload */
            $payload = $request->only('email', 'password', 'password_confirmation', 'token');
            $activity->execute($payload);

            return response()->json(['message' => __('passwords.reset')]);
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
