<?php

namespace App\Domains\Core\Application\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class SettingManagementService
{
    public function get(string $key, mixed $default = null): mixed
    {
        return Cache::remember("setting_{$key}", 3600, function() use ($key, $default) {
            $setting = DB::table('settings')->where('key', $key)->first();
            return $setting ? json_decode($setting->value, true) : $default;
        });
    }

    public function set(string $key, mixed $value): bool
    {
        $result = DB::table('settings')->updateOrInsert(
            ['key' => $key],
            ['value' => json_encode($value), 'updated_at' => now()]
        );

        Cache::forget("setting_{$key}");
        
        return $result;
    }

    public function getByGroup(string $group): array
    {
        return DB::table('settings')
            ->where('group', $group)
            ->get()
            ->mapWithKeys(fn($s) => [$s->key => json_decode($s->value, true)])
            ->toArray();
    }

    public function bulkUpdate(array $settings): bool
    {
        foreach ($settings as $key => $value) {
            $this->set($key, $value);
        }
        return true;
    }
}
