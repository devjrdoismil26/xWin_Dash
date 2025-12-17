<?php

namespace App\Domains\Core\Services;

use App\Domains\Core\Domain\Setting;
use App\Domains\Core\Infrastructure\Persistence\Eloquent\SettingRepository;
use Illuminate\Support\Collection;

class SettingService
{
    protected SettingRepository $settingRepository;

    public function __construct(SettingRepository $settingRepository)
    {
        $this->settingRepository = $settingRepository;
    }

    /**
     * Get all settings.
     *
     * @return array<Setting>
     */
    public function getAllSettings(): array
    {
        return $this->settingRepository->getAll();
    }

    /**
     * Get setting by key.
     *
     * @param string $key
     * @return Setting|null
     */
    public function getSettingByKey(string $key): ?Setting
    {
        return $this->settingRepository->getByKey($key);
    }

    /**
     * Create a new setting.
     *
     * @param array<string, mixed> $data
     * @return Setting
     */
    public function createSetting(array $data): Setting
    {
        return $this->settingRepository->create($data);
    }

    /**
     * Update an existing setting.
     *
     * @param string $key
     * @param array<string, mixed> $data
     * @return bool
     */
    public function updateSetting(string $key, array $data): bool
    {
        $setting = $this->settingRepository->getByKey($key);
        if (!$setting) {
            return false;
        }

        return $this->settingRepository->update((string)$setting->id, $data);
    }

    /**
     * Delete a setting.
     *
     * @param string $key
     * @return bool
     */
    public function deleteSetting(string $key): bool
    {
        $setting = $this->settingRepository->getByKey($key);
        if (!$setting) {
            return false;
        }

        return $this->settingRepository->delete((string)$setting->id);
    }

    /**
     * Get setting value by key with default fallback.
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public function getValue(string $key, mixed $default = null): mixed
    {
        $setting = $this->getSettingByKey($key);
        return $setting ? $setting->value : $default;
    }

    /**
     * Set setting value by key.
     *
     * @param string $key
     * @param mixed $value
     * @param string|null $description
     * @return Setting
     */
    public function setValue(string $key, mixed $value, ?string $description = null): Setting
    {
        $existing = $this->getSettingByKey($key);

        if ($existing) {
            $updated = $this->updateSetting($key, [
                'value' => $value,
                'description' => $description ?? $existing->description
            ]);
            return $updated ? $existing : $this->createSetting([
                'key' => $key,
                'value' => $value,
                'description' => $description
            ]);
        }

        return $this->createSetting([
            'key' => $key,
            'value' => $value,
            'description' => $description
        ]);
    }
}
