<?php

namespace App\Domains\Core\Http\Controllers;

use App\Domains\Core\Http\Requests\StoreSettingRequest;
use App\Domains\Core\Http\Requests\UpdateSettingRequest;
use App\Domains\Core\Services\SettingService;
use App\Domains\Core\Policies\SettingsPolicy;
use App\Domains\Settings\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class SettingsController extends Controller
{
    protected SettingService $settingService;

    public function __construct(SettingService $settingService)
    {
        $this->settingService = $settingService;
    }

    /**
     * Display a listing of the settings.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $settings = $this->settingService->getAllSettings();
        return Response::json($settings);
    }

    /**
     * Store a newly created setting in storage.
     *
     * @param StoreSettingRequest $request
     *
     * @return JsonResponse
     */
    public function store(StoreSettingRequest $request): JsonResponse
    {
        $setting = $this->settingService->createSetting($request->validated());
        return Response::json($setting, 201);
    }

    /**
     * Display the specified setting.
     *
     * @param string $key
     *
     * @return JsonResponse
     */
    public function show(string $key): JsonResponse
    {
        $setting = $this->settingService->getSettingByKey($key);
        if (!$setting) {
            return Response::json(['message' => 'Setting not found.'], 404);
        }
        return Response::json($setting);
    }

    /**
     * Update the specified setting in storage.
     *
     * @param UpdateSettingRequest $request
     * @param string               $key
     *
     * @return JsonResponse
     */
    public function update(UpdateSettingRequest $request, string $key): JsonResponse
    {
        $setting = $this->settingService->updateSetting($key, $request->validated());
        if (!$setting) {
            return Response::json(['message' => 'Setting not found.'], 404);
        }
        return Response::json($setting);
    }

    /**
     * Remove the specified setting from storage.
     *
     * @param string $key
     *
     * @return JsonResponse
     */
    public function destroy(string $key): JsonResponse
    {
        $success = $this->settingService->deleteSetting($key);
        if (!$success) {
            return Response::json(['message' => 'Setting not found.'], 404);
        }
        return Response::json(['message' => 'Setting deleted successfully.']);
    }

    /**
     * Bulk update settings
     */
    public function bulkUpdate(Request $request): JsonResponse
    {
        $request->validate(['settings' => 'required|array']);

        $results = $this->settingService->bulkUpdate($request->settings);

        return Response::json([
            'success' => true,
            'data' => $results
        ]);
    }

    /**
     * Reset settings
     */
    public function reset(Request $request): JsonResponse
    {
        $request->validate(['category' => 'nullable|string']);

        $results = $this->settingService->resetSettings($request->category);

        return Response::json([
            'success' => true,
            'data' => $results
        ]);
    }

    /**
     * Get settings categories
     */
    public function getCategories(): JsonResponse
    {
        $categories = [
            ['id' => 'general', 'name' => 'Geral', 'description' => 'Configurações gerais'],
            ['id' => 'security', 'name' => 'Segurança', 'description' => 'Configurações de segurança'],
            ['id' => 'notifications', 'name' => 'Notificações', 'description' => 'Configurações de notificações'],
            ['id' => 'integrations', 'name' => 'Integrações', 'description' => 'Configurações de integrações'],
            ['id' => 'appearance', 'name' => 'Aparência', 'description' => 'Configurações de aparência'],
            ['id' => 'advanced', 'name' => 'Avançado', 'description' => 'Configurações avançadas']
        ];

        return Response::json([
            'success' => true,
            'data' => $categories
        ]);
    }

    /**
     * Get category settings
     */
    public function getCategorySettings(string $category): JsonResponse
    {
        $settings = $this->settingService->getSettingsByCategory($category);

        return Response::json([
            'success' => true,
            'data' => $settings
        ]);
    }

    /**
     * Get system configuration
     * AUTH-012: Adicionada autorização
     */
    public function getSystemConfiguration(): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('view', Setting::class);
        
        $config = [
            'app_name' => config('app.name'),
            'app_version' => config('app.version'),
            'environment' => config('app.env'),
            'debug_mode' => config('app.debug'),
            'maintenance_mode' => app()->isDownForMaintenance()
        ];

        return Response::json([
            'success' => true,
            'data' => $config
        ]);
    }

    /**
     * IMPL-009: Implementação real de persistência de configurações
     * AUTH-012: Adicionada autorização
     */
    public function updateSystemConfiguration(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('update', Setting::class);
        
        $request->validate([
            'app_name' => 'nullable|string',
            'debug_mode' => 'nullable|boolean',
            'maintenance_mode' => 'nullable|boolean',
            'timezone' => 'nullable|string',
            'locale' => 'nullable|string',
            'mail_from_address' => 'nullable|email',
            'mail_from_name' => 'nullable|string',
        ]);

        $projectId = session('selected_project_id');
        $updated = [];

        // IMPL-009: Persistir cada configuração usando Setting Model
        foreach ($request->all() as $key => $value) {
            $setting = \App\Domains\Settings\Models\Setting::updateOrCreate(
                [
                    'key' => $key,
                    'group' => 'system',
                    'project_id' => $projectId, // Pode ser null para configurações globais
                ],
                [
                    'value' => is_bool($value) ? ($value ? '1' : '0') : (string)$value,
                    'type' => is_bool($value) ? 'boolean' : (is_numeric($value) ? 'integer' : 'string'),
                    'is_public' => false,
                ]
            );
            $updated[$key] = $setting->value;
        }

        return Response::json([
            'success' => true,
            'message' => 'System configuration updated successfully',
            'data' => $updated
        ]);
    }

    /**
     * Export settings
     */
    public function exportSettings(Request $request): JsonResponse
    {
        $request->validate(['format' => 'nullable|string|in:json,yaml,csv']);

        $format = $request->input('format', 'json');
        $settings = $this->settingService->getAllSettings();

        return Response::json([
            'success' => true,
            'data' => [
                'format' => $format,
                'settings' => $settings,
                'exported_at' => now()
            ]
        ]);
    }

    /**
     * Import settings
     */
    public function importSettings(Request $request): JsonResponse
    {
        $request->validate(['file' => 'required|file|mimes:json,yaml,csv']);

        $file = $request->file('file');
        $results = $this->settingService->importSettings($file);

        return Response::json([
            'success' => true,
            'data' => $results
        ]);
    }

    /**
     * Validate setting
     */
    public function validateSetting(Request $request): JsonResponse
    {
        $request->validate([
            'key' => 'required|string',
            'value' => 'required'
        ]);

        $validation = $this->settingService->validateSetting($request->key, $request->value);

        return Response::json([
            'success' => true,
            'data' => $validation
        ]);
    }

    /**
     * Validate settings
     */
    public function validateSettings(Request $request): JsonResponse
    {
        $request->validate(['settings' => 'required|array']);

        $validation = $this->settingService->validateSettings($request->settings);

        return Response::json([
            'success' => true,
            'data' => $validation
        ]);
    }
}
