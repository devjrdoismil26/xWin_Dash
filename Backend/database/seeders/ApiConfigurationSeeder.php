<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Domains\Users\Models\User;
use App\Domains\Core\Http\Controllers\ApiConfigurationController;

class ApiConfigurationSeeder extends Seeder
{
    /**
     * Cria configurações padrão de API para todos os usuários existentes.
     */
    public function run(): void
    {
        $apiController = new ApiConfigurationController();

        // Obter todos os usuários
        $users = User::all();

        foreach ($users as $user) {
            // Criar configurações padrão para cada usuário
            $apiController->initializeDefaultConfigurations($user);

            $this->command->info("Configurações de API criadas para usuário: {$user->email}");
        }

        $this->command->info('Seeder de configurações de API concluído!');
    }
}
