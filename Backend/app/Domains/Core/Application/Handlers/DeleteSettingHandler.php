<?php

namespace App\Domains\Core\Application\Handlers;

use App\Domains\Core\Application\Commands\DeleteSettingCommand;
use App\Domains\Core\Services\SettingService;
use App\Domains\Core\Infrastructure\Persistence\Eloquent\SettingRepository;
use App\Domains\Core\Exceptions\SettingNotFoundException;
use App\Domains\Core\Exceptions\SettingDeletionException;
use Illuminate\Support\Facades\Log;

class DeleteSettingHandler
{
    public function __construct(
        private SettingService $settingService,
        private SettingRepository $settingRepository
    ) {
    }

    public function handle(DeleteSettingCommand $command): array
    {
        try {
            // Buscar a configuração existente
            $setting = $this->settingRepository->getByKey($command->settingKey);

            if (!$setting) {
                throw new SettingNotFoundException(
                    "Setting with key '{$command->settingKey}' not found"
                );
            }

            // Verificar se é uma configuração crítica
            if ($this->isCriticalSetting($command->settingKey) && !$command->forceDelete) {
                throw new SettingDeletionException(
                    "Cannot delete critical setting '{$command->settingKey}'. Use force delete to proceed."
                );
            }

            // Deletar a configuração
            $deleted = $this->settingService->deleteSetting($command->settingKey);

            if (!$deleted) {
                throw new SettingDeletionException(
                    "Failed to delete setting '{$command->settingKey}'"
                );
            }

            // Log da deleção
            Log::info("Setting deleted", [
                'setting_key' => $command->settingKey,
                'user_id' => $command->userId,
                'force_delete' => $command->forceDelete
            ]);

            return [
                'success' => true,
                'setting_key' => $command->settingKey,
                'deleted_at' => now()->toISOString()
            ];
        } catch (SettingNotFoundException $e) {
            Log::error("Setting not found for deletion", [
                'setting_key' => $command->settingKey,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        } catch (SettingDeletionException $e) {
            Log::error("Setting deletion failed", [
                'setting_key' => $command->settingKey,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        } catch (\Exception $e) {
            Log::error("Unexpected error during setting deletion", [
                'setting_key' => $command->settingKey,
                'user_id' => $command->userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw new SettingDeletionException(
                "Failed to delete setting: " . $e->getMessage()
            );
        }
    }

    private function isCriticalSetting(string $settingKey): bool
    {
        $criticalSettings = [
            'app.name',
            'app.url',
            'database.default',
            'mail.default',
            'queue.default'
        ];

        return in_array($settingKey, $criticalSettings);
    }
}
