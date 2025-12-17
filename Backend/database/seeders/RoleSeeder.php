<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
// Corrigindo o import para usar o Role da Spatie
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // A Spatie gerencia o guard_name automaticamente.
        // Só precisamos fornecer o nome do papel.
        Role::firstOrCreate(['name' => 'admin']);
        Role::firstOrCreate(['name' => 'user']);
        Role::firstOrCreate(['name' => 'manager']);
    }
}
