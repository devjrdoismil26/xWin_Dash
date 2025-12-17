<?php

namespace App\Domains\Universe\Services;

use App\Domains\Universe\Models\UniverseTemplate;
use App\Domains\Universe\Models\UniverseInstance;
use App\Domains\Universe\Repositories\UniverseTemplateRepository;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UniverseTemplateService
{
    public function __construct(
        private UniverseTemplateRepository $repository
    ) {}

    public function createFromInstance(string $instanceId, array $data): UniverseTemplate
    {
        $instance = UniverseInstance::with('blocks')->findOrFail($instanceId);
        
        DB::beginTransaction();
        try {
            $template = UniverseTemplate::create([
                'user_id' => $instance->user_id,
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'category' => $data['category'],
                'is_public' => $data['is_public'] ?? false,
                'modules_config' => $instance->modules_config,
                'blocks_config' => $instance->blocks_config,
                'connections_config' => $instance->connections_config,
                'theme_config' => $instance->theme_config,
                'layout_config' => $instance->layout_config,
            ]);
            
            // Clone blocks
            foreach ($instance->blocks as $block) {
                $template->blocks()->create([
                    'block_type' => $block->block_type,
                    'config' => $block->config,
                    'position' => $block->position,
                    'is_active' => true,
                ]);
            }
            
            DB::commit();
            Log::info("Template created from instance", ['template_id' => $template->id]);
            
            return $template;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to create template", ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    public function installTemplate(string $templateId, int $userId): UniverseInstance
    {
        $template = UniverseTemplate::with('blocks')->findOrFail($templateId);
        $user = User::findOrFail($userId);
        
        $instance = $template->cloneForUser($user);
        
        Log::info("Template installed", [
            'template_id' => $templateId,
            'instance_id' => $instance->id,
            'user_id' => $userId,
        ]);
        
        return $instance;
    }

    public function updateTemplate(string $id, array $data): UniverseTemplate
    {
        $template = UniverseTemplate::findOrFail($id);
        $template->update($data);
        
        \Cache::forget("universe:template:{$id}");
        
        Log::info("Template updated", ['template_id' => $id]);
        
        return $template->fresh();
    }

    public function deleteTemplate(string $id): bool
    {
        $template = UniverseTemplate::findOrFail($id);
        
        DB::transaction(function () use ($template) {
            $template->blocks()->delete();
            $template->ratings()->delete();
            $template->delete();
        });
        
        \Cache::forget("universe:template:{$id}");
        
        Log::info("Template deleted", ['template_id' => $id]);
        
        return true;
    }

    public function getRecommendations(int $userId, int $limit = 5): array
    {
        $user = User::findOrFail($userId);
        return $this->repository->findRecommended($user, $limit)->toArray();
    }

    public function getFeatured(): array
    {
        return $this->repository->findFeatured()->toArray();
    }

    public function getByCategory(string $category): array
    {
        return $this->repository->findByCategory($category)->toArray();
    }
}
