<?php

namespace App\Domains\Core\Application\Handlers;

use App\Domains\Core\Application\Commands\UpdateSettingCommand;
use App\Domains\Core\Services\SettingService;
use App\Domains\Core\Infrastructure\Persistence\Eloquent\SettingRepository;
use App\Domains\Core\Exceptions\SettingNotFoundException;
use App\Domains\Core\Exceptions\SettingUpdateException;
use Illuminate\Support\Facades\Log;

class UpdateSettingHandler
{
    public function __construct(
        private SettingService $settingService,
        private SettingRepository $settingRepository
    ) {
    }

    public function handle(UpdateSettingCommand $command): array
    {
        try {
            // Buscar a configuração existente
            $setting = $this->settingRepository->getByKey($command->settingKey);

            if (!$setting) {
                throw new SettingNotFoundException(
                    "Setting with key '{$command->settingKey}' not found"
                );
            }

            // Validar valor se estiver sendo alterado
            if ($command->value !== null) {
                $this->validateSettingValue($command->value, $command->type ?? $setting->type);
            }

            // Preparar dados para atualização
            $updateData = $command->toArray();
            unset($updateData['user_id']); // Remover user_id dos dados de atualização

            // Atualizar a configuração
            $updated = $this->settingService->updateSetting($command->settingKey, $updateData);

            if (!$updated) {
                throw new SettingUpdateException(
                    "Failed to update setting '{$command->settingKey}'"
                );
            }

            // Buscar a configuração atualizada
            $updatedSetting = $this->settingRepository->getByKey($command->settingKey);

            // Log da atualização
            Log::info("Setting updated", [
                'setting_key' => $command->settingKey,
                'user_id' => $command->userId,
                'updated_fields' => array_keys($updateData)
            ]);

            return [
                'success' => true,
                'setting_key' => $updatedSetting->key,
                'value' => $updatedSetting->value,
                'type' => $updatedSetting->type,
                'description' => $updatedSetting->description,
                'updated_at' => $updatedSetting->updated_at->toISOString()
            ];
        } catch (SettingNotFoundException $e) {
            Log::error("Setting not found for update", [
                'setting_key' => $command->settingKey,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        } catch (SettingUpdateException $e) {
            Log::error("Setting update failed", [
                'setting_key' => $command->settingKey,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        } catch (\Exception $e) {
            Log::error("Unexpected error during setting update", [
                'setting_key' => $command->settingKey,
                'user_id' => $command->userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw new SettingUpdateException(
                "Failed to update setting: " . $e->getMessage()
            );
        }
    }

    private function validateSettingValue(mixed $value, ?string $type): void
    {
        if ($type) {
            switch ($type) {
                case 'string':
                    if (!is_string($value)) {
                        throw new SettingUpdateException("Value must be a string for type 'string'");
                    }
                    break;
                case 'integer':
                    if (!is_int($value)) {
                        throw new SettingUpdateException("Value must be an integer for type 'integer'");
                    }
                    break;
                case 'boolean':
                    if (!is_bool($value)) {
                        throw new SettingUpdateException("Value must be a boolean for type 'boolean'");
                    }
                    break;
                case 'array':
                    if (!is_array($value)) {
                        throw new SettingUpdateException("Value must be an array for type 'array'");
                    }
                    break;
            }
        }
    }
}
