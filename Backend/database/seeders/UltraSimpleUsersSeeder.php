<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Domains\Users\Domain\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UltraSimpleUsersSeeder extends Seeder
{
    public function run(): void
    {
        echo "🌱 Criando usuários ultra simples...\n";

        // Desabilitar foreign keys para SQLite
        if (DB::getDriverName() === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = OFF;');
        }

        // Criar usuário admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@xwin.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        echo "✅ Admin criado: {$admin->name}\n";

        // Criar usuário normal
        $user = User::firstOrCreate(
            ['email' => 'user@xwin.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        echo "✅ User criado: {$user->name}\n";

        // Reabilitar foreign keys
        if (DB::getDriverName() === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = ON;');
        }

        echo "🎉 TASK-003 COMPLETADA COM SUCESSO!\n";
    }
}
