<?php

namespace App\Domains\Core\Application\Handlers;

use App\Domains\Core\Application\Commands\CreateSettingCommand;
use App\Domains\Core\Services\SettingService;
use App\Domains\Core\Infrastructure\Persistence\Eloquent\SettingRepository;
use App\Domains\Core\Exceptions\SettingCreationException;
use Illuminate\Support\Facades\Log;

class CreateSettingHandler
{
    public function __construct(
        private SettingService $settingService,
        private SettingRepository $settingRepository
    ) {
    }

    public function handle(CreateSettingCommand $command): array
    {
        try {
            // Validar se a chave já existe
            $existingSetting = $this->settingRepository->getByKey($command->key);

            if ($existingSetting) {
                throw new SettingCreationException(
                    "Setting with key '{$command->key}' already exists"
                );
            }

            // Validar valor baseado no tipo
            $this->validateSettingValue($command->value, $command->type);

            // Criar a configuração
            $setting = $this->settingService->createSetting([
                'key' => $command->key,
                'value' => $command->value,
                'description' => $command->description,
                'type' => $command->type ?? $this->detectValueType($command->value),
                'metadata' => $command->metadata,
                'user_id' => $command->userId
            ]);

            // Log da criação
            Log::info("Setting created", [
                'setting_key' => $command->key,
                'type' => $command->type,
                'user_id' => $command->userId
            ]);

            return [
                'success' => true,
                'setting_key' => $setting->key,
                'value' => $setting->value,
                'type' => $setting->type,
                'description' => $setting->description,
                'created_at' => $setting->created_at->toISOString()
            ];
        } catch (SettingCreationException $e) {
            Log::error("Setting creation failed", [
                'setting_key' => $command->key,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        } catch (\Exception $e) {
            Log::error("Unexpected error during setting creation", [
                'setting_key' => $command->key,
                'user_id' => $command->userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw new SettingCreationException(
                "Failed to create setting: " . $e->getMessage()
            );
        }
    }

    private function validateSettingValue(mixed $value, ?string $type): void
    {
        if ($type) {
            switch ($type) {
                case 'string':
                    if (!is_string($value)) {
                        throw new SettingCreationException("Value must be a string for type 'string'");
                    }
                    break;
                case 'integer':
                    if (!is_int($value)) {
                        throw new SettingCreationException("Value must be an integer for type 'integer'");
                    }
                    break;
                case 'boolean':
                    if (!is_bool($value)) {
                        throw new SettingCreationException("Value must be a boolean for type 'boolean'");
                    }
                    break;
                case 'array':
                    if (!is_array($value)) {
                        throw new SettingCreationException("Value must be an array for type 'array'");
                    }
                    break;
            }
        }
    }

    private function detectValueType(mixed $value): string
    {
        return match (true) {
            is_string($value) => 'string',
            is_int($value) => 'integer',
            is_bool($value) => 'boolean',
            is_array($value) => 'array',
            is_float($value) => 'float',
            default => 'mixed'
        };
    }
}
