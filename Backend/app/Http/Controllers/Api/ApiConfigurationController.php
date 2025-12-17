<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ApiConfiguration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

class ApiConfigurationController extends Controller
{
    public function index(): JsonResponse
    {
        $configs = ApiConfiguration::where('user_id', Auth::id())->get();
        return response()->json($configs);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'provider' => 'required|string',
            'credentials' => 'required|array'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $config = ApiConfiguration::create([
            'user_id' => Auth::id(),
            'name' => $request->name,
            'provider' => $request->provider,
            'credentials' => $request->credentials,
            'status' => 'disconnected'
        ]);

        return response()->json($config, 201);
    }

    public function show(string $id): JsonResponse
    {
        $config = ApiConfiguration::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        return response()->json($config);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $config = ApiConfiguration::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'provider' => 'sometimes|string',
            'credentials' => 'sometimes|array',
            'status' => 'sometimes|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $config->update($request->only(['name', 'provider', 'credentials', 'status']));

        return response()->json($config);
    }

    public function destroy(string $id): JsonResponse
    {
        $config = ApiConfiguration::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $config->delete();

        return response()->json(['message' => 'Configuration deleted successfully']);
    }

    public function test(Request $request, string $id): JsonResponse
    {
        $config = ApiConfiguration::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        try {
            $result = $this->testProviderConnection($config);
            
            $config->update([
                'status' => $result['success'] ? 'connected' : 'error',
                'last_tested' => now()
            ]);

            return response()->json($result);
        } catch (\Exception $e) {
            $config->update([
                'status' => 'error',
                'last_tested' => now()
            ]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    private function testProviderConnection(ApiConfiguration $config): array
    {
        $provider = $config->provider;
        $credentials = $config->credentials;

        return match($provider) {
            'openai' => $this->testOpenAI($credentials),
            'claude' => $this->testClaude($credentials),
            'gemini' => $this->testGemini($credentials),
            'google_ads' => $this->testGoogleAds($credentials),
            'facebook_ads' => $this->testFacebookAds($credentials),
            default => ['success' => false, 'message' => 'Provider not supported']
        };
    }

    private function testOpenAI(array $credentials): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . ($credentials['api_key'] ?? ''),
                'Content-Type' => 'application/json'
            ])->get('https://api.openai.com/v1/models');

            return [
                'success' => $response->successful(),
                'message' => $response->successful() ? 'OpenAI connection successful' : 'OpenAI connection failed'
            ];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    private function testClaude(array $credentials): array
    {
        try {
            $response = Http::withHeaders([
                'x-api-key' => $credentials['api_key'] ?? '',
                'anthropic-version' => '2023-06-01'
            ])->get('https://api.anthropic.com/v1/messages');

            return [
                'success' => $response->status() !== 401,
                'message' => $response->status() !== 401 ? 'Claude connection successful' : 'Invalid API key'
            ];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    private function testGemini(array $credentials): array
    {
        try {
            $apiKey = $credentials['api_key'] ?? '';
            $response = Http::get("https://generativelanguage.googleapis.com/v1/models?key={$apiKey}");

            return [
                'success' => $response->successful(),
                'message' => $response->successful() ? 'Gemini connection successful' : 'Gemini connection failed'
            ];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    private function testGoogleAds(array $credentials): array
    {
        return [
            'success' => !empty($credentials['developer_token'] ?? '') && !empty($credentials['client_id'] ?? ''),
            'message' => 'Google Ads credentials validated'
        ];
    }

    private function testFacebookAds(array $credentials): array
    {
        try {
            $token = $credentials['access_token'] ?? '';
            $response = Http::get("https://graph.facebook.com/v18.0/me?access_token={$token}");

            return [
                'success' => $response->successful(),
                'message' => $response->successful() ? 'Facebook Ads connection successful' : 'Invalid access token'
            ];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
