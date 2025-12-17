<?php

namespace App\Domains\Projects\Application\Handlers;

use App\Domains\Projects\Application\Commands\CreateProjectCommand;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CreateProjectHandler
{
    public function handle(CreateProjectCommand $command): ProjectModel
    {
        return DB::transaction(function () use ($command) {
            // Gerar slug baseado no nome
            $slug = Str::slug($command->name);

            // Verificar se o slug já existe
            $originalSlug = $slug;
            $counter = 1;
            while (ProjectModel::where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }

            // Criar o projeto
            $project = new ProjectModel();
            $project->name = $command->name;
            $project->description = $command->description;
            $project->slug = $slug;
            $project->owner_id = $command->userId;
            $project->is_active = true;
            $project->settings = [
                'type' => $command->type,
                'priority' => $command->priority,
                'ai_level' => $command->aiLevel,
                'universe_config' => $command->universeConfig,
                'industry' => $command->industry,
                'website' => $command->website,
                'timezone' => $command->timezone,
                'currency' => $command->currency,
            ];
            $project->custom_fields = [
                'blocks' => $command->blocks,
                'tags' => $command->tags,
                'metadata' => $command->metadata,
            ];
            $project->save();

            Log::info('Project created successfully', [
                'project_id' => $project->id,
                'project_name' => $project->name,
                'owner_id' => $project->owner_id
            ]);

            return $project;
        });
    }
}