<?php

namespace App\Domains\Projects\Application\Handlers;

use App\Domains\Projects\Application\Commands\DeleteProjectCommand;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DeleteProjectHandler
{
    public function handle(DeleteProjectCommand $command): bool
    {
        return DB::transaction(function () use ($command) {
            $project = ProjectModel::findOrFail($command->projectId);
            
            Log::info('Project deleted successfully', [
                'project_id' => $project->id,
                'project_name' => $project->name
            ]);
            
            return $project->delete();
        });
    }
}