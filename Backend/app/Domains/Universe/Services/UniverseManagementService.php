<?php

namespace App\Domains\Universe\Services;

use App\Domains\Universe\Models\UniverseInstance;
use App\Domains\Universe\Models\UniverseSnapshot;
use App\Domains\Universe\Repositories\UniverseInstanceRepository;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UniverseManagementService
{
    public function __construct(
        private UniverseInstanceRepository $repository
    ) {}

    public function createInstance(array $data): UniverseInstance
    {
        $this->validateQuota($data['user_id']);
        
        DB::beginTransaction();
        try {
            $instance = UniverseInstance::create([
                'user_id' => $data['user_id'],
                'template_id' => $data['template_id'] ?? null,
                'project_id' => $data['project_id'] ?? null,
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'modules_config' => $data['modules_config'] ?? [],
                'blocks_config' => $data['blocks_config'] ?? [],
                'canvas_state' => $data['canvas_state'] ?? [],
                'is_active' => true,
                'last_accessed_at' => now(),
            ]);
            
            // Clone blocks from template if exists
            if (!empty($data['template_id'])) {
                $template = \App\Domains\Universe\Models\UniverseTemplate::find($data['template_id']);
                if ($template) {
                    foreach ($template->blocks as $block) {
                        $instance->addBlock($block->block_type, $block->config);
                    }
                }
            }
            
            event(new \App\Domains\Universe\Events\UniverseInstanceCreated($instance));
            
            DB::commit();
            Log::info("Universe instance created", ['id' => $instance->id]);
            
            return $instance;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to create instance", ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    public function updateInstance(string $id, array $data): UniverseInstance
    {
        $instance = UniverseInstance::findOrFail($id);
        
        $changes = array_keys($data);
        
        $instance->update([
            'name' => $data['name'] ?? $instance->name,
            'description' => $data['description'] ?? $instance->description,
            'modules_config' => $data['modules_config'] ?? $instance->modules_config,
            'blocks_config' => $data['blocks_config'] ?? $instance->blocks_config,
            'canvas_state' => $data['canvas_state'] ?? $instance->canvas_state,
            'last_accessed_at' => now(),
        ]);
        
        event(new \App\Domains\Universe\Events\UniverseInstanceUpdated($instance, $changes));
        
        Log::info("Universe instance updated", ['id' => $instance->id]);
        
        return $instance->fresh();
    }

    public function deleteInstance(string $id): bool
    {
        $instance = UniverseInstance::findOrFail($id);
        
        DB::transaction(function () use ($instance) {
            $instance->blocks()->delete();
            $instance->snapshots()->delete();
            $instance->analytics()->delete();
            $instance->delete();
        });
        
        Log::info("Universe instance deleted", ['id' => $id]);
        
        return true;
    }

    public function duplicateInstance(string $id, string $newName): UniverseInstance
    {
        $original = UniverseInstance::with('blocks')->findOrFail($id);
        
        DB::beginTransaction();
        try {
            $duplicate = $this->createInstance([
                'user_id' => $original->user_id,
                'name' => $newName,
                'description' => $original->description,
                'modules_config' => $original->modules_config,
                'blocks_config' => $original->blocks_config,
                'canvas_state' => $original->canvas_state,
            ]);
            
            // Clone blocks
            foreach ($original->blocks as $block) {
                $duplicate->addBlock($block->block_type, $block->config);
            }
            
            DB::commit();
            return $duplicate;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function getInstanceById(string $id): UniverseInstance
    {
        return $this->repository->findWithBlocks($id);
    }

    public function getAllInstances(int $userId, array $filters = []): LengthAwarePaginator
    {
        return $this->repository->findByUser($userId, $filters);
    }

    public function createSnapshot(string $instanceId, string $name): UniverseSnapshot
    {
        $instance = UniverseInstance::with('blocks')->findOrFail($instanceId);
        return $instance->createSnapshot($name);
    }

    public function restoreSnapshot(string $snapshotId): bool
    {
        $snapshot = UniverseSnapshot::findOrFail($snapshotId);
        return $snapshot->instance->restoreSnapshot($snapshotId);
    }

    private function validateQuota(int $userId): void
    {
        $user = User::findOrFail($userId);
        $instanceCount = UniverseInstance::byUser($userId)->count();
        $quota = $user->quota['universe_instances'] ?? 5;
        
        if ($instanceCount >= $quota) {
            throw new \Exception("Universe instance quota exceeded. Current: {$instanceCount}, Limit: {$quota}");
        }
    }
}
