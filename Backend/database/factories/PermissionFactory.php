<?php

namespace Database\Factories;

use App\Domains\Auth\Models\Permission;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PermissionFactory extends Factory
{
    protected $model = Permission::class;

    public function definition(): array
    {
        $module = fake()->randomElement(['leads', 'products', 'campaigns', 'analytics', 'users']);
        $action = fake()->randomElement(['view', 'create', 'edit', 'delete']);
        $name = "{$module}.{$action}";
        
        return [
            'name' => $name,
            'display_name' => ucfirst($action) . ' ' . ucfirst($module),
            'description' => "Permission to {$action} {$module}",
            'module' => $module,
            'action' => $action,
            'guard_name' => 'web',
            'is_system' => false,
        ];
    }

    public function forModule(string $module): static
    {
        return $this->state(fn (array $attributes) => [
            'module' => $module,
            'name' => "{$module}.{$attributes['action']}",
            'display_name' => ucfirst($attributes['action']) . ' ' . ucfirst($module),
            'description' => "Permission to {$attributes['action']} {$module}",
        ]);
    }

    public function system(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_system' => true,
        ]);
    }
}
