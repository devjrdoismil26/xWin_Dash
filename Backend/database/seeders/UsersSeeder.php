<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

// O import de Role não é mais necessário aqui
// use App\Domains$1\Domain$2;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Criar usuários básicos para desenvolvimento
        
        // Criar usuário admin padrão
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@xwindash.com',
            'password' => bcrypt('password'),
            'is_active' => true,
        ]);

        // Criar usuário de teste
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@xwindash.com',
            'password' => bcrypt('password'),
            'is_active' => true,
        ]);

        // Criar alguns usuários aleatórios
        User::factory()->count(5)->create();

        $this->command->info('7 usuários de teste foram criados com sucesso!');
        $this->command->info('Admin: admin@xwindash.com / password');
        $this->command->info('Test: test@xwindash.com / password');
    }
}
