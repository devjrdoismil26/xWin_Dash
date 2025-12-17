<?php

namespace App\Domains\Core\Application\Services;

use App\Domains\Core\Application\Commands\CreateSettingCommand;
use App\Domains\Core\Application\Commands\UpdateSettingCommand;
use App\Domains\Core\Application\Commands\DeleteSettingCommand;
use App\Domains\Core\Application\Commands\EnableModuleCommand;
use App\Domains\Core\Application\Commands\DisableModuleCommand;
use App\Domains\Core\Application\Commands\UpdateUserPreferenceCommand;
use App\Domains\Core\Application\Queries\GetSettingQuery;
use App\Domains\Core\Application\Queries\ListSettingsQuery;
use App\Domains\Core\Application\Queries\GetModuleStatusQuery;
use App\Domains\Core\Application\Queries\GetUserPreferencesQuery;
use App\Domains\Core\Application\Handlers\CreateSettingHandler;
use App\Domains\Core\Application\Handlers\UpdateSettingHandler;
use App\Domains\Core\Application\Handlers\DeleteSettingHandler;
use App\Domains\Core\Application\Handlers\GetSettingHandler;
use App\Domains\Core\Application\Handlers\ListSettingsHandler;
use App\Domains\Core\Application\Handlers\GetUserPreferencesHandler;
use App\Domains\Core\Application\Handlers\EnableModuleHandler;
use App\Domains\Core\Application\Handlers\DisableModuleHandler;
use App\Domains\Core\Application\Handlers\GetModuleStatusHandler;
use App\Domains\Core\Application\Handlers\UpdateUserPreferenceHandler;
use App\Domains\Core\Domain\SettingRepositoryInterface;

class CoreApplicationService
{
    public function __construct(
        private CreateSettingHandler $createSettingHandler,
        private UpdateSettingHandler $updateSettingHandler,
        private DeleteSettingHandler $deleteSettingHandler,
        private GetSettingHandler $getSettingHandler,
        private ListSettingsHandler $listSettingsHandler,
        private GetUserPreferencesHandler $getUserPreferencesHandler,
        private EnableModuleHandler $enableModuleHandler,
        private DisableModuleHandler $disableModuleHandler,
        private GetModuleStatusHandler $getModuleStatusHandler,
        private UpdateUserPreferenceHandler $updateUserPreferenceHandler,
        private SettingRepositoryInterface $settingRepository
    ) {
    }

    public function createSetting(CreateSettingCommand $command): array
    {
        return $this->createSettingHandler->handle($command);
    }

    public function updateSetting(UpdateSettingCommand $command): array
    {
        return $this->updateSettingHandler->handle($command);
    }

    public function deleteSetting(DeleteSettingCommand $command): array
    {
        return $this->deleteSettingHandler->handle($command);
    }

    public function getSetting(GetSettingQuery $query): array
    {
        return $this->getSettingHandler->handle($query);
    }

    public function listSettings(ListSettingsQuery $query): array
    {
        return $this->listSettingsHandler->handle($query);
    }

    public function enableModule(EnableModuleCommand $command): array
    {
        return $this->enableModuleHandler->handle($command);
    }

    public function updateUserPreference(UpdateUserPreferenceCommand $command): array
    {
        return $this->updateUserPreferenceHandler->handle($command);
    }

    public function getModuleStatus(GetModuleStatusQuery $query): array
    {
        return $this->getModuleStatusHandler->handle($query);
    }

    // Métodos de conveniência para operações comuns
    public function setAppSetting(int $userId, string $key, mixed $value, ?string $description = null): array
    {
        $command = new CreateSettingCommand(
            userId: $userId,
            key: "app.{$key}",
            value: $value,
            description: $description,
            type: $this->detectValueType($value)
        );

        return $this->createSetting($command);
    }

    public function setDatabaseSetting(int $userId, string $key, mixed $value, ?string $description = null): array
    {
        $command = new CreateSettingCommand(
            userId: $userId,
            key: "database.{$key}",
            value: $value,
            description: $description,
            type: $this->detectValueType($value)
        );

        return $this->createSetting($command);
    }

    public function setMailSetting(int $userId, string $key, mixed $value, ?string $description = null): array
    {
        $command = new CreateSettingCommand(
            userId: $userId,
            key: "mail.{$key}",
            value: $value,
            description: $description,
            type: $this->detectValueType($value)
        );

        return $this->createSetting($command);
    }

    public function enableModuleWithConfig(int $userId, string $moduleName, array $configuration = []): array
    {
        $command = new EnableModuleCommand(
            userId: $userId,
            moduleName: $moduleName,
            configuration: $configuration
        );

        return $this->enableModule($command);
    }

    public function setUserTheme(int $userId, string $theme): array
    {
        $command = new UpdateUserPreferenceCommand(
            userId: $userId,
            preferenceKey: 'theme',
            value: $theme,
            category: 'ui'
        );

        return $this->updateUserPreference($command);
    }

    public function setUserLanguage(int $userId, string $language): array
    {
        $command = new UpdateUserPreferenceCommand(
            userId: $userId,
            preferenceKey: 'language',
            value: $language,
            category: 'ui'
        );

        return $this->updateUserPreference($command);
    }

    public function setUserTimezone(int $userId, string $timezone): array
    {
        $command = new UpdateUserPreferenceCommand(
            userId: $userId,
            preferenceKey: 'timezone',
            value: $timezone,
            category: 'ui'
        );

        return $this->updateUserPreference($command);
    }

    public function setUserNotificationPreference(int $userId, string $type, bool $enabled): array
    {
        $command = new UpdateUserPreferenceCommand(
            userId: $userId,
            preferenceKey: "notifications.{$type}",
            value: $enabled,
            category: 'notifications'
        );

        return $this->updateUserPreference($command);
    }

    public function getAllModulesStatus(int $userId): array
    {
        $query = new GetModuleStatusQuery(
            userId: $userId,
            moduleName: null,
            includeConfiguration: false
        );

        return $this->getModuleStatus($query);
    }

    public function getModuleStatusByName(int $userId, string $moduleName, bool $includeConfig = false): array
    {
        $query = new GetModuleStatusQuery(
            userId: $userId,
            moduleName: $moduleName,
            includeConfiguration: $includeConfig
        );

        return $this->getModuleStatus($query);
    }

    public function getUserUIPreferences(int $userId): array
    {
        $query = new GetUserPreferencesQuery(
            userId: (string)$userId,
            category: 'ui'
        );

        return $this->getUserPreferencesHandler->handle($query);
    }

    public function getUserNotificationPreferences(int $userId): array
    {
        $query = new GetUserPreferencesQuery(
            userId: (string)$userId,
            category: 'notifications'
        );

        return $this->getUserPreferencesHandler->handle($query);
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
