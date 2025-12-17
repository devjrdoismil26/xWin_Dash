<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $perms = [
            // A Spatie gerencia o guard_name automaticamente.
            // Só precisamos fornecer o nome da permissão.
            ['name' => 'manage_users'],
            ['name' => 'manage_projects'],
            ['name' => 'manage_leads'],
            ['name' => 'manage_workflows'],
            ['name' => 'manage_settings'],
        ];
        foreach ($perms as $perm) {
            // Usando firstOrCreate para garantir que não haja duplicatas
            Permission::firstOrCreate($perm);
        }
    }
}
