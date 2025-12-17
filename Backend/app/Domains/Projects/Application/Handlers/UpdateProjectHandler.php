<?php

namespace App\Domains\Projects\Application\Handlers;

use App\Domains\Projects\Application\Commands\UpdateProjectCommand;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UpdateProjectHandler
{
    public function handle(UpdateProjectCommand $command): ProjectModel
    {
        return DB::transaction(function () use ($command) {
            $project = ProjectModel::findOrFail($command->projectId);
            
            if ($command->name) {
                $project->name = $command->name;
            }
            
            if ($command->description !== null) {
                $project->description = $command->description;
            }
            
            if ($command->isActive !== null) {
                $project->is_active = $command->isActive;
            }
            
            $project->save();

            Log::info('Project updated successfully', [
                'project_id' => $project->id,
                'project_name' => $project->name
            ]);

            return $project;
        });
    }
}