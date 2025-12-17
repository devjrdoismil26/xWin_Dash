<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ApiConfiguration;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ExternalIntegrationsStatusController extends Controller
{
    public function status(): JsonResponse
    {
        $configs = ApiConfiguration::where('user_id', Auth::id())->get();
        
        $status = [
            'total' => $configs->count(),
            'connected' => $configs->where('status', 'connected')->count(),
            'disconnected' => $configs->where('status', 'disconnected')->count(),
            'error' => $configs->where('status', 'error')->count(),
            'integrations' => $configs->map(function($config) {
                return [
                    'id' => $config->id,
                    'name' => $config->name,
                    'provider' => $config->provider,
                    'status' => $config->status,
                    'last_tested' => $config->last_tested?->toISOString()
                ];
            })
        ];

        return response()->json($status);
    }
}
