<?php

namespace Database\Seeders;

use App\Domains$1\Domain$2;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FolderSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds for Folder.
     */
    public function run(): void
    {
        // SQLite compatible foreign key handling
        if (DB::connection()->getDriverName() === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = OFF;');
        }
    {
        // Limpar dados existentes em ambiente de desenvolvimento
        if (app()->environment(['local', 'testing'])) {
                        Folder::truncate();
                    }

        $this->command->info('Seeding Folder...');

        // Criar estrutura de pastas para projetos
        $projects = \App\Domains\Projects\Domain\Project::take(3)->get();
        $users = \App\Domains\Users\Domain\User::take(5)->get();

        foreach ($projects as $project) {
            $user = $users->random();

            // Pastas raiz
            $rootFolders = [
                'Imagens' => 'Pasta para todas as imagens do projeto',
                'Vídeos' => 'Pasta para vídeos e conteúdo audiovisual',
                'Documentos' => 'Pasta para documentos e arquivos de texto',
                'Templates' => 'Pasta para templates e layouts',
            ];

            foreach ($rootFolders as $name => $description) {
                $folder = Folder::factory()->create([
                    'name' => $name,
                    'description' => $description,
                    'project_id' => $project->id,
                    'user_id' => $user->id,
                    'parent_id' => null,
                ]);

                // Subpastas
                if ($name === 'Imagens') {
                    $subfolders = ['Logos', 'Banners', 'Social Media', 'Produtos'];
                    foreach ($subfolders as $subfolder) {
                        Folder::factory()->create([
                            'name' => $subfolder,
                            'project_id' => $project->id,
                            'user_id' => $user->id,
                            'parent_id' => $folder->id,
                        ]);
                    }
                }
            }
        }

        $this->command->info('Folder seeded successfully!');
    
}
        if (DB::connection()->getDriverName() === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = ON;');
        }
}
}
