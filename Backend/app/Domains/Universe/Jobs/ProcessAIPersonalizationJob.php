<?php

namespace App\Domains\Universe\Jobs;

use App\Domains\Universe\Models\UniverseInstance;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessAIPersonalizationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public string $instanceId,
        public int $userId
    ) {}

    public function handle(): void
    {
        try {
            $instance = UniverseInstance::findOrFail($this->instanceId);
            $user = User::findOrFail($this->userId);
            
            $personalizations = [
                'theme' => $this->suggestTheme($user),
                'layout' => $this->suggestLayout($instance),
                'recommended_blocks' => $this->getRecommendedBlocks($user, $instance),
            ];
            
            $instance->update([
                'ai_insights' => $personalizations,
                'metadata' => array_merge($instance->metadata ?? [], [
                    'last_personalization' => now()->toISOString(),
                ]),
            ]);
            
            event(new \App\Domains\Universe\Events\AIPersonalizationCompleted($this->instanceId, $personalizations));
            
            Log::info("AI Personalization completed", ['instance_id' => $this->instanceId]);
        } catch (\Exception $e) {
            Log::error("AI Personalization failed", [
                'instance_id' => $this->instanceId,
                'error' => $e->getMessage(),
            ]);
            $this->fail($e);
        }
    }

    private function suggestTheme(User $user): string
    {
        return $user->preferences['theme'] ?? 'dark';
    }

    private function suggestLayout(UniverseInstance $instance): string
    {
        return $instance->blocks->count() > 10 ? 'grid' : 'flow';
    }

    private function getRecommendedBlocks(User $user, UniverseInstance $instance): array
    {
        $currentTypes = $instance->blocks->pluck('block_type')->toArray();
        
        $recommendations = [
            'chat' => ['workflow', 'ai'],
            'workflow' => ['analytics'],
        ];
        
        $suggested = [];
        foreach ($currentTypes as $type) {
            if (isset($recommendations[$type])) {
                $suggested = array_merge($suggested, $recommendations[$type]);
            }
        }
        
        return array_diff(array_unique($suggested), $currentTypes);
    }
}
