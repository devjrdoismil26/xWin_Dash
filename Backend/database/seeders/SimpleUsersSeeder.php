<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel as User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SimpleUsersSeeder extends Seeder
{
    public function run(): void
    {
        echo "🌱 Criando usuários básicos...\n";

        // Verificar e criar role user
        $userRole = DB::table('roles')->where('name', 'user')->first();
        if (!$userRole) {
            $userRoleId = Str::uuid();
            DB::table('roles')->insert([
                'id' => $userRoleId,
                'name' => 'user',
                'display_name' => 'User',
                'guard_name' => 'web',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $userRoleId = $userRole->id;
        }

        // Verificar e criar role admin
        $adminRole = DB::table('roles')->where('name', 'admin')->first();
        if (!$adminRole) {
            $adminRoleId = Str::uuid();
            DB::table('roles')->insert([
                'id' => $adminRoleId,
                'name' => 'admin',
                'display_name' => 'Administrator',
                'guard_name' => 'web',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $adminRoleId = $adminRole->id;
        }

        // Verificar e criar usuário admin
        $adminUser = DB::table('users')->where('email', 'admin@xwin.com')->first();
        if (!$adminUser) {
            $adminUserId = Str::uuid();
            DB::table('users')->insert([
                'id' => $adminUserId,
                'name' => 'Admin User',
                'email' => 'admin@xwin.com',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $adminUserId = $adminUser->id;
        }

        // Verificar e criar usuário normal
        $regularUser = DB::table('users')->where('email', 'user@xwin.com')->first();
        if (!$regularUser) {
            $regularUserId = Str::uuid();
            DB::table('users')->insert([
                'id' => $regularUserId,
                'name' => 'Test User',
                'email' => 'user@xwin.com',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $regularUserId = $regularUser->id;
        }

        // Associar roles aos usuários (verificar se já existe)
        if (!DB::table('user_roles')->where(['user_id' => $adminUserId, 'role_id' => $adminRoleId])->exists()) {
            DB::table('user_roles')->insert([
                'id' => Str::uuid(),
                'user_id' => $adminUserId,
                'role_id' => $adminRoleId,
                'assigned_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        if (!DB::table('user_roles')->where(['user_id' => $regularUserId, 'role_id' => $userRoleId])->exists()) {
            DB::table('user_roles')->insert([
                'id' => Str::uuid(),
                'user_id' => $regularUserId,
                'role_id' => $userRoleId,
                'assigned_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        echo "✅ Usuários criados com sucesso!\n";
        echo "👤 Admin: admin@xwin.com / password\n";
        echo "👤 User: user@xwin.com / password\n";
    }
}
