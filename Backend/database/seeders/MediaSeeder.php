<?php

namespace Database\Seeders;

use App\Domains\Media\Domain\Media;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MediaSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds for Media.
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
                Media::truncate();
            }

            $this->command->info('Seeding Media...');

            // Criar arquivos de mídia para as pastas
            $folders = Folder::take(10)->get();
            $projects = \App\Domains\Projects\Domain\Project::take(3)->get();
            $users = \App\Domains\Users\Domain\User::take(5)->get();

            foreach ($folders as $folder) {
                // Criar diferentes tipos de mídia
                $mediaTypes = [
                    ['name' => 'logo.png', 'type' => 'image'],
                    ['name' => 'banner.jpg', 'type' => 'image'],
                    ['name' => 'video-promocional.mp4', 'type' => 'video'],
                    ['name' => 'apresentacao.pdf', 'type' => 'document'],
                ];

                foreach ($mediaTypes as $mediaType) {
                    if ($mediaType['type'] === 'image') {
                        Media::factory()
                            ->image()
                            ->create([
                                'name' => $mediaType['name'],
                                'folder_id' => $folder->id,
                                'project_id' => $folder->project_id,
                                'user_id' => $folder->user_id,
                            ]);
                    } elseif ($mediaType['type'] === 'video') {
                        Media::factory()
                            ->video()
                            ->create([
                                'name' => $mediaType['name'],
                                'folder_id' => $folder->id,
                                'project_id' => $folder->project_id,
                                'user_id' => $folder->user_id,
                            ]);
                    } else {
                        Media::factory()->create([
                            'name' => $mediaType['name'],
                            'folder_id' => $folder->id,
                            'project_id' => $folder->project_id,
                            'user_id' => $folder->user_id,
                        ]);
                    }
                }
            }

            $this->command->info('Media seeded successfully!');
        }
        if (DB::connection()->getDriverName() === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = ON;');
        }
    }
}
