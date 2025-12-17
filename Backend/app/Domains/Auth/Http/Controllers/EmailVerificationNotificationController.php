<?php

namespace App\Domains\Auth\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request): JsonResponse
    {
        if ($request->user() && $request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email já verificado.'], 400);
        }

        $request->user()?->sendEmailVerificationNotification();

        return response()->json(['message' => 'Link de verificação enviado com sucesso.']);
    }
}
